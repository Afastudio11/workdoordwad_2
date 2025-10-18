import { useState } from "react";
import { useLocation } from "wouter";
import { LayoutDashboard, Briefcase, Users, Building2, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import DashboardHeader from "@/components/DashboardHeader";
import OverviewPage from "./employer/OverviewPage";
import ManageJobsPage from "./employer/ManageJobsPage";
import ManageApplicantsPage from "./employer/ManageApplicantsPage";
import CompanyProfilePage from "./employer/CompanyProfilePage";

export default function EmployerDashboardPage() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'overview';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'jobs', label: 'Kelola Lowongan', icon: Briefcase },
    { id: 'applicants', label: 'Kelola Pelamar', icon: Users },
    { id: 'company', label: 'Profil Perusahaan', icon: Building2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'jobs':
        return <ManageJobsPage />;
      case 'applicants':
        return <ManageApplicantsPage />;
      case 'company':
        return <CompanyProfilePage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      
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
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
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
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
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
