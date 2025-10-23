import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import UserDashboardPage from "@/pages/UserDashboardPage";
import EmployerDashboardPage from "@/pages/EmployerDashboardPage";
import FindCandidatePage from "@/pages/FindCandidatePage";
import FindEmployersPage from "@/pages/FindEmployersPage";
import EmployerApplicationsPage from "@/pages/EmployerApplicationsPage";
import AnalyticsDashboardPage from "@/pages/employer/AnalyticsDashboardPage";
import CVDatabasePage from "@/pages/employer/CVDatabasePage";
import NewJobDashboardPage from "@/pages/NewJobDashboardPage";
import QuickAccessPage from "@/pages/QuickAccessPage";
import MessagesPage from "@/pages/MessagesPage";
import HiringPage from "@/pages/HiringPage";
import CommunityPage from "@/pages/CommunityPage";
import FAQPage from "@/pages/FAQPage";
import JobDetailPage from "@/pages/JobDetailPage";
import NotificationsPage from "@/pages/NotificationsPage";
import RegisterRoleSelectionPage from "@/pages/RegisterRoleSelectionPage";
import RegisterJobSeekerPage from "@/pages/RegisterJobSeekerPage";
import RegisterEmployerPage from "@/pages/RegisterEmployerPage";
import PricingPage from "@/pages/PricingPage";
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
import AdminCompaniesPage from "@/pages/AdminCompaniesPage";
import ContentPage from "@/pages/ContentPage";
import JobsPage from "@/pages/JobsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/demo" component={JobCardsDemo} />
      <Route path="/register" component={RegisterRoleSelectionPage} />
      <Route path="/register/job-seeker" component={RegisterJobSeekerPage} />
      <Route path="/register/employer" component={RegisterEmployerPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetailPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/page/:slug" component={ContentPage} />
      <Route path="/jobs" component={JobsPage} />
      <Route path="/jobs/:id" component={JobDetailPage} />
      <Route path="/faq" component={FAQPage} />
      
      <Route path="/user/dashboard">
        <ProtectedRoute allowedRoles={["pekerja"]}>
          <UserDashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/find-job">
        <ProtectedRoute allowedRoles={["pekerja"]}>
          <NewJobDashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/notifications">
        <ProtectedRoute allowedRoles={["pekerja", "pemberi_kerja", "admin"]}>
          <NotificationsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/messages">
        <ProtectedRoute allowedRoles={["pekerja", "pemberi_kerja"]}>
          <MessagesPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/employer/dashboard">
        <ProtectedRoute allowedRoles={["pemberi_kerja"]}>
          <EmployerDashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/find-candidate">
        <ProtectedRoute allowedRoles={["pemberi_kerja"]}>
          <FindCandidatePage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/find-employers">
        <ProtectedRoute allowedRoles={["pekerja"]}>
          <FindEmployersPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/employer/applications">
        <ProtectedRoute allowedRoles={["pemberi_kerja"]}>
          <EmployerApplicationsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/employer/analytics">
        <ProtectedRoute allowedRoles={["pemberi_kerja"]}>
          <AnalyticsDashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/employer/cv-database">
        <ProtectedRoute allowedRoles={["pemberi_kerja"]}>
          <CVDatabasePage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/quick-access">
        <ProtectedRoute allowedRoles={["pekerja", "pemberi_kerja"]}>
          <QuickAccessPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/hiring">
        <ProtectedRoute allowedRoles={["pemberi_kerja"]}>
          <HiringPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/community">
        <ProtectedRoute allowedRoles={["pekerja", "pemberi_kerja"]}>
          <CommunityPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/dashboard">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/jobs">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminJobsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/moderation">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminModerationPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/users">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUsersPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/financial">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminFinancialPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/settings">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminSettingsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/verifications">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminVerificationPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/fraud-reports">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminFraudReportsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/blog">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminBlogManagerPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/content">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminContentPagesPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/analytics">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminAnalyticsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/companies">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminCompaniesPage />
        </ProtectedRoute>
      </Route>
      
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
