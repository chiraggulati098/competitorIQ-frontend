import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How <span className="bg-gradient-primary bg-clip-text text-transparent">CompetitorIQ</span> Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover how our AI-powered platform transforms competitor monitoring 
            into actionable insights for your product strategy.
          </p>
        </div>
      </section>

      <HowItWorksSection />

      {/* CTA Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">
            Set up your first competitor tracking in under 2 minutes.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/add">
              Start Tracking Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;