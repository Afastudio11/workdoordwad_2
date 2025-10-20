import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { User, Briefcase, Heart, LogOut, Menu, X, Sparkles, Settings, Bell, Layers } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/DashboardHeader";
import OverviewPage from "./dashboard/OverviewPage";
import ProfilePage from "./dashboard/ProfilePage";
import ApplicationsPage from "./dashboard/ApplicationsPage";
import WishlistPage from "./dashboard/WishlistPage";
import RecommendationsPage from "./dashboard/RecommendationsPage";
import SettingsPage from "./dashboard/SettingsPage";
import NotificationsPage from "./dashboard/NotificationsPage";
import JobAlertPage from "./dashboard/JobAlertPage";
import { Badge } from "@/components/ui/badge";
import type { Notification } from "@shared/schema";

export default function UserDashboardPage() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'overview';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get notification count for Job Alert badge
  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const jobAlertCount = notifications?.filter(n => 
    (n.type === "job_match" || n.type === "new_job_alert") && !n.isRead
  ).length || 0;

  // Sync activeTab with hash changes (for both direct hash changes and wouter navigation)
  useEffect(() => {
    const syncTab = () => {
      const hash = window.location.hash.replace('#', '');
      const newTab = hash || 'overview';
      setActiveTab(newTab);
    };

    // Sync on mount and whenever location changes
    syncTab();

    // Listen to hash changes (for direct hash manipulation)
    window.addEventListener('hashchange', syncTab);
    // Listen to popstate (for browser back/forward)
    window.addEventListener('popstate', syncTab);

    return () => {
      window.removeEventListener('hashchange', syncTab);
      window.removeEventListener('popstate', syncTab);
    };
  }, [location]); // Also re-run when wouter location changes

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'applications', label: 'Applied Jobs', icon: Briefcase },
    { id: 'wishlist', label: 'Favorite Jobs', icon: Heart },
    { id: 'job-alert', label: 'Job Alert', icon: Bell, badge: jobAlertCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'job-alert':
        return <JobAlertPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'settings':
        return <SettingsPage />;
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
              {/* User Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#D4FF00] flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate" data-testid="text-username">
                      {user?.fullName || 'User'}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{user?.email}</p>
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
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 border-l-4 border-primary'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      data-testid={`button-nav-${item.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <Badge className="bg-gray-900 text-white hover:bg-gray-900" data-testid={`badge-${item.id}`}>
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      )}
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
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 border-l-4 border-primary'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      data-testid={`button-nav-mobile-${item.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <Badge className="bg-gray-900 text-white hover:bg-gray-900" data-testid={`badge-mobile-${item.id}`}>
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      )}
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
