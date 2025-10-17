import { useState } from "react";
import { Link, useLocation } from "wouter";
import { User, FileText, Briefcase, Heart, Settings, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import ProfilePage from "./dashboard/ProfilePage";
import ApplicationsPage from "./dashboard/ApplicationsPage";
import WishlistPage from "./dashboard/WishlistPage";

export default function UserDashboardPage() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'profile';
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const navItems = [
    { id: 'profile', label: 'Profil & CV', icon: User },
    { id: 'applications', label: 'Riwayat Lamaran', icon: Briefcase },
    { id: 'wishlist', label: 'Lowongan Tersimpan', icon: Heart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfilePage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'wishlist':
        return <WishlistPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <Link href="/" data-testid="link-home">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pintu Kerja</h1>
            </Link>
          </div>

          <div className="px-3">
            <div className="mb-6">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium">{user?.fullName?.charAt(0) || 'U'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate" data-testid="text-username">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    data-testid={`button-nav-${item.id}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link href="/jobs">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  data-testid="button-browse-jobs"
                >
                  <Home className="w-5 h-5" />
                  <span className="text-sm font-medium">Cari Lowongan</span>
                </button>
              </Link>
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1"
                data-testid="button-logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Keluar</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
