import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Brain, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth, SignInButton, UserButton, useSignIn } from "@clerk/clerk-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const location = useLocation();
  const signIn = useSignIn();
  useEffect(() => {
    if (location.state && location.state.openLogin) {
      // Programmatically open the sign-in modal by simulating a click on the SignInButton
      const signInBtn = document.getElementById("sign-in-btn");
      if (signInBtn) {
        signInBtn.click();
      }
    }
  }, [location.state]);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Let the first render happen quickly; set hydrated after mount
    setHydrated(true);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Summaries", path: "/summaries" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CompetitorIQ
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {hydrated && isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button id="sign-in-btn" variant="outline" size="sm">Login</Button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium py-2 transition-colors ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {hydrated && isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <SignInButton mode="modal">
                  <Button id="sign-in-btn" variant="outline" size="sm" className="self-start">Login</Button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
