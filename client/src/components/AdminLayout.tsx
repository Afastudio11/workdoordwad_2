import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileCheck, Users, DollarSign, Settings, LogOut, Search, Bell, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

const DEV_MODE = import.meta.env.VITE_DEV_BYPASS_AUTH === "true" || import.meta.env.MODE === "development";

const navigation = [
  { name: "Ringkasan", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Moderasi Konten", href: "/admin/moderation", icon: FileCheck },
  { name: "Manajemen User", href: "/admin/users", icon: Users },
  { name: "Keuangan", href: "/admin/financial", icon: DollarSign },
  { name: "Sistem/Log", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isLoading, logout: authLogout } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats } = useQuery<{ totalPendingReview?: number }>({
    queryKey: ["/api/admin/dashboard/stats"],
    refetchInterval: 30000,
  });

  const handleLogout = () => {
    authLogout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Pencarian Global",
        description: `Mencari: ${searchQuery}`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-black dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const hasAccess = DEV_MODE || (user && user.role === 'admin');
  
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
            Akses Ditolak
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Anda tidak memiliki akses ke halaman admin
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

  const pendingReview = stats?.totalPendingReview || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-20 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-6">
        <Link href="/admin/dashboard">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-8 hover:opacity-90 transition-opacity cursor-pointer">
            <span className="text-2xl font-bold text-black">P</span>
          </div>
        </Link>

        <nav className="flex-1 w-full space-y-2 px-3" data-testid="admin-sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + "/");
            
            return (
              <Link key={item.name} href={item.href}>
                <button
                  className={`w-full h-12 flex items-center justify-center rounded-xl transition-all relative group ${
                    isActive
                      ? "bg-primary text-black shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                  data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  title={item.name}
                >
                  <Icon className="w-5 h-5" />
                  {item.href === "/admin/moderation" && pendingReview > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {pendingReview > 9 ? '9+' : pendingReview}
                    </span>
                  )}
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.name}
                  </span>
                </button>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
          data-testid="button-logout"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header Bar */}
        <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <h2 className="text-xl font-bold text-black dark:text-white whitespace-nowrap">
                Dashboard Admin
              </h2>
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari ID Transaksi, Lowongan, atau User..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    data-testid="input-global-search"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3">
              {pendingReview > 0 && (
                <Link href="/admin/moderation">
                  <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors" title="Antrean Review">
                    <FileCheck className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {pendingReview > 9 ? '9+' : pendingReview}
                    </span>
                  </button>
                </Link>
              )}
              
              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors" title="Peringatan Sistem">
                <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors" title="Notifikasi">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>

              <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800">
                <div className="text-right">
                  <p className="text-sm font-medium text-black dark:text-white">
                    {user?.fullName || "Development Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-black">
                    {(user?.fullName || "Admin").charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
