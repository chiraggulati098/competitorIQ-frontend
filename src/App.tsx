import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import TrackChanges from "./pages/Summaries";
import AddCompetitor from "./pages/AddCompetitor";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageTracking from "./pages/ManageTracking";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/track-changes" element={
            <ProtectedRoute>
              <TrackChanges />
            </ProtectedRoute>
          } />
          <Route path="/add" element={
            <ProtectedRoute>
              <AddCompetitor />
            </ProtectedRoute>
          } />
          <Route path="/manage-tracking" element={<ManageTracking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
