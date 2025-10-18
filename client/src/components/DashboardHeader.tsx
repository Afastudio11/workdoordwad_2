import { Link, useLocation } from "wouter";
import { MapPin, Bell, User, LogOut, Briefcase, Settings } from "lucide-react";
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

export default function DashboardHeader() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-[#1a1a1a] text-white sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src={logoImg} alt="PintuKerja" className="h-12" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/jobs">
              <span
                className={`text-sm cursor-pointer transition-colors ${
                  isActive("/jobs") ? "text-white font-medium" : "text-white/80 hover:text-white"
                }`}
              >
                Cari Pekerjaan
              </span>
            </Link>
            <Link href="/messages">
              <span
                className={`text-sm cursor-pointer transition-colors ${
                  isActive("/messages") ? "text-white font-medium" : "text-white/80 hover:text-white"
                }`}
              >
                Pesan
              </span>
            </Link>
            <Link href="/community">
              <span
                className={`text-sm cursor-pointer transition-colors ${
                  isActive("/community") ? "text-white font-medium" : "text-white/80 hover:text-white"
                }`}
              >
                Komunitas
              </span>
            </Link>
            <Link href="/faq">
              <span
                className={`text-sm cursor-pointer transition-colors ${
                  isActive("/faq") ? "text-white font-medium" : "text-white/80 hover:text-white"
                }`}
              >
                FAQ
              </span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <Link href="/jobs">
                <button 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  data-testid="button-location"
                  title="Cari Pekerjaan Berdasarkan Lokasi"
                >
                  <MapPin className="h-5 w-5 text-white" />
                </button>
              </Link>
            </div>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                  data-testid="button-notifications"
                >
                  <Bell className="h-5 w-5 text-white" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white">
                <DropdownMenuLabel>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-black">Notifikasi</p>
                    <button className="text-xs text-black hover:underline font-semibold">Tandai semua dibaca</button>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Notification Items */}
                <div className="max-h-96 overflow-y-auto">
                  <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black">Lamaran Anda Diterima</p>
                        <p className="text-xs text-gray-600 mt-1">PT Maju Jaya telah menerima lamaran Anda untuk posisi Senior Developer</p>
                        <p className="text-xs text-gray-500 mt-1">2 jam yang lalu</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black">Lowongan Baru Sesuai Profil Anda</p>
                        <p className="text-xs text-gray-600 mt-1">3 lowongan baru yang sesuai dengan keahlian Anda</p>
                        <p className="text-xs text-gray-500 mt-1">5 jam yang lalu</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="text-center justify-center text-sm text-black hover:underline cursor-pointer py-2 font-semibold">
                    Lihat semua notifikasi
                  </Link>
                </DropdownMenuItem>
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
                  <Link href="/user/dashboard#profile" className="flex items-center gap-3 cursor-pointer text-black" data-testid="menu-profile-cv">
                    <User className="h-4 w-4" />
                    <span>Profil</span>
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
