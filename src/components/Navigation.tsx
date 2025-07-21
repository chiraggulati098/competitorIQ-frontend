import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Brain, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth, SignInButton, UserButton, useSignIn } from "@clerk/clerk-react";
import logo from "@/assets/logo.svg";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const location = useLocation();
  const signIn = useSignIn();
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (location.state && location.state.openLogin) {
      const signInBtn = document.getElementById("sign-in-btn");
      if (signInBtn) {
        signInBtn.click();
      }
    }
  }, [location.state]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const sendJwtToBackend = async () => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          try {
            await fetch("http://localhost:8000/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              }
            });
          } catch (err) {
          }
        }
      }
    };
    sendJwtToBackend();
  }, [isSignedIn, getToken]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Track Changes", path: "/track-changes" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={logo} alt="CompetitorIQ Logo" className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CompetitorIQ
            </span>
          </Link>

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

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

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
