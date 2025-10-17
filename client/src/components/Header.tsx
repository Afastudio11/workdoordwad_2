import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-6 h-8 bg-primary rounded-sm"></div>
              <span className="text-lg font-bold text-white" data-testid="logo-text">PintuKerja.com</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm text-gray-300 hover:text-white transition-colors" data-testid="link-beranda">
              Beranda
            </a>
            <a href="/jobs" className="text-sm text-gray-300 hover:text-white transition-colors" data-testid="link-cari-pekerjaan">
              Cari Pekerjaan
            </a>
            <a href="#cari-kandidat" className="text-sm text-gray-300 hover:text-white transition-colors" data-testid="link-cari-kandidat">
              Cari Kandidat
            </a>
            <a href="#blog" className="text-sm text-gray-300 hover:text-white transition-colors" data-testid="link-blog">
              Blog
            </a>
            <a href="#kontak" className="text-sm text-gray-300 hover:text-white transition-colors" data-testid="link-kontak">
              Kontak
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="px-6 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors" data-testid="button-daftar">
              Daftar Sekarang
            </button>
            <button className="px-6 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors" data-testid="button-masuk">
              Masuk
            </button>
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black" data-testid="mobile-menu">
          <div className="px-6 py-4 space-y-4">
            <a href="/" className="block text-base text-gray-300" data-testid="mobile-link-beranda">
              Beranda
            </a>
            <a href="/jobs" className="block text-base text-gray-300" data-testid="mobile-link-cari-pekerjaan">
              Cari Pekerjaan
            </a>
            <a href="#cari-kandidat" className="block text-base text-gray-300" data-testid="mobile-link-cari-kandidat">
              Cari Kandidat
            </a>
            <a href="#blog" className="block text-base text-gray-300" data-testid="mobile-link-blog">
              Blog
            </a>
            <a href="#kontak" className="block text-base text-gray-300" data-testid="mobile-link-kontak">
              Kontak
            </a>
            <div className="pt-4 space-y-3 border-t border-white/10">
              <button className="block w-full px-6 py-2 bg-primary text-black text-sm font-semibold rounded-lg text-center" data-testid="mobile-button-daftar">
                Daftar Sekarang
              </button>
              <button className="block w-full px-6 py-2 bg-primary text-black text-sm font-semibold rounded-lg text-center" data-testid="mobile-button-masuk">
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
