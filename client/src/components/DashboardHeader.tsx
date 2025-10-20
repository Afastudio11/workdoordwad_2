import { Link, useLocation } from "wouter";
import { Bell, User, LogOut, MapPin, ChevronDown, Search, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import logoImg from "@assets/as@4x_1760716473766.png";
import { getPopularLocations, searchLocations } from "@shared/indonesia-locations";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function DashboardHeader() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [selectedCity, setSelectedCity] = useState("Jakarta Selatan");
  const [searchQuery, setSearchQuery] = useState("");
  
  const popularCities = getPopularLocations();
  const filteredCities = searchQuery 
    ? searchLocations(searchQuery).map(loc => loc.name).slice(0, 10)
    : popularCities;

  const { data: unreadData } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
    enabled: !!user,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const recentNotifications = notifications.slice(0, 5);

  const isActive = (path: string) => {
    return location === path;
  };

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/notifications/read-all", "PATCH");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  return (
    <header className="bg-[#1a1a1a] text-white sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/user/dashboard" className="flex items-center">
            <img src={logoImg} alt="PintuKerja" className="h-12" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/user/dashboard">
              <span
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  isActive('/user/dashboard')
                    ? "text-white border-b-2 border-[#D4FF00] pb-0.5"
                    : "text-gray-400 hover:text-white"
                }`}
                data-testid="nav-link-dashboard"
              >
                Dashboard
              </span>
            </Link>
            <Link href="/find-job">
              <span
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  isActive('/find-job')
                    ? "text-white border-b-2 border-[#D4FF00] pb-0.5"
                    : "text-gray-400 hover:text-white"
                }`}
                data-testid="nav-link-find-job"
              >
                Find Job
              </span>
            </Link>
            <Link href="/blog">
              <span
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  isActive('/blog')
                    ? "text-white border-b-2 border-[#D4FF00] pb-0.5"
                    : "text-gray-400 hover:text-white"
                }`}
                data-testid="nav-link-blog"
              >
                Blog
              </span>
            </Link>
            <Link href="/community">
              <span
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  isActive('/community')
                    ? "text-white border-b-2 border-[#D4FF00] pb-0.5"
                    : "text-gray-400 hover:text-white"
                }`}
                data-testid="nav-link-community"
              >
                Community
              </span>
            </Link>
            <Link href="/faq">
              <span
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  isActive('/faq')
                    ? "text-white border-b-2 border-[#D4FF00] pb-0.5"
                    : "text-gray-400 hover:text-white"
                }`}
                data-testid="nav-link-faq"
              >
                FAQ
              </span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    data-testid="button-location"
                  >
                    <MapPin className="h-5 w-5 text-white" />
                    <span className="text-sm text-white font-medium">{selectedCity}</span>
                    <ChevronDown className="h-4 w-4 text-white/70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 bg-white p-0">
                  <div className="p-3 pb-2">
                    <DropdownMenuLabel className="text-black px-0 pb-2">Pilih Lokasi</DropdownMenuLabel>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Cari kota/kabupaten..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm"
                      />
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-0" />
                  <div className="max-h-80 overflow-y-auto">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <DropdownMenuItem
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setSearchQuery("");
                          }}
                          className={`cursor-pointer px-3 py-2 ${
                            selectedCity === city ? "bg-gray-100 font-medium" : ""
                          } text-black hover:bg-gray-50`}
                        >
                          <MapPin className="h-4 w-4 mr-2 text-gray-600 flex-shrink-0" />
                          <span className="text-sm">{city}</span>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-3 py-6 text-center text-sm text-gray-500">
                        Lokasi tidak ditemukan
                      </div>
                    )}
                  </div>
                  {searchQuery === "" && (
                    <>
                      <DropdownMenuSeparator className="my-0" />
                      <div className="p-2 text-xs text-gray-500 text-center">
                        {popularCities.length} lokasi populer ditampilkan
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                  data-testid="button-notifications"
                >
                  <Bell className="h-5 w-5 text-white" />
                  {unreadData && unreadData.count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4FF00] text-[10px] font-bold text-gray-900">
                      {unreadData.count > 9 ? '9+' : unreadData.count}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white">
                <DropdownMenuLabel>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-black">Notifikasi</p>
                    {unreadData && unreadData.count > 0 && (
                      <button 
                        onClick={() => markAllAsReadMutation.mutate()}
                        disabled={markAllAsReadMutation.isPending}
                        className="text-xs text-black hover:underline font-semibold disabled:opacity-50" 
                        data-testid="button-mark-all-read-header"
                      >
                        {markAllAsReadMutation.isPending ? "Memproses..." : "Tandai semua dibaca"}
                      </button>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Notification Items */}
                <div className="max-h-96 overflow-y-auto">
                  {recentNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-sm text-gray-500">Belum ada notifikasi</p>
                    </div>
                  ) : (
                    recentNotifications.map((notif) => (
                      <DropdownMenuItem 
                        key={notif.id}
                        className={`p-3 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="flex gap-3 w-full">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">{notif.type === 'application_status' ? '📋' : notif.type === 'new_message' ? '💬' : notif.type === 'job_match' ? '🎯' : '🔔'}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-sm font-medium text-black line-clamp-1">{notif.title}</p>
                              {!notif.isRead && (
                                <span className="w-2 h-2 rounded-full bg-[#D4FF00] flex-shrink-0 mt-1.5"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-1">{notif.message}</p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notif.createdAt), {
                                addSuffix: true,
                                locale: idLocale,
                              })}
                            </p>
                          </div>
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
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
                  data-testid="button-profile"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                    {user?.fullName ? (
                      <span className="text-sm font-semibold text-white">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-black">{user?.fullName}</p>
                    <p className="text-xs leading-none text-gray-600">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Profile */}
                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard#profile" className="flex items-center gap-3 cursor-pointer text-black" data-testid="menu-profile">
                    <User className="h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>

                {/* Settings */}
                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard#settings" className="flex items-center gap-3 cursor-pointer text-black" data-testid="menu-settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

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
