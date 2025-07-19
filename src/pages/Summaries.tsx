import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, TrendingUp, DollarSign, Zap } from "lucide-react";

const Summaries = () => {
  const sampleSummaries = [
    {
      company: "TechRival Co",
      date: "Dec 15, 2024",
      type: "Feature Release",
      icon: Zap,
      changes: [
        "Launched new AI-powered analytics dashboard",
        "Added real-time collaboration features",
        "Introduced enterprise SSO support"
      ],
      impact: "high"
    },
    {
      company: "CompeteNow Inc",
      date: "Dec 12, 2024", 
      type: "Pricing Update",
      icon: DollarSign,
      changes: [
        "Reduced starter plan price by 25%",
        "Added new 'Growth' tier at $49/month",
        "Included advanced reporting in all plans"
      ],
      impact: "medium"
    },
    {
      company: "MarketLeader",
      date: "Dec 10, 2024",
      type: "UI Changes",
      icon: TrendingUp,
      changes: [
        "Redesigned homepage with focus on ROI metrics",
        "Updated navigation to highlight enterprise features",
        "Added customer success stories prominently"
      ],
      impact: "low"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Competitor <span className="bg-gradient-primary bg-clip-text text-transparent">Summaries</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            See how CompetitorIQ delivers intelligent, actionable insights 
            about your competitors' latest moves.
          </p>
        </div>
      </section>

      {/* Sample summaries */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Sample Weekly Summary
            </h2>
            
            <div className="space-y-6">
              {sampleSummaries.map((summary, index) => (
                <Card key={index} className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <summary.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{summary.company}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{summary.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{summary.type}</Badge>
                        <Badge className={getImpactColor(summary.impact)}>
                          {summary.impact} impact
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {summary.changes.map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12 p-8 bg-muted/20 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">
                Want summaries like this for your competitors?
              </h3>
              <p className="text-muted-foreground mb-6">
                Start tracking your competitors and get intelligent weekly summaries 
                delivered to your inbox or Slack.
              </p>
              <Button asChild variant="hero" size="lg">
                <Link to="/add">
                  Start Tracking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Summaries;