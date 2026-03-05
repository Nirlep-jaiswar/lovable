import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Users, Clock, CheckCircle, AlertTriangle, FileText, Brain, Bot, MessageSquare, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import PipelineVisual from "@/components/portal/PipelineVisual";
import { mockSubmissions, phaseNames, type PipelinePhase, type Submission } from "@/data/mockData";
import { useEffect } from "react";

const statusColors: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-800",
  processing: "bg-blue-100 text-blue-800",
  pending: "bg-gray-100 text-gray-800",
  failed: "bg-red-100 text-red-800",
};

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [classifyInput, setClassifyInput] = useState("");
  const [classifyResult, setClassifyResult] = useState<{ department: string; priority: string; reasoning: string } | null>(null);
  const [classifying, setClassifying] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/applications");
        if (response.ok) {
          const data = await response.json();
          const mapped: Submission[] = data.map((d: any) => ({
            id: d.id.toString(),
            trackingId: d.tracking_id,
            citizenName: d.name,
            category: d.category || "General",
            department: d.department || "Revenue & Tax",
            documentName: d.document_name || "Document",
            submittedAt: d.created_at,
            currentPhase: d.status === "Approved" || d.status === "Verified" ? 5 : (d.status === "Flagged for Review" ? 4 : 2),
            status: d.status,
            priority_score: d.ai_priority,
            priority: d.ai_priority <= 1 ? "critical" : d.ai_priority <= 2 ? "high" : d.ai_priority <= 3 ? "medium" : "low",
            ocrStatus: d.ocr_text ? "completed" : "pending",
            extractedFields: {
              "Tier": d.processing_tier,
              "Verification": d.is_verified,
              "AI Reason": d.ai_reasoning,
              "OCR Output": d.ocr_text ? d.ocr_text.substring(0, 150) + "..." : "No text extracted"
            },
            validationStatus: d.is_verified === "Verified" ? "valid" : "invalid",
            automationStatus: d.status === "Approved" || d.status === "Verified" ? "completed" : "pending",
            feedbackRequired: d.status === "Flagged for Review",
            feedbackMessage: d.ai_reasoning || "Please provide additional details for the application."
          }));
          setSubmissions(mapped);
        } else {
          setSubmissions([]);
        }
      } catch (error) {
        console.error("Failed to fetch submissions", error);
        setSubmissions([]);
      }
    };
    fetchSubmissions();
  }, []);

  const phaseCounts: Record<PipelinePhase, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  submissions.forEach(s => {
    const phase = (s.currentPhase as PipelinePhase) || 1;
    if (phaseCounts[phase] !== undefined) phaseCounts[phase]++;
  });

  const totalSubmissions = submissions.length;
  const inProgress = submissions.filter(s => s.currentPhase < 5).length;
  const awaitingFeedback = submissions.filter(s => s.feedbackRequired).length;
  const completed = submissions.filter(s => s.automationStatus === "completed").length;

  const handleClassify = async () => {
    setClassifying(true);
    const formData = new FormData();
    formData.append("text", classifyInput);

    try {
      const response = await fetch("http://localhost:8001/api/classify", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setClassifyResult(data);
      }
    } catch (error) {
      console.error("Classification failed", error);
    } finally {
      setClassifying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Admin header */}
      <div className="gov-gradient text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-white/60">Agentic AI Data Highway — Pipeline Management</p>
            </div>
            <Button asChild variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/">← Back to Portal</Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Submissions", value: totalSubmissions, icon: FileText, color: "text-blue-500" },
            { label: "In Progress", value: inProgress, icon: Activity, color: "text-amber-500" },
            { label: "Awaiting Response", value: awaitingFeedback, icon: AlertTriangle, color: "text-rose-500" },
            { label: "Completed", value: completed, icon: CheckCircle, color: "text-emerald-500" },
          ].map((card) => (
            <Card key={card.label}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <card.icon className={`h-8 w-8 ${card.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pipeline visualization */}
        <Card className="mb-6 bg-gov-navy border-0">
          <CardContent className="pt-6 pb-6">
            <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Live Pipeline Status</h3>
            <PipelineVisual counts={phaseCounts} />
          </CardContent>
        </Card>

        {/* Phase tabs */}
        <Tabs defaultValue="phase1" className="mb-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="phase1" className="text-xs">P1: Ingestion</TabsTrigger>
            <TabsTrigger value="phase2" className="text-xs">P2: Extraction</TabsTrigger>
            <TabsTrigger value="phase3" className="text-xs">P3: Processing</TabsTrigger>
            <TabsTrigger value="phase4" className="text-xs">P4: Feedback</TabsTrigger>
            <TabsTrigger value="phase5" className="text-xs">P5: Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="phase1">
            <Card><CardHeader><CardTitle className="text-base">Phase 1: Document Ingestion & OCR</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold">Form Type</TableHead>
                      <TableHead className="font-bold">Tracking ID</TableHead>
                      <TableHead className="font-bold">Applicant</TableHead>
                      <TableHead className="font-bold text-center">OCR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map(s => (
                      <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-semibold">{s.documentName}</TableCell>
                        <TableCell>
                          <code className="bg-primary/10 text-primary px-2 py-1 rounded text-[11px] font-bold border border-primary/20">
                            {s.trackingId}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm">{s.citizenName}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusColors[s.ocrStatus || "pending"] + " text-[10px]"}>
                            {s.ocrStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phase2">
            <Card><CardHeader><CardTitle className="text-base">Phase 2: Context-Aware Extraction</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {submissions.filter(s => s.extractedFields).map(s => (
                    <Card key={s.id} className="bg-white dark:bg-card border-primary/10 hover:border-primary/30 transition-all shadow-sm">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-bold text-sm text-foreground">{s.documentName}</p>
                          <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase">{s.trackingId.split('-').pop()}</code>
                        </div>
                        <div className="space-y-1">
                          {Object.entries(s.extractedFields!).map(([k, v]) => (
                            <div key={k} className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{k}:</span>
                              <span className="font-medium">{v}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phase3">
            <Card><CardHeader><CardTitle className="text-base">Phase 3: Agentic Processing</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold">Form Type</TableHead>
                      <TableHead className="font-bold">Tracking ID</TableHead>
                      <TableHead className="font-bold whitespace-nowrap">Category</TableHead>
                      <TableHead className="font-bold text-center">Priority</TableHead>
                      <TableHead className="font-bold text-center">Validation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.filter(s => s.validationStatus).map(s => (
                      <TableRow key={s.id} className="hover:bg-muted/30 transition-colors text-xs">
                        <TableCell className="font-semibold">{s.documentName}</TableCell>
                        <TableCell>
                          <code className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold border border-primary/20 whitespace-nowrap">
                            {s.trackingId}
                          </code>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{s.category}</TableCell>
                        <TableCell className="text-center"><Badge className={priorityColors[s.priority] + " text-[10px]"}>{s.priority}</Badge></TableCell>
                        <TableCell className="text-center"><Badge className={(s.validationStatus === "valid" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800") + " text-[10px]"}>{s.validationStatus}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phase4">
            <Card><CardHeader><CardTitle className="text-base">Phase 4: Citizen Feedback</CardTitle></CardHeader>
              <CardContent>
                {submissions.filter(s => s.feedbackRequired).map(s => (
                  <Card key={s.id} className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 mb-3">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono text-xs">{s.trackingId} — {s.citizenName}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800">Incomplete</Badge>
                      </div>
                      <div className="bg-white dark:bg-card rounded p-3 text-sm border">
                        <p className="text-xs text-muted-foreground mb-1">Auto-generated notification:</p>
                        <p className="text-sm">{s.feedbackMessage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {submissions.filter(s => s.feedbackRequired).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No pending feedback requests</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phase5">
            <Card><CardHeader><CardTitle className="text-base">Phase 5: Automation & Integration</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold">Form Type</TableHead>
                      <TableHead className="font-bold">Tracking ID</TableHead>
                      <TableHead className="font-bold">Department</TableHead>
                      <TableHead className="font-bold">Integration</TableHead>
                      <TableHead className="font-bold text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.filter(s => s.automationStatus).map(s => (
                      <TableRow key={s.id} className="hover:bg-muted/30 transition-colors text-xs">
                        <TableCell className="font-semibold">{s.documentName}</TableCell>
                        <TableCell>
                          <code className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold border border-primary/20 whitespace-nowrap">
                            {s.trackingId}
                          </code>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{s.department}</TableCell>
                        <TableCell className="italic text-muted-foreground">Legacy System API</TableCell>
                        <TableCell className="text-center">
                          <Badge className={(s.automationStatus === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800") + " text-[10px]"}>
                            {s.automationStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Classification Demo */}
        <Card className="border-gov-saffron/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-5 w-5 text-gov-saffron" />
              AI Classification Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Enter a document description and the AI will classify it into a department and priority level.
            </p>
            <Textarea
              value={classifyInput}
              onChange={e => setClassifyInput(e.target.value)}
              placeholder="e.g., Application for medical reimbursement from government hospital for surgery..."
              rows={3}
              className="mb-3"
            />
            <Button onClick={handleClassify} disabled={!classifyInput.trim() || classifying} className="bg-gov-saffron hover:bg-gov-saffron/90 text-white">
              {classifying ? "Classifying..." : "Classify Document"}
            </Button>

            {classifyResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-muted/50 rounded-lg p-4">
                <div className="flex gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="font-bold text-foreground">{classifyResult.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Priority</p>
                    <Badge className={priorityColors[classifyResult.priority]}>{classifyResult.priority}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">AI Reasoning</p>
                  <p className="text-sm text-foreground">{classifyResult.reasoning}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
