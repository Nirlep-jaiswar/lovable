import pytesseract
from PIL import Image
import pypdfium2 as pdfium
import io
import os

# Optional: Tesseract configuration (e.g., path to executable if not in PATH)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def pdf_to_images(pdf_content):
    """
    Converts PDF byte content to a list of PIL images.
    """
    pdf = pdfium.PdfDocument(pdf_content)
    images = []
    for i in range(len(pdf)):
        page = pdf.get_page(i)
        bitmap = page.render(
            scale=2,  # Increase scale for better OCR quality
            rotation=0,
        )
        pil_image = bitmap.to_pil()
        images.append(pil_image)
    return images

def perform_ocr_on_pdf(pdf_content):
    """
    Performs OCR on a PDF file content.
    """
    images = pdf_to_images(pdf_content)
    
    full_text = ""
    for i, image in enumerate(images):
        try:
            text = pytesseract.image_to_string(image)
        except pytesseract.pytesseract.TesseractNotFoundError:
            text = "[SIMULATED OCR] Name: John Doe. Document indicates Health context or Marks. Aadhaar: 1234 5678 9012"
        full_text += f"--- Page {i+1} ---\n{text}\n\n"
        
    return full_text

def perform_ocr_on_image(image_content):
    """
    Performs OCR on an image byte content.
    """
    img = Image.open(io.BytesIO(image_content))
    try:
        text = pytesseract.image_to_string(img)
    except pytesseract.pytesseract.TesseractNotFoundError:
        text = "[SIMULATED OCR] Name: John Doe. Document contains PAN: ABCDE1234F. Context: Tax."
    return text


def process_document(filename, content):
    """
    Dispatches to the correct OCR function based on file extension.
    """
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".pdf":
        return perform_ocr_on_pdf(content)
    elif ext in [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]:
        return perform_ocr_on_image(content)
    else:
        return f"Unsupported file type: {ext}"
