import { Link } from "wouter";
import logoImg from "@assets/as@4x_1760716473766.png";

const footerLinks = {
  perusahaan: [
    { label: "Tentang", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/contact" }
  ],
  pencariKerja: [
    { label: "Cari Lowongan", href: "/find-job" },
    { label: "Tips Karir", href: "/blog" },
    { label: "FAQ", href: "/faq" }
  ],
  perekrut: [
    { label: "Posting Lowongan", href: "/hiring" },
    { label: "Harga", href: "/register" },
    { label: "Panduan", href: "/blog" }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/">
              <div className="mb-4 md:mb-6 cursor-pointer">
                <img src={logoImg} alt="PintuKerja" className="h-10 md:h-12" />
              </div>
            </Link>
            <p className="text-sm text-gray-400">
              Portal lowongan kerja terpercaya di Indonesia
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3 md:mb-4">Perusahaan</h3>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3 md:mb-4">Pencari Kerja</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.pencariKerja.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3 md:mb-4">Perekrut</h3>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.perekrut.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 PintuKerja.com. Semua hak dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/page/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/page/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
