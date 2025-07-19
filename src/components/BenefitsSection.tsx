import { Card, CardContent } from "@/components/ui/card";
import { Zap, DollarSign, TrendingUp, Brain } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Stay ahead of feature releases",
      description: "Never miss when competitors launch new features or update their product capabilities.",
    },
    {
      icon: DollarSign,
      title: "Catch silent pricing changes",
      description: "Get instant alerts when competitors adjust their pricing, plans, or promotional offers.",
    },
    {
      icon: TrendingUp,
      title: "Know what your market is doing",
      description: "Understand market trends and competitive positioning across your entire industry landscape.",
    },
    {
      icon: Brain,
      title: "AI-written updates, not noise",
      description: "Receive intelligent summaries that focus on what matters, not overwhelming raw data dumps.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why PMs love{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              CompetitorIQ
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop manually checking competitor websites and start getting intelligent insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-300 group hover:shadow-elevated"
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit group-hover:bg-primary/20 transition-colors group-hover:shadow-glow-primary">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};