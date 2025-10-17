import { Briefcase } from "lucide-react";

const footerLinks = {
  perusahaan: [
    { label: "Tentang", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Kontak", href: "#" }
  ],
  pencariKerja: [
    { label: "Cari Lowongan", href: "#" },
    { label: "Tips Karir", href: "#" },
    { label: "FAQ", href: "#" }
  ],
  perekrut: [
    { label: "Posting Lowongan", href: "#" },
    { label: "Harga", href: "#" },
    { label: "Panduan", href: "#" }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-8 bg-primary rounded-sm"></div>
              <span className="text-lg font-bold text-white">PintuKerja.com</span>
            </div>
            <p className="text-sm text-gray-400">
              Portal lowongan kerja terpercaya di Indonesia
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Perusahaan</h3>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Pencari Kerja</h3>
            <ul className="space-y-3">
              {footerLinks.pencariKerja.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Perekrut</h3>
            <ul className="space-y-3">
              {footerLinks.perekrut.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 PintuKerja.com. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
