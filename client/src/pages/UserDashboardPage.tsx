import { useState } from "react";
import { Link, useLocation } from "wouter";
import { User, Briefcase, Heart, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import logoImg from "@assets/as@4x_1760716473766.png";
import ProfilePage from "./dashboard/ProfilePage";
import ApplicationsPage from "./dashboard/ApplicationsPage";
import WishlistPage from "./dashboard/WishlistPage";
import RecommendationsPage from "./dashboard/RecommendationsPage";

export default function UserDashboardPage() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'profile';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'recommendations', label: 'Rekomendasi', icon: Sparkles },
    { id: 'applications', label: 'Lamaran Saya', icon: Briefcase },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'wishlist':
        return <WishlistPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Dashboard Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <img src={logoImg} alt="PintuKerja" className="h-12" />
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/jobs">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Cari Pekerjaan
                </button>
              </Link>
              <Link href="/">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Beranda
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* User Info */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground truncate" data-testid="text-username">
                      {user?.fullName || 'User'}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-card border border-border rounded-lg p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      data-testid={`button-nav-${item.id}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t border-border">
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
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="font-medium">Menu Dashboard</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mb-6" data-testid="mobile-menu">
              <div className="bg-card border border-border rounded-lg p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      data-testid={`button-nav-mobile-${item.id}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t border-border">
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
