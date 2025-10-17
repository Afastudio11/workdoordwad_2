import { Briefcase, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" data-testid="logo-icon" />
            <span className="text-xl font-bold text-foreground" data-testid="logo-text">Pintu Kerja</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#cari-lowongan" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-cari-lowongan">
              Cari Lowongan
            </a>
            <a href="#untuk-perusahaan" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-untuk-perusahaan">
              Untuk Perusahaan
            </a>
            <a href="#tentang" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-tentang">
              Tentang
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" data-testid="button-masuk">Masuk</Button>
            <Button data-testid="button-daftar">Daftar Gratis</Button>
          </div>

          <button
            className="md:hidden p-2 hover-elevate rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-3">
            <a href="#cari-lowongan" className="block px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md" data-testid="mobile-link-cari-lowongan">
              Cari Lowongan
            </a>
            <a href="#untuk-perusahaan" className="block px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md" data-testid="mobile-link-untuk-perusahaan">
              Untuk Perusahaan
            </a>
            <a href="#tentang" className="block px-3 py-2 text-base font-medium text-foreground hover-elevate rounded-md" data-testid="mobile-link-tentang">
              Tentang
            </a>
            <div className="pt-3 space-y-2">
              <Button variant="ghost" className="w-full" data-testid="mobile-button-masuk">Masuk</Button>
              <Button className="w-full" data-testid="mobile-button-daftar">Daftar Gratis</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
