import { FileText, Shield, Heart, GraduationCap, Landmark, Building2, Users, Truck, Leaf, Scale, Briefcase, Phone } from "lucide-react";

export type PipelinePhase = 1 | 2 | 3 | 4 | 5;

export interface Submission {
  id: string;
  trackingId: string;
  citizenName: string;
  category: string;
  department: string;
  priority: "low" | "medium" | "high" | "critical";
  currentPhase: PipelinePhase;
  status: string;
  submittedAt: string;
  documentName: string;
  extractedFields?: Record<string, string>;
  validationStatus?: "valid" | "invalid" | "pending";
  feedbackRequired?: boolean;
  feedbackMessage?: string;
  automationStatus?: "routed" | "processing" | "completed";
  ocrStatus?: "pending" | "processing" | "completed" | "failed";
}

export const phaseNames: Record<PipelinePhase, string> = {
  1: "Ingestion",
  2: "Context-Aware Extraction",
  3: "Agentic Processing",
  4: "Citizen Feedback",
  5: "Automation",
};

export const phaseDescriptions: Record<PipelinePhase, string> = {
  1: "Documents digitized through OCR",
  2: "AI organizes into structured data",
  3: "Classification, Prioritization & Validation",
  4: "Incomplete submission detection & communication",
  5: "Integration with departmental systems",
};

export const phaseColors: Record<PipelinePhase, string> = {
  1: "bg-blue-500",
  2: "bg-purple-500",
  3: "bg-amber-500",
  4: "bg-rose-500",
  5: "bg-emerald-500",
};

export const departments = [
  { name: "Revenue & Tax", icon: Landmark, count: 12 },
  { name: "Health & Family Welfare", icon: Heart, count: 8 },
  { name: "Education", icon: GraduationCap, count: 15 },
  { name: "Home Affairs", icon: Shield, count: 6 },
  { name: "Urban Development", icon: Building2, count: 10 },
  { name: "Social Justice", icon: Users, count: 9 },
  { name: "Transport", icon: Truck, count: 7 },
  { name: "Environment", icon: Leaf, count: 5 },
  { name: "Law & Justice", icon: Scale, count: 4 },
  { name: "Labour & Employment", icon: Briefcase, count: 11 },
  { name: "Telecommunications", icon: Phone, count: 3 },
  { name: "Documentation", icon: FileText, count: 14 },
];

export const services = [
  {
    name: "Birth Certificate",
    category: "Certificates",
    department: "Revenue & Tax",
    time: "3-5 days",
    docs: ["ID Proof", "Hospital Record"],
    procedure: [
      "Obtain birth certificate application from hospital or municipal office.",
      "Fill in child's name, parent's information, and date of birth.",
      "Attach proof of birth from the hospital/nursing home.",
      "Submit the form and pay the required fee.",
      "Collect certificate after verification."
    ]
  },
  {
    name: "Income Tax Filing",
    category: "Finance",
    department: "Revenue & Tax",
    time: "1-2 days",
    docs: ["PAN Card", "Form 16"],
    procedure: [
      "Link PAN with Aadhaar if not already done.",
      "Gather Form 16 from employer and bank statements.",
      "Log in to the E-filing portal.",
      "Fill the appropriate ITR form according to your income source.",
      "E-verify the return using Aadhaar OTP."
    ]
  },
  {
    name: "Ration Card Application",
    category: "Welfare",
    department: "Social Justice",
    time: "7-14 days",
    docs: ["ID Proof", "Address Proof", "Income Certificate"],
    procedure: [
      "Select the appropriate application form (BPL/APL).",
      "Attach passport size photos of the head of the family.",
      "Submit family member details and income proof.",
      "Submit at the local Food & Civil Supplies office.",
      "Undergo field verification by the Inspector."
    ]
  },
  {
    name: "Driving License",
    category: "Transport",
    department: "Transport",
    time: "5-7 days",
    docs: ["ID Proof", "Address Proof", "Medical Certificate"],
    procedure: [
      "Apply for a Learner's License first.",
      "Pass the online computerized test.",
      "After 30 days, apply for the Permanent Driving License.",
      "Book a slot for a driving test at the RTO.",
      "Pass the driving test to receive the license."
    ]
  },
  {
    name: "Passport Application",
    category: "Documentation",
    department: "Home Affairs",
    time: "15-30 days",
    docs: ["ID Proof", "Address Proof", "Birth Certificate"],
    procedure: [
      "Register on the Passport Seva portal.",
      "Pay the fee and book an appointment at PSK.",
      "Attend the appointment with all original documents.",
      "Undergo biometric data collection.",
      "Undergo Police Verification at your residence."
    ]
  },
  {
    name: "Property Registration",
    category: "Revenue",
    department: "Revenue & Tax",
    time: "7-10 days",
    docs: ["Sale Deed", "ID Proof", "Tax Receipt"],
    procedure: [
      "Calculate the stamp duty and registration fees.",
      "Purchase e-stamp paper.",
      "Prepare the final sale deed with witnesses.",
      "Book an appointment at the Sub-Registrar office.",
      "Both parties must be present for biometric capture."
    ]
  },
  {
    name: "Senior Citizen Card",
    category: "Welfare",
    department: "Social Justice",
    time: "5-7 days",
    docs: ["ID Proof", "Age Proof"],
    procedure: [
      "Verify you are above 60 years of age.",
      "Fill the application form at the District Social Welfare Office.",
      "Attach age proof (Aadhaar/Voter ID).",
      "Submit two passport size photographs.",
      "Collect the card after verification."
    ]
  },
  {
    name: "Environmental Clearance",
    category: "Environment",
    department: "Environment",
    time: "30-60 days",
    docs: ["Project Report", "EIA Report"],
    procedure: [
      "Submit Form 1 with a detailed project report.",
      "Conduct an Environmental Impact Assessment (EIA).",
      "Hold a public hearing for stakeholders.",
      "Review by the Appraisal Committee.",
      "Approval or rejection by the Ministry."
    ]
  },
  {
    name: "School Admission",
    category: "Education",
    department: "Education",
    time: "Variable",
    docs: ["Birth Certificate", "Previous Marks", "Transfer Certificate"],
    procedure: [
      "Check the school's online admission notification.",
      "Complete the online registration form.",
      "Upload birth certificate and previous academic records.",
      "Attend the interaction or entrance test if required.",
      "Complete fee payment upon selection."
    ]
  },
  {
    name: "Health Insurance (PMJAY)",
    category: "Health",
    department: "Health & Family Welfare",
    time: "7-14 days",
    docs: ["ID Proof", "Income Certificate", "Family Card"],
    procedure: [
      "Check eligibility on the PMJAY portal.",
      "Visit an empanelled hospital or CSC center.",
      "Provide Aadhaar card or Ration card.",
      "Complete biometric verification.",
      "Receive your Golden Card for free treatment."
    ]
  },
];

export const newsItems = [
  "Digital India Programme: 100 Crore Aadhaar milestone achieved",
  "New Online Portal for Pension Disbursement launched",
  "PM Vishwakarma Yojana applications now open for artisans",
  "Smart Cities Mission: Phase 3 approved for 50 cities",
  "National Education Policy 2024 implementation guidelines released",
];

const generateTrackingId = (serviceName?: string) => {
  const prefix = "GT";
  const cleanName = serviceName ? serviceName.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10) : "APP";
  const year = "2026";
  const num = Math.random().toString(16).substring(2, 10).toUpperCase();
  return `${prefix}-${cleanName}-${num}`;
};

export const mockSubmissions: Submission[] = [
  {
    id: "1", trackingId: "GT-BIRTHCERT-A1B2C3D4", citizenName: "Rajesh Kumar",
    category: "Certificates", department: "Revenue & Tax", priority: "medium",
    currentPhase: 3, status: "Under Classification", submittedAt: "2026-03-01T10:30:00",
    documentName: "Birth Certificate",
    extractedFields: { "Name": "Rajesh Kumar", "DOB": "1990-05-15", "Father": "Suresh Kumar" },
    validationStatus: "valid", ocrStatus: "completed",
  },
  {
    id: "2", trackingId: "GT-RATIONCARD-E5F6G7H8", citizenName: "Priya Sharma",
    category: "Welfare", department: "Social Justice", priority: "high",
    currentPhase: 4, status: "Awaiting Documents", submittedAt: "2026-02-28T14:15:00",
    documentName: "Ration Card Application",
    extractedFields: { "Name": "Priya Sharma", "Family Size": "5", "Income": "₹1,80,000" },
    validationStatus: "invalid", feedbackRequired: true,
    feedbackMessage: "Income certificate is missing. Please upload a valid income certificate.",
    ocrStatus: "completed",
  },
  {
    id: "3", trackingId: "GT-DRIVERSLIC-I9J0K1L2", citizenName: "Amit Patel",
    category: "Transport", department: "Transport", priority: "low",
    currentPhase: 5, status: "Routed to Department", submittedAt: "2026-02-25T09:00:00",
    documentName: "Driving License",
    extractedFields: { "Name": "Amit Patel", "License No": "DL-2020-98765", "Expiry": "2026-04-01" },
    validationStatus: "valid", automationStatus: "routed", ocrStatus: "completed",
  },
  {
    id: "4", trackingId: "GT-HEALTHINS-M3N4O5P6", citizenName: "Sunita Devi",
    category: "Health", department: "Health & Family Welfare", priority: "critical",
    currentPhase: 1, status: "Document Scanning", submittedAt: "2026-03-05T08:45:00",
    documentName: "Health Insurance (PMJAY)", ocrStatus: "processing",
  },
  {
    id: "5", trackingId: "GT-SCHOOLADM-Q7R8S9T0", citizenName: "Mohammed Ali",
    category: "Education", department: "Education", priority: "medium",
    currentPhase: 2, status: "Data Extraction", submittedAt: "2026-03-04T11:20:00",
    documentName: "School Admission",
    extractedFields: { "Student": "Fatima Ali", "School": "KV Hyderabad", "Class": "VIII" },
    ocrStatus: "completed",
  },
  {
    id: "6", trackingId: "GT-PROPERTYRE-U1V2W3X4", citizenName: "Lakshmi Iyer",
    category: "Revenue", department: "Revenue & Tax", priority: "high",
    currentPhase: 5, status: "Completed", submittedAt: "2026-02-20T16:00:00",
    documentName: "Property Registration",
    extractedFields: { "Owner": "Lakshmi Iyer", "Property": "Plot 42, Anna Nagar", "Value": "₹85,00,000" },
    validationStatus: "valid", automationStatus: "completed", ocrStatus: "completed",
  },
];

export const generateNewTrackingId = generateTrackingId;
