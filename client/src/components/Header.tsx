import { Briefcase, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-black" data-testid="logo-icon" />
            </div>
            <span className="text-lg font-bold text-white" data-testid="logo-text">Qualery</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/jobs" className="text-sm text-gray-300 hover:text-white transition-colors" data-testid="link-cari-lowongan">
              Cari Lowongan
            </a>
            <a href="#untuk-perusahaan" className="text-sm text-gray-300 hover:text-white transition-colors" data-testid="link-untuk-perusahaan">
              Untuk Perusahaan
            </a>
            <a href="#tentang" className="text-sm text-gray-300 hover:text-white transition-colors" data-testid="link-tentang">
              Tentang
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors" data-testid="button-masuk">
              Masuk
            </button>
            <button className="px-6 py-2 bg-primary text-black text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors" data-testid="button-daftar">
              Daftar Gratis
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
            <a href="/jobs" className="block text-base text-gray-300" data-testid="mobile-link-cari-lowongan">
              Cari Lowongan
            </a>
            <a href="#untuk-perusahaan" className="block text-base text-gray-300" data-testid="mobile-link-untuk-perusahaan">
              Untuk Perusahaan
            </a>
            <a href="#tentang" className="block text-base text-gray-300" data-testid="mobile-link-tentang">
              Tentang
            </a>
            <div className="pt-4 space-y-3 border-t border-white/10">
              <button className="block w-full text-left text-sm font-medium text-gray-300" data-testid="mobile-button-masuk">
                Masuk
              </button>
              <button className="block w-full px-6 py-2 bg-primary text-black text-sm font-semibold rounded-lg text-center" data-testid="mobile-button-daftar">
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
