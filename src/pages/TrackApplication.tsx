import { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import PipelineVisual from "@/components/portal/PipelineVisual";
import { mockSubmissions, phaseNames, type Submission, type PipelinePhase } from "@/data/mockData";
import { useSearchParams } from "react-router-dom";

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const TrackApplication = () => {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get("id") || "");
  const [result, setResult] = useState<Submission | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/applications/${trackingId}`);
      if (response.ok) {
        const data = await response.json();
        // Map backend model to frontend Submission type
        const mappedData: Submission = {
          id: data.id.toString(),
          trackingId: data.tracking_id,
          citizenName: data.name,
          category: data.category || "General",
          department: data.department || "Revenue & Tax",
          documentName: data.document_name || "Document",
          submittedAt: data.created_at,
          currentPhase: 1, // Start at phase 1
          status: data.status,
          priority: "medium", // Default
          ocrStatus: data.ocr_text ? "completed" : "pending"
        };
        setResult(mappedData);
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error("Search failed", error);
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Track Your Application</h2>
        <p className="text-muted-foreground mb-6">Enter your tracking ID to see the current status in the AI pipeline</p>

        <Card className="max-w-xl mx-auto mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                placeholder="e.g., GOV-2026-00142"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} className="bg-primary shrink-0">
                <Search className="h-4 w-4 mr-2" /> Track
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Try: GOV-2026-00142, GOV-2026-00287, GOV-2026-00391</p>
          </CardContent>
        </Card>

        {notFound && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="pt-6 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">No application found with tracking ID: {trackingId}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
            {/* Pipeline tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pipeline Status</CardTitle>
              </CardHeader>
              <CardContent>
                <PipelineVisual activePhase={result.currentPhase as PipelinePhase} compact />
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Currently in <strong className="text-foreground">Phase {result.currentPhase}: {phaseNames[result.currentPhase as PipelinePhase]}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{result.status}</p>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Application Details</CardTitle>
                  <Badge className={priorityColors[result.priority]}>{result.priority} priority</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Tracking ID</p><p className="font-mono font-bold">{result.trackingId}</p></div>
                <div><p className="text-muted-foreground">Applicant</p><p className="font-medium">{result.citizenName}</p></div>
                <div><p className="text-muted-foreground">Category</p><p>{result.category}</p></div>
                <div><p className="text-muted-foreground">Department</p><p>{result.department}</p></div>
                <div><p className="text-muted-foreground">Document</p><p>{result.documentName}</p></div>
                <div><p className="text-muted-foreground">Submitted</p><p>{new Date(result.submittedAt).toLocaleDateString()}</p></div>
              </CardContent>
            </Card>

            {result.feedbackRequired && (
              <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="pt-6">
                  <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">⚠️ Action Required</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">{result.feedbackMessage}</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TrackApplication;
