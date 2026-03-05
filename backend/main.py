from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
import models
import ocr_utils
import uuid
import datetime
from pydantic import BaseModel
from typing import List, Optional

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="GovTech AI Backend")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8082",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ApplicationResponse(BaseModel):
    id: int
    tracking_id: str
    name: str
    email: str
    phone: str
    address: Optional[str]
    category: Optional[str]
    department: Optional[str]
    document_name: Optional[str]
    document_desc: Optional[str]
    ocr_text: Optional[str]
    status: str
    is_verified: str
    ai_priority: int
    ai_reasoning: Optional[str]
    processing_tier: Optional[str]
    created_at: datetime.datetime

    model_config = {
        "from_attributes": True
    }

@app.get("/")
def read_root():
    return {"message": "GovTech AI Agentic Pipeline is running."}

# TIER 1: REGEX VALIDATION LOGIC
def tier1_regex_check(ocr_text: str):
    """
    Checks for patterns like Aadhaar (12-digit) or PAN (10-digit).
    """
    import re
    # Aadhaar (XXXX XXXX XXXX)
    aadhaar_match = re.search(r"\d{4}\s\d{4}\s\d{4}", ocr_text)
    # PAN (5 letters, 4 digits, 1 letter)
    pan_match = re.search(r"[A-Z]{5}[0-9]{4}[A-Z]{1}", ocr_text.upper())
    
    if aadhaar_match:
        return True, "Aadhaar Card detected and verified via Regex.", 1 # High priority
    if pan_match:
        return True, "PAN Card detected and verified via Regex.", 2 # Med-High
    
    return False, "No standard ID patterns matched in Tier 1.", 3

import google.generativeai as genai
import json

genai.configure(api_key="AIzaSyDm1PARb0c3OXonXezVtZRKaTCAB5nKhqA")

# TIER 2: LLM FALLBACK (Using Real Gemini API)
def tier2_llm_check(ocr_text: str, form_name: str):
    """
    Fallback agent that uses Gemini to read OCR and verify document validity.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        You are an AI document verification agent for a government portal.
        Extracted OCR text from the uploaded document: "{ocr_text}"
        The user submitted the name: "{form_name}"
        
        Analyze the OCR text to see if this appears to be a valid official document (ID, marksheet, tax form, etc.), and if it belongs to "{form_name}".
        Output ONLY valid JSON (no markdown formatting, no backticks) with these exactly three keys:
        - "status": "Verified" if valid and matches user, or "Flagged" if suspicious or missing name.
        - "reason": A short 1-sentence explanation of your finding (e.g., "Found name matching ABC on what appears to be a valid marksheet.")
        - "priority": An integer. 2 for standard verified docs, 4 for flagged/suspect docs, 1 for emergency/security related.
        """
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        
        # Clean markdown if accidentally included
        if text_response.startswith("```json"):
            text_response = text_response[7:-3]
        elif text_response.startswith("```"):
            text_response = text_response[3:-3]
            
        data = json.loads(text_response)
        return data.get("status", "Flagged"), data.get("reason", "Parsed LLM decision."), int(data.get("priority", 4))
        
    except Exception as e:
        print(f"LLM Error: {e}")
        # Default safety fallback if API fails
        name_verified = form_name.lower().split()[0] in ocr_text.lower() if form_name else False
        if name_verified:
            return "Verified", f"Local Fallback: name '{form_name}' exists in document.", 2
        else:
            return "Flagged", "Local Fallback: could not find matching name.", 4

@app.post("/api/submit_application")
async def submit_application(
    name: str = Form(""),
    email: str = Form(""),
    phone: str = Form(""),
    address: str = Form(""),
    category: str = Form(""),
    department: str = Form(""),
    document_name: str = Form(""),
    document_desc: str = Form(""),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)):

    tracking_id = f"GT-{uuid.uuid4().hex[:8].upper()}"
    
    # 🏃 STEP 1: OCR INGESTION
    ocr_text = ""
    if file:
        content = await file.read()
        ocr_text = ocr_utils.process_document(file.filename, content)
    else:
        ocr_text = document_desc

    # 🏃 STEP 2: TIER 1 (REGEX)
    is_v, reason, prio = tier1_regex_check(ocr_text)
    tier = "Tier 1: OCR+Regex"
    status = "Approved" if is_v else "In Review"

    # 🏃 STEP 3: TIER 2 (LLM FALLBACK)
    if not is_v:
        # Trigger Fallback Agent
        res, llm_reason, llm_prio = tier2_llm_check(ocr_text, name)
        is_v = res
        reason = llm_reason
        prio = llm_prio
        tier = "Tier 2: LLM Fallback"
        status = "Verified" if res == "Verified" else "Flagged for Review"

    # 🏃 STEP 4: ROUTING ENGINE
    # Apply department routing
    final_dept = "General"
    input_context = (ocr_text + " " + category).lower()
    if "education" in input_context or "student" in input_context or "marksheet" in input_context:
        final_dept = "Education"
    elif "health" in input_context or "medical" in input_context:
        final_dept = "Health"
    elif "tax" in input_context or "revenue" in input_context:
        final_dept = "Revenue"
    elif "police" in input_context or "fir" in input_context or "security" in input_context:
        final_dept = "Police (Home Affairs)"
        prio = 1 # Force high priority for security
    
    db_application = models.Application(
        tracking_id=tracking_id,
        name=name,
        email=email,
        phone=phone,
        address=address,
        category=category or "General",
        department=final_dept,
        document_name=document_name,
        document_desc=document_desc,
        ocr_text=ocr_text,
        status=status,
        is_verified="Verified" if is_v == True or is_v == "Verified" else "Rejected",
        ai_priority=prio,
        ai_reasoning=reason,
        processing_tier=tier
    )
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    return {"success": True, "tracking_id": tracking_id, "application": db_application}

@app.get("/api/applications", response_model=List[ApplicationResponse])
def get_applications(db: Session = Depends(get_db)):
    return db.query(models.Application).all()

@app.get("/api/applications/{tracking_id}", response_model=ApplicationResponse)
def get_application(tracking_id: str, db: Session = Depends(get_db)):
    application = db.query(models.Application).filter(models.Application.tracking_id == tracking_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
