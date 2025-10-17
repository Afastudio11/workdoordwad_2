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
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="h-5 w-5 text-gray-900" />
              <span className="font-semibold text-gray-900">Pintu Kerja</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Perusahaan</h3>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Pencari Kerja</h3>
            <ul className="space-y-3">
              {footerLinks.pencariKerja.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Perekrut</h3>
            <ul className="space-y-3">
              {footerLinks.perekrut.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 Pintu Kerja. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
