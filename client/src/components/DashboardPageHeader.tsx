import { Link, useLocation } from "wouter";
import { MapPin, Settings, Bell, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import logoImg from "@assets/as@4x_1760716473766.png";

export default function DashboardPageHeader() {
  const [location] = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-background text-foreground sticky top-0 z-50 border-b border-border">
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
                  isActive("/jobs") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Find job
              </span>
            </Link>
            <Link href="/messages">
              <span
                className={`text-sm cursor-pointer transition-colors ${
                  isActive("/messages") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Messages
              </span>
            </Link>
            <Link href="/community">
              <span
                className={`text-sm cursor-pointer transition-colors ${
                  isActive("/community") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Community
              </span>
            </Link>
            <Link href="/faq">
              <span
                className={`text-sm cursor-pointer transition-colors ${
                  isActive("/faq") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                FAQ
              </span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>New York, NY</span>
            </div>

            <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center overflow-hidden">
                {user?.fullName ? (
                  <span className="text-sm font-semibold text-foreground">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-4 h-4 text-foreground" />
                )}
              </div>
            </button>

            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>

            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
