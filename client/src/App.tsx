import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import LandingPage from "@/pages/LandingPage";
import UserDashboardPage from "@/pages/UserDashboardPage";
import EmployerDashboardPage from "@/pages/EmployerDashboardPage";
import NewJobDashboardPage from "@/pages/NewJobDashboardPage";
import QuickAccessPage from "@/pages/QuickAccessPage";
import MessagesPage from "@/pages/MessagesPage";
import HiringPage from "@/pages/HiringPage";
import CommunityPage from "@/pages/CommunityPage";
import FAQPage from "@/pages/FAQPage";
import JobDetailPage from "@/pages/JobDetailPage";
import NotificationsPage from "@/pages/NotificationsPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import JobCardsDemo from "@/pages/JobCardsDemo";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/jobs" component={NewJobDashboardPage} />
      <Route path="/demo" component={JobCardsDemo} />
      <Route path="/user/dashboard" component={UserDashboardPage} />
      <Route path="/employer/dashboard" component={EmployerDashboardPage} />
      <Route path="/quick-access" component={QuickAccessPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/hiring" component={HiringPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/jobs/:id" component={JobDetailPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:id" component={BlogDetailPage} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
