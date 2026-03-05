import { motion } from "framer-motion";
import { ArrowRight, FileText, Search, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import NewsTicker from "@/components/portal/NewsTicker";
import PipelineVisual from "@/components/portal/PipelineVisual";
import { departments } from "@/data/mockData";

const quickServices = [
  { label: "Certificates", icon: FileText, color: "from-blue-500 to-blue-600", desc: "Birth, Death, Income, Caste" },
  { label: "Tax & Revenue", icon: Shield, color: "from-amber-500 to-amber-600", desc: "Income Tax, GST, Property" },
  { label: "Track Application", icon: Search, color: "from-emerald-500 to-emerald-600", desc: "Check your application status" },
  { label: "Grievance", icon: Clock, color: "from-rose-500 to-rose-600", desc: "File and track complaints" },
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <NewsTicker />

      <main className="flex-1">
        {/* Hero */}
        <section className="gov-gradient text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight"
              >
                AI-Powered Government
                <span className="text-gov-saffron block">Services at Your Fingertips</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/80 mb-8"
              >
                Experience the future of governance with our 5-phase Agentic AI processing pipeline
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Button asChild size="lg" className="bg-gov-saffron hover:bg-gov-saffron/90 text-white font-bold">
                  <Link to="/submit">Submit Application <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/track">Track Application</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Access Services */}
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Quick Access Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickServices.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to="/services">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group border-0 overflow-hidden">
                      <CardContent className={`p-0`}>
                        <div className={`bg-gradient-to-br ${s.color} p-4 text-white`}>
                          <s.icon className="h-8 w-8 mb-2" />
                          <h4 className="font-bold text-sm">{s.label}</h4>
                        </div>
                        <p className="px-4 py-3 text-xs text-muted-foreground">{s.desc}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Pipeline */}
        <section className="py-12 bg-gov-navy">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-2 text-white">
              How It Works: <span className="text-gov-saffron">Agentic AI Data Highway</span>
            </h3>
            <p className="text-center text-white/60 mb-8 text-sm">
              Your application flows through 5 intelligent processing phases
            </p>
            <PipelineVisual />
          </div>
        </section>

        {/* Departments */}
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Department Directory</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {departments.map((dept, i) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="hover:shadow-md transition-all cursor-pointer hover:border-gov-saffron text-center p-4 h-full">
                    <dept.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-semibold text-foreground leading-tight">{dept.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{dept.count} services</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
