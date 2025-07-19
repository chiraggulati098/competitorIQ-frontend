import { Card, CardContent } from "@/components/ui/card";
import { Plus, Eye, Mail } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Plus,
      title: "Add competitor URLs",
      description: "Simply paste the URLs of competitors' websites, pricing pages, and social profiles you want to monitor.",
    },
    {
      icon: Eye,
      title: "We monitor pages & social updates",
      description: "Our AI continuously scans for changes in features, pricing, content, and announcements across all platforms.",
    },
    {
      icon: Mail,
      title: "You get weekly summaries",
      description: "Receive concise, AI-written reports delivered directly to your Slack workspace or email inbox.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Set up competitor tracking in minutes with our simple three-step process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-gradient-card border-border/50 hover:border-primary/20 transition-all duration-300 group hover:shadow-elevated">
                <CardContent className="p-8 text-center">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mx-auto mb-6 p-4 bg-primary/10 rounded-2xl w-fit group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>

              {/* Connector arrow (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent" />
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-accent border-y-2 border-y-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};