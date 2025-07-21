import { Link } from "react-router-dom";
import { Brain, Heart } from "lucide-react";
import logo from "@/assets/logo.svg";

export const Footer = () => {
  const footerLinks = [
    { label: "About", path: "/about" },
    { label: "Terms", path: "/terms" },
    { label: "Privacy", path: "/privacy" },
  ];

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="CompetitorIQ Logo" className="h-8 w-8" />
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                CompetitorIQ
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              AI-powered competitor intelligence for smart Product Managers. 
              Stay ahead of the competition with intelligent insights.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get Started</h3>
            <div className="space-y-2">
              <Link
                to="/add"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Start Tracking
              </Link>
              <Link
                to="/how-it-works"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/track-changes"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                View Track Changes
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>in India</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 CompetitorIQ. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};