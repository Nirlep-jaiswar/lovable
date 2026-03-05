
# India.gov.in-Style Government Portal with AI Processing Dashboard

## Overview
A dual-purpose application: a citizen-facing government portal inspired by india.gov.in, plus an admin dashboard showcasing the 5-phase Agentic AI processing pipeline with real AI for document classification.

---

## Part 1: Citizen Portal (Public-Facing)

### Landing Page
- Government-styled header with national emblem, search bar, and language selector
- Hero section with quick-access service cards (e.g., Certificates, Tax, Welfare, Complaints)
- "How It Works" section showing the 5-phase AI pipeline as an animated visual flow
- Department directory grid with icons and links
- News/announcements ticker and footer with government links

### Services Page
- Categorized list of government services (Health, Education, Finance, etc.)
- Each service shows estimated processing time and required documents
- "Submit Application" flow with file upload (simulated OCR intake — Phase 1)

### Grievance/Application Submission
- Multi-step form: personal details → document upload → category selection → review & submit
- AI-powered auto-classification of the submission category using Lovable AI (Phase 2 & 3 demo)
- Confirmation page with tracking ID

### Track Application
- Enter tracking ID to see current status
- Visual pipeline tracker showing which of the 5 phases the application is in

---

## Part 2: Admin Dashboard

### Pipeline Overview
- Visual "Agentic AI Data Highway" — a horizontal flow diagram of all 5 phases with live counts
- Summary cards: Total submissions, In Progress, Awaiting Citizen Response, Completed

### Phase-by-Phase Views (Tabs)
1. **Ingestion**: List of uploaded documents with OCR status indicators
2. **Context-Aware Extraction**: Extracted fields displayed in structured cards
3. **Agentic Processing**: Classification, priority, and validation status per case
4. **Citizen Feedback**: Cases flagged as incomplete with auto-generated notification previews
5. **Automation**: Integration status showing routed department and final action

### AI Classification Demo
- Upload a document description → Lovable AI classifies it into a department and priority level
- Shows the AI reasoning in real-time (streaming response)

---

## Backend (Lovable Cloud — Minimal)
- One edge function for AI classification/prioritization using Lovable AI gateway
- Mock data for pipeline stages (no full database — stored in-memory/local state)

---

## Design
- Official government color scheme: navy blue, white, saffron/orange accents
- Clean, accessible typography with clear hierarchy
- Responsive layout for desktop and mobile
