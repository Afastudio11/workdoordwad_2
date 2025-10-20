import { Link, useLocation } from "wouter";
import { Bell, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import logoImg from "@assets/as@4x_1760716473766.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

type Notification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function EmployerDashboardHeader() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  // Fetch real notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatNotificationTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: localeId });
    } catch {
      return "Baru saja";
    }
  };

  const navItems = [
    { path: "/employer/dashboard", label: "Dashboard", external: false },
    { path: "/employer/dashboard#my-jobs", label: "Lowongan Saya", external: false },
    { path: "/messages", label: "Pesan", external: false },
    { path: "/faq", label: "FAQ", external: false },
    { path: "/contact", label: "Kontak", external: false },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-black sticky top-0 z-50 border-b border-zinc-800">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/employer/dashboard" className="flex items-center">
            <img src={logoImg} alt="PintuKerja" className="h-12" />
          </Link>

          {/* Navigation Menu - Centered */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors text-gray-400 hover:text-white"
                  data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-white border-b-2 border-[#D4FF00] pb-0.5"
                      : "text-gray-400 hover:text-white"
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors relative"
                  data-testid="button-notifications"
                >
                  <Bell className="h-5 w-5 text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-[#D4FF00] text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white">
                <DropdownMenuLabel>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-black">Notifikasi</p>
                    {unreadCount > 0 && (
                      <span className="text-xs text-gray-500">{unreadCount} baru</span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Notification Items */}
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500">Memuat notifikasi...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Belum ada notifikasi</p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex gap-3 w-full">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-black">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatNotificationTime(notification.createdAt)}</p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#D4FF00] rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                {/* Removed "Lihat semua notifikasi" link to prevent leaving dashboard */}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="w-10 h-10 rounded-full bg-[#D4FF00] flex items-center justify-center hover:opacity-90 transition-opacity"
                  data-testid="button-profile"
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                    {user?.fullName ? (
                      <span className="text-sm font-semibold text-gray-900">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User className="w-4 h-4 text-gray-900" />
                    )}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-black">{user?.fullName}</p>
                    <p className="text-xs leading-none text-gray-600">{user?.email}</p>
                    <p className="text-xs leading-none text-gray-500 mt-1">Pemberi Kerja</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Keluar (Sign Out) */}
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  data-testid="menu-logout"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
