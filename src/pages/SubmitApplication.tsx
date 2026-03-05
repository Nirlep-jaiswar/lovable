import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Upload, Tag, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { useSearchParams } from "react-router-dom";
import { generateNewTrackingId, departments, services } from "@/data/mockData";
import { ListChecks } from "lucide-react";

const steps = [
  { label: "Personal Details", icon: User },
  { label: "Document Upload", icon: Upload },
  { label: "Category Selection", icon: Tag },
  { label: "Review & Submit", icon: CheckCircle },
];

const SubmitApplication = () => {
  const [searchParams] = useSearchParams();
  const serviceName = searchParams.get("service");
  const selectedService = services.find(s => s.name === serviceName);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "",
    documentName: selectedService ? selectedService.name : "",
    documentDesc: "",
    category: selectedService ? selectedService.category : "",
    department: selectedService ? selectedService.department : "",
  });

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("category", form.category);
    formData.append("department", form.department);
    formData.append("document_name", form.documentName);
    formData.append("document_desc", form.documentDesc);

    const anyForm = form as any;
    if (anyForm.selectedFile) {
      formData.append("file", anyForm.selectedFile);
    }

    try {
      const response = await fetch("http://localhost:8001/api/submit_application", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setTrackingId(data.tracking_id);
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-gov-green/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-gov-green" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-4">Your application has entered Phase 1 of the AI processing pipeline.</p>
            <Card className="bg-muted/50 mb-6">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Tracking ID</p>
                <p className="text-2xl font-mono font-bold text-primary">{trackingId}</p>
              </CardContent>
            </Card>
            <Button asChild className="bg-primary"><a href={`/track?id=${trackingId}`}>Track Your Application <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-foreground">Submit Application</h2>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-gov-green text-white" : "bg-muted text-muted-foreground"
                }`}>
                <s.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-4 md:w-8 h-0.5 bg-border mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mx-auto">
              <CardHeader>
                <CardTitle>{steps[step].label}</CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    {step === 0 && (
                      <div className="space-y-4">
                        <div><Label>Full Name</Label><Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Enter your full name" /></div>
                        <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="email@example.com" /></div>
                        <div><Label>Phone</Label><Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 9876543210" /></div>
                        <div><Label>Address</Label><Textarea value={form.address} onChange={e => update("address", e.target.value)} placeholder="Enter your address" /></div>
                      </div>
                    )}
                    {step === 1 && (
                      <div className="space-y-4">
                        <div><Label>Document Name</Label><Input value={form.documentName} onChange={e => update("documentName", e.target.value)} placeholder="e.g., Birth Certificate Application" /></div>
                        <div><Label>Document Description</Label><Textarea value={form.documentDesc} onChange={e => update("documentDesc", e.target.value)} placeholder="Describe the document or paste its contents..." rows={5} /></div>
                        <div
                          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => document.getElementById("fileInput")?.click()}
                        >
                          <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                update("documentName", file.name);
                                setForm(prev => ({ ...prev, selectedFile: file }));
                              }
                            }}
                          />
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {form.documentName ? `Selected: ${form.documentName}` : "Drag & drop files here or click to browse"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">(OCR Phase 1 will process this document)</p>
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="space-y-4">
                        <div>
                          <Label>Category</Label>
                          <Select value={form.category} onValueChange={v => update("category", v)}>
                            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                            <SelectContent>
                              {["Certificates", "Finance", "Welfare", "Transport", "Documentation", "Revenue", "Health", "Education", "Environment"].map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Department</Label>
                          <Select value={form.department} onValueChange={v => update("department", v)}>
                            <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                            <SelectContent>
                              {departments.map(d => (
                                <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          💡 In the live system, AI would auto-classify your submission based on the uploaded document (Phase 2 & 3).
                        </p>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Review Your Application</h4>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                          <p><strong>Name:</strong> {form.name || "—"}</p>
                          <p><strong>Email:</strong> {form.email || "—"}</p>
                          <p><strong>Phone:</strong> {form.phone || "—"}</p>
                          <p><strong>Document:</strong> {form.documentName || "—"}</p>
                          <p><strong>Category:</strong> {form.category || "—"}</p>
                          <p><strong>Department:</strong> {form.department || "—"}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  {step < 3 ? (
                    <Button onClick={() => setStep(s => s + 1)} className="bg-primary">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className="bg-gov-green hover:bg-gov-green/90 text-white">
                      Submit Application <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {selectedService ? (
              <Card className="sticky top-8 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" />
                    Procedure & Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Service: {selectedService.name}</h4>
                      <p className="text-xs text-muted-foreground mb-4">Estimated Time: {selectedService.time}</p>
                    </div>

                    <div className="space-y-3">
                      {selectedService.procedure?.map((line, idx) => (
                        <div key={idx} className="flex gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <p className="text-xs leading-relaxed">{line}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-primary/10">
                      <h4 className="text-xs font-semibold mb-2">Required Documents:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.docs.map(doc => (
                          <span key={doc} className="text-[10px] bg-white border border-primary/10 rounded px-2 py-1 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-gov-green" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full border-dashed border-2 flex items-center justify-center p-8 text-center text-muted-foreground">
                <p className="text-sm italic">Select a service to see specific instructions and procedure.</p>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitApplication;
