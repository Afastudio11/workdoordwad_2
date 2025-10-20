import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileCheck, Users, DollarSign, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Moderasi Konten", href: "/admin/moderation", icon: FileCheck },
  { name: "Manajemen User", href: "/admin/users", icon: Users },
  { name: "Keuangan", href: "/admin/financial", icon: DollarSign },
  { name: "Pengaturan Sistem", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isLoading, logout: authLogout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    authLogout();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-black dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
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

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      <aside className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin/dashboard">
            <h1 className="text-xl font-bold text-black dark:text-white">
              <span className="text-primary">Pintu Kerja</span> Admin
            </h1>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {user.fullName}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1" data-testid="admin-sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + "/");
            
            return (
              <Link key={item.name} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-black"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                  data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
