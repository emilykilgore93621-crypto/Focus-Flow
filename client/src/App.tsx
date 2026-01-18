import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import GoalsPage from "@/pages/GoalsPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ResourceDetail from "@/pages/ResourceDetail";
import InterviewPrepPage from "@/pages/InterviewPrepPage";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      {/* Protected Routes - Need a wrapper or just simple check inside pages, 
          but wrapper is cleaner for "Dashboard" which is conceptually "/" for logged in users.
          Since wouter matches strictly, we can have "/" for Landing, 
          but usually apps redirect logged-in users from Landing to Dashboard.
          We handled this inside Landing page.
          
          However, to make the sidebar links work properly, we need explicit paths.
      */}
      
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/goals">
        <ProtectedRoute component={GoalsPage} />
      </Route>

      <Route path="/resources">
        <ProtectedRoute component={ResourcesPage} />
      </Route>

      <Route path="/resources/:id">
        <ProtectedRoute component={ResourceDetail} />
      </Route>

      <Route path="/interview-prep">
        <ProtectedRoute component={InterviewPrepPage} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // If user is logged in, "/" should render Dashboard, not Landing.
  // We handle this logic inside the Landing component for simplicity with Wouter.
  // Landing component checks auth and redirects if needed.

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
