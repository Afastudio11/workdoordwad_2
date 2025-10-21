import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import HomePage from "@/pages/HomePage";
import UserDashboardPage from "@/pages/UserDashboardPage";
import EmployerDashboardPage from "@/pages/EmployerDashboardPage";
import FindCandidatePage from "@/pages/FindCandidatePage";
import FindEmployersPage from "@/pages/FindEmployersPage";
import EmployerApplicationsPage from "@/pages/EmployerApplicationsPage";
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
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminModerationPage from "@/pages/AdminModerationPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import AdminFinancialPage from "@/pages/AdminFinancialPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import AdminBlogManagerPage from "@/pages/AdminBlogManagerPage";
import AdminContentPagesPage from "@/pages/AdminContentPagesPage";
import AdminAnalyticsPage from "@/pages/AdminAnalyticsPage";
import AdminJobsPage from "@/pages/AdminJobsPage";
import AdminVerificationPage from "@/pages/AdminVerificationPage";
import AdminFraudReportsPage from "@/pages/AdminFraudReportsPage";
import ContentPage from "@/pages/ContentPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/demo" component={JobCardsDemo} />
      <Route path="/user/dashboard" component={UserDashboardPage} />
      <Route path="/find-job" component={NewJobDashboardPage} />
      <Route path="/employer/dashboard" component={EmployerDashboardPage} />
      <Route path="/find-candidate" component={FindCandidatePage} />
      <Route path="/find-employers" component={FindEmployersPage} />
      <Route path="/employer/applications" component={EmployerApplicationsPage} />
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
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/page/:slug" component={ContentPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route path="/admin/jobs" component={AdminJobsPage} />
      <Route path="/admin/moderation" component={AdminModerationPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/financial" component={AdminFinancialPage} />
      <Route path="/admin/settings" component={AdminSettingsPage} />
      <Route path="/admin/verifications" component={AdminVerificationPage} />
      <Route path="/admin/fraud-reports" component={AdminFraudReportsPage} />
      <Route path="/admin/blog" component={AdminBlogManagerPage} />
      <Route path="/admin/content" component={AdminContentPagesPage} />
      <Route path="/admin/analytics" component={AdminAnalyticsPage} />
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
