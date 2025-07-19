import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            {/* Icon */}
            <div className="inline-flex items-center justify-center p-3 bg-gradient-primary rounded-2xl mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to track your competitors{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                the smart way?
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of Product Managers who stay ahead of the competition 
              with AI-powered insights delivered directly to their workflow.
            </p>

            {/* CTA Button */}
            <Button asChild variant="hero" size="xl" className="group">
              <Link to="/add">
                Start Tracking
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};