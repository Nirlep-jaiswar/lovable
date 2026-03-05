import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { services } from "@/data/mockData";

const categories = ["All", ...new Set(services.map(s => s.category))];

const Services = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = services.filter(s => {
    const matchCat = filter === "All" || s.category === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Government Services</h2>
        <p className="text-muted-foreground mb-6">Browse and apply for government services online</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:max-w-xs"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={filter === cat ? "default" : "outline"}
                onClick={() => setFilter(cat)}
                className={filter === cat ? "bg-primary" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{service.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{service.department}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Processing: {service.time}</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-medium text-foreground mb-1">Required Documents:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.docs.map(doc => (
                        <span key={doc} className="inline-flex items-center gap-1 text-[10px] bg-muted rounded px-2 py-0.5">
                          <FileText className="h-2.5 w-2.5" />{doc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button asChild size="sm" className="w-full bg-primary">
                    <Link to={`/submit?service=${encodeURIComponent(service.name)}`}>
                      Apply Now <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
