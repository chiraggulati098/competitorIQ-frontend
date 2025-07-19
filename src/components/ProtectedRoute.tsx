import { useAuth, SignInButton } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();
  const location = useLocation();

  if (!isSignedIn) {
    return (
      <Navigate to="/" state={{ from: location, openLogin: true }} replace />
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
