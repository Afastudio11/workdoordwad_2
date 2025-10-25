/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/dashboard
 * - DO NOT import admin or worker components
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, PlusCircle, Briefcase, Bookmark, CreditCard, Building2, Settings as SettingsIcon, LogOut, Menu, X, BarChart3, Database, Lock, Crown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EmployerDashboardHeader from "@/components/EmployerDashboardHeader";
import OverviewPage from "./employer/OverviewPage";
import EmployerProfilePage from "./employer/EmployerProfilePage";
import CompanyProfilePage from "./employer/CompanyProfilePage";
import PostJobPage from "./employer/PostJobPage";
import MyJobsPage from "./employer/MyJobsPage";
import SavedCandidatesPage from "./employer/SavedCandidatesPage";
import PlansBillingPage from "./employer/PlansBillingPage";
import EmployerSettingsPage from "./employer/EmployerSettingsPage";

interface FeatureAccess {
  plan: string;
  planDisplayName: string;
  features: {
    analytics: boolean;
    cvDatabase: boolean;
    featuredJobs: boolean;
    urgentJobs: boolean;
    verifiedBadge: boolean;
  };
  quotas: {
    jobPostings: number;
    featuredJobs: number;
    urgentJobs: number;
    cvDownloads: number;
  };
}

export default function EmployerDashboardPage() {
  const [location, navigate] = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'overview';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [lockedFeature, setLockedFeature] = useState('');

  const { data: featureAccess } = useQuery<FeatureAccess>({
    queryKey: ["/api/employer/feature-access"],
  });

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveTab(hash || 'overview');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string, locked: boolean = false, featureName: string = '') => {
    if (locked) {
      setLockedFeature(featureName);
      setShowUpgradeModal(true);
      return;
    }
    setActiveTab(tab);
    window.location.hash = tab;
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, alwaysVisible: true },
    { id: 'profile', label: 'Employers Profile', icon: User, alwaysVisible: true },
    { id: 'company-profile', label: 'Company Profile', icon: Building2, alwaysVisible: true },
    { id: 'post-job', label: 'Post a Job', icon: PlusCircle, alwaysVisible: true },
    { id: 'my-jobs', label: 'My Jobs', icon: Briefcase, alwaysVisible: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, requiredFeature: 'analytics', requiredPlan: 'Starter+' },
    { id: 'cv-database', label: 'CV Database', icon: Database, requiredFeature: 'cvDatabase', requiredPlan: 'Professional+' },
    { id: 'saved-candidates', label: 'Saved Candidate', icon: Bookmark, alwaysVisible: true },
    { id: 'plans-billing', label: 'Plans & Billing', icon: CreditCard, alwaysVisible: true },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, alwaysVisible: true },
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
      case 'analytics':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">Lihat performa lowongan kerja, jumlah aplikasi, dan statistik lainnya.</p>
          </div>
        );
      case 'cv-database':
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Database className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">CV Database</h3>
            <p className="text-gray-600">Akses database CV kandidat dan cari talenta yang sesuai dengan kebutuhan Anda.</p>
          </div>
        );
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
                  const isLocked = !!(item.requiredFeature && featureAccess && !featureAccess.features[item.requiredFeature as keyof typeof featureAccess.features]);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id, isLocked, item.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#D4FF00] text-gray-900'
                          : isLocked
                          ? 'text-gray-400 hover:bg-gray-50 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      data-testid={`button-nav-${item.id}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {isLocked && (
                        <div className="flex items-center gap-1">
                          <Lock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                            {item.requiredPlan}
                          </span>
                        </div>
                      )}
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
                  const isLocked = !!(item.requiredFeature && featureAccess && !featureAccess.features[item.requiredFeature as keyof typeof featureAccess.features]);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id, isLocked, item.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#D4FF00] text-gray-900'
                          : isLocked
                          ? 'text-gray-400 hover:bg-gray-50 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      data-testid={`button-nav-mobile-${item.id}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium flex-1 text-left">{item.label}</span>
                      {isLocked && (
                        <div className="flex items-center gap-1">
                          <Lock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                            {item.requiredPlan}
                          </span>
                        </div>
                      )}
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

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <DialogTitle className="text-center text-xl">Upgrade untuk Akses {lockedFeature}</DialogTitle>
            <DialogDescription className="text-center text-base">
              Fitur <strong>{lockedFeature}</strong> hanya tersedia untuk paket berbayar.
              Upgrade sekarang untuk mendapatkan akses penuh!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 p-4 rounded-lg border border-lime-200 dark:border-lime-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Keuntungan Upgrade:</h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {lockedFeature === 'Analytics' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-600 dark:text-lime-400 mt-0.5">✓</span>
                      <span>Dashboard analitik lengkap</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-600 dark:text-lime-400 mt-0.5">✓</span>
                      <span>Statistik performa lowongan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-600 dark:text-lime-400 mt-0.5">✓</span>
                      <span>Insight kandidat & aplikasi</span>
                    </li>
                  </>
                )}
                {lockedFeature === 'CV Database' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-600 dark:text-lime-400 mt-0.5">✓</span>
                      <span>Akses database CV kandidat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-600 dark:text-lime-400 mt-0.5">✓</span>
                      <span>Filter & pencarian advanced</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lime-600 dark:text-lime-400 mt-0.5">✓</span>
                      <span>Download CV kandidat</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Paket Anda Saat Ini:</strong> {featureAccess?.planDisplayName || 'Gratis'}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
              className="flex-1"
              data-testid="button-cancel-upgrade"
            >
              Nanti Saja
            </Button>
            <Button
              onClick={() => {
                setShowUpgradeModal(false);
                handleTabChange('plans-billing');
              }}
              className="flex-1 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white"
              data-testid="button-upgrade-now"
            >
              <Crown className="w-4 h-4 mr-2" />
              Lihat Paket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
