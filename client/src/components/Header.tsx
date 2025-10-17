import { Briefcase, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-gray-900" data-testid="logo-icon" />
            <span className="text-lg font-semibold text-gray-900" data-testid="logo-text">Pintu Kerja</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#cari-lowongan" className="text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-cari-lowongan">
              Cari Lowongan
            </a>
            <a href="#untuk-perusahaan" className="text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-untuk-perusahaan">
              Untuk Perusahaan
            </a>
            <a href="#tentang" className="text-sm text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-tentang">
              Tentang
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors" data-testid="button-masuk">
              Masuk
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors" data-testid="button-daftar">
              Daftar Gratis
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white" data-testid="mobile-menu">
          <div className="px-6 py-4 space-y-4">
            <a href="#cari-lowongan" className="block text-base text-gray-700" data-testid="mobile-link-cari-lowongan">
              Cari Lowongan
            </a>
            <a href="#untuk-perusahaan" className="block text-base text-gray-700" data-testid="mobile-link-untuk-perusahaan">
              Untuk Perusahaan
            </a>
            <a href="#tentang" className="block text-base text-gray-700" data-testid="mobile-link-tentang">
              Tentang
            </a>
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <button className="block w-full text-left text-sm font-medium text-gray-700" data-testid="mobile-button-masuk">
                Masuk
              </button>
              <button className="block w-full px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md text-center" data-testid="mobile-button-daftar">
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
