import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell, User, Search, Settings, FileText, LogOut, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import logoImg from "@assets/as@4x_1760716473766.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  onSearch?: (keyword: string) => void;
}

export default function DashboardHeader({ onSearch }: DashboardHeaderProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [hasNotifications] = useState(true); // TODO: Connect to real notifications

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchKeyword.trim()) {
      onSearch(searchKeyword);
    } else if (searchKeyword.trim()) {
      // Navigate to jobs page with search
      window.location.href = `/jobs?keyword=${encodeURIComponent(searchKeyword)}`;
    }
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Logo - Navigasi Utama (Home) */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src={logoImg} alt="Pintu Kerja" className="h-12" />
          </Link>

          {/* Kolom Pencarian Global - Desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl relative"
          >
            <input
              type="text"
              placeholder="Cari posisi, perusahaan, atau skill..."
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#D4FF00] text-black placeholder:text-gray-500"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              data-testid="input-global-search"
            />
            <button
              type="submit"
              className="px-6 bg-white border border-[#D4FF00] border-l-0 rounded-r-lg hover:bg-[#D4FF00]/10 transition-colors flex items-center justify-center"
              data-testid="button-global-search"
            >
              <Search className="h-5 w-5 text-black" />
            </button>
          </form>

          {/* Navigation Links & Icons */}
          <div className="flex items-center gap-6">
            {/* Link: Cari Lowongan */}
            <Link href="/jobs">
              <span
                className={`hidden md:block text-sm font-medium transition-colors cursor-pointer ${
                  isActive('/jobs')
                    ? 'text-black border-b-2 border-[#D4FF00] pb-1'
                    : 'text-black hover:text-gray-700'
                }`}
                data-testid="link-cari-lowongan"
              >
                Cari Lowongan
              </span>
            </Link>

            {/* Link: Lowongan Tersimpan */}
            <Link href="/user/dashboard#wishlist">
              <span
                className={`hidden md:block text-sm font-medium transition-colors cursor-pointer ${
                  location.includes('#wishlist')
                    ? 'text-black border-b-2 border-[#D4FF00] pb-1'
                    : 'text-black hover:text-gray-700'
                }`}
                data-testid="link-lowongan-tersimpan"
              >
                Lowongan Tersimpan
              </span>
            </Link>

            {/* Icon Notifikasi (Lonceng) */}
            <button 
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5 text-black" />
              {hasNotifications && (
                <span 
                  className="absolute top-1 right-1 w-2 h-2 bg-[#D4FF00] rounded-full"
                  data-testid="notification-badge"
                />
              )}
            </button>

            {/* Icon Profil (Dropdown Menu) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  data-testid="button-profile-menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#D4FF00] flex items-center justify-center">
                    <span className="text-sm font-bold text-black">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
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
                
                {/* Profil Saya / CV Digital */}
                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard#profile" className="flex items-center gap-3 cursor-pointer text-black" data-testid="menu-profil">
                    <User className="h-4 w-4" />
                    <span>Profil Saya / CV Digital</span>
                  </Link>
                </DropdownMenuItem>

                {/* Riwayat Lamaran */}
                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard#applications" className="flex items-center gap-3 cursor-pointer text-black" data-testid="menu-riwayat">
                    <Briefcase className="h-4 w-4" />
                    <span>Riwayat Lamaran</span>
                  </Link>
                </DropdownMenuItem>

                {/* Pengaturan Akun */}
                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard#settings" className="flex items-center gap-3 cursor-pointer text-black" data-testid="menu-pengaturan">
                    <Settings className="h-4 w-4" />
                    <span>Pengaturan Akun</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Keluar (Sign Out) */}
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  data-testid="menu-keluar"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              placeholder="Cari posisi, perusahaan, atau skill..."
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#D4FF00] text-black placeholder:text-gray-500"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              data-testid="input-global-search-mobile"
            />
            <button
              type="submit"
              className="px-4 bg-white border border-[#D4FF00] border-l-0 rounded-r-lg hover:bg-[#D4FF00]/10 transition-colors flex items-center justify-center"
              data-testid="button-global-search-mobile"
            >
              <Search className="h-5 w-5 text-black" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
