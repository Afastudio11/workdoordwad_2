import { Link, useLocation } from "wouter";
import { MapPin, Settings, Bell, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import logoImg from "@assets/as@4x_1760716473766.png";

export default function DashboardPageHeader() {
  const [location] = useLocation();
  const { user } = useAuth();

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
                Find job
              </span>
            </Link>
            <Link href="/messages">
              <span
                className={`text-sm cursor-pointer transition-colors ${
                  isActive("/messages") ? "text-white font-medium" : "text-white/80 hover:text-white"
                }`}
              >
                Messages
              </span>
            </Link>
            <Link href="/community">
              <span
                className={`text-sm cursor-pointer transition-colors ${
                  isActive("/community") ? "text-white font-medium" : "text-white/80 hover:text-white"
                }`}
              >
                Community
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
            <div className="hidden md:flex items-center gap-2 text-sm text-white">
              <MapPin className="h-4 w-4" />
              <span>New York, NY</span>
            </div>

            <Link href="/dashboard/profile">
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
            </Link>

            <button 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              data-testid="button-settings"
            >
              <Settings className="h-5 w-5 text-white" />
            </button>

            <button 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
