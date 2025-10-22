/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/dashboard
 * - DO NOT import admin or worker components
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, PlusCircle, Briefcase, Bookmark, CreditCard, Building2, Settings as SettingsIcon, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import EmployerDashboardHeader from "@/components/EmployerDashboardHeader";
import OverviewPage from "./employer/OverviewPage";
import EmployerProfilePage from "./employer/EmployerProfilePage";
import CompanyProfilePage from "./employer/CompanyProfilePage";
import PostJobPage from "./employer/PostJobPage";
import MyJobsPage from "./employer/MyJobsPage";
import SavedCandidatesPage from "./employer/SavedCandidatesPage";
import PlansBillingPage from "./employer/PlansBillingPage";
import EmployerSettingsPage from "./employer/EmployerSettingsPage";

export default function EmployerDashboardPage() {
  const [location, navigate] = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'overview';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveTab(hash || 'overview');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Employers Profile', icon: User },
    { id: 'company-profile', label: 'Company Profile', icon: Building2 },
    { id: 'post-job', label: 'Post a Job', icon: PlusCircle },
    { id: 'my-jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'saved-candidates', label: 'Saved Candidate', icon: Bookmark },
    { id: 'plans-billing', label: 'Plans & Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'profile':
        return <EmployerProfilePage />;
      case 'company-profile':
        return <CompanyProfilePage />;
      case 'post-job':
        return <PostJobPage />;
      case 'my-jobs':
        return <MyJobsPage />;
      case 'saved-candidates':
        return <SavedCandidatesPage />;
      case 'plans-billing':
        return <PlansBillingPage />;
      case 'settings':
        return <EmployerSettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  const DEV_MODE = import.meta.env.VITE_DEV_BYPASS_AUTH === "true" || import.meta.env.MODE === "development";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  if (!DEV_MODE && (!user || user.role !== 'pemberi_kerja')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-2">
            Akses Ditolak
          </h1>
          <p className="text-gray-600 mb-4">
            Anda tidak memiliki akses ke dashboard pemberi kerja
          </p>
          <Link href="/">
            <button className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <EmployerDashboardHeader />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Company Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#D4FF00] flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate" data-testid="text-company-name">
                      {user?.fullName || 'Perusahaan'}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">Pemberi Kerja</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-white border border-gray-200 rounded-lg p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#D4FF00] text-gray-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      data-testid={`button-nav-${item.id}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Keluar</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 min-h-[44px]"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="font-medium text-sm sm:text-base">Menu Dashboard</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mb-6" data-testid="mobile-menu">
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#D4FF00] text-gray-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      data-testid={`button-nav-mobile-${item.id}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    data-testid="button-logout-mobile"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Keluar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="lg:col-span-9">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
