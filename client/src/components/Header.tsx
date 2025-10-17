import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import logoImg from "@assets/Asset 6@4x_1760692501921.png";
import logoImgDark from "@assets/black@4x_1760695283292.png";

interface HeaderProps {
  variant?: "dark" | "light";
}

export default function Header({ variant = "dark" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isDark = variant === "dark";
  const logo = isDark ? logoImg : logoImgDark;
  const bgClass = isDark ? "bg-black" : "bg-white";
  const borderClass = isDark ? "border-white/10" : "border-gray-200";
  const textClass = isDark ? "text-gray-300" : "text-gray-600";
  const textHoverClass = isDark ? "hover:text-white" : "hover:text-gray-900";
  const iconClass = isDark ? "text-white" : "text-gray-900";
  const btnBgClass = isDark ? "bg-primary text-black" : "bg-primary text-black";
  const btnBorderClass = isDark ? "bg-white text-black border-white" : "border-primary text-primary";
  const btnBorderHoverClass = isDark ? "hover:bg-white/90" : "hover:bg-primary/10";

  return (
    <header className={`sticky top-0 z-50 ${bgClass} border-b ${borderClass}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <img src={logo} alt="PintuKerja" className="h-8" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className={`text-sm ${textClass} ${textHoverClass} transition-colors`} data-testid="link-beranda">
              Beranda
            </a>
            <a href="/jobs" className={`text-sm ${textClass} ${textHoverClass} transition-colors`} data-testid="link-cari-pekerjaan">
              Cari Pekerjaan
            </a>
            <a href="#cari-kandidat" className={`text-sm ${textClass} ${textHoverClass} transition-colors`} data-testid="link-cari-kandidat">
              Cari Kandidat
            </a>
            <a href="#blog" className={`text-sm ${textClass} ${textHoverClass} transition-colors`} data-testid="link-blog">
              Blog
            </a>
            <a href="#kontak" className={`text-sm ${textClass} ${textHoverClass} transition-colors`} data-testid="link-kontak">
              Kontak
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/register">
              <button className={`px-6 py-2 ${btnBgClass} text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors`} data-testid="button-daftar">
                Daftar Sekarang
              </button>
            </Link>
            <Link href="/login">
              <button className={`px-6 py-2 border ${btnBorderClass} text-sm font-semibold rounded-full ${btnBorderHoverClass} transition-colors`} data-testid="button-masuk">
                Masuk
              </button>
            </Link>
          </div>

          <button
            className={`md:hidden p-2 ${iconClass}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${borderClass} ${bgClass}`} data-testid="mobile-menu">
          <div className="px-6 py-4 space-y-4">
            <a href="/" className={`block text-base ${textClass}`} onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-beranda">
              Beranda
            </a>
            <a href="/jobs" className={`block text-base ${textClass}`} onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-cari-pekerjaan">
              Cari Pekerjaan
            </a>
            <a href="#cari-kandidat" className={`block text-base ${textClass}`} onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-cari-kandidat">
              Cari Kandidat
            </a>
            <a href="#blog" className={`block text-base ${textClass}`} onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-blog">
              Blog
            </a>
            <a href="#kontak" className={`block text-base ${textClass}`} onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-kontak">
              Kontak
            </a>
            <div className={`pt-4 space-y-3 border-t ${borderClass}`}>
              <Link href="/register">
                <button className={`block w-full px-6 py-2 ${btnBgClass} text-sm font-semibold rounded-full text-center`} data-testid="mobile-button-daftar">
                  Daftar Sekarang
                </button>
              </Link>
              <Link href="/login">
                <button className={`block w-full px-6 py-2 border ${btnBorderClass} text-sm font-semibold rounded-full text-center ${btnBorderHoverClass}`} data-testid="mobile-button-masuk">
                  Masuk
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
