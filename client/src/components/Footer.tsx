import { Briefcase, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  perusahaan: [
    { label: "Tentang Kami", href: "#" },
    { label: "Karir", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Kontak", href: "#" }
  ],
  pencariKerja: [
    { label: "Cari Lowongan", href: "#" },
    { label: "Tips Karir", href: "#" },
    { label: "Panduan CV", href: "#" },
    { label: "FAQ", href: "#" }
  ],
  perekrut: [
    { label: "Posting Lowongan", href: "#" },
    { label: "Harga", href: "#" },
    { label: "Fitur", href: "#" },
    { label: "Success Stories", href: "#" }
  ],
  legal: [
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Cookie Policy", href: "#" }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Pintu Kerja</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Platform rekrutmen dengan AI yang mengagregasi lowongan dari berbagai sumber termasuk media sosial.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@pintukerja.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              {footerLinks.perusahaan.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary hover-elevate px-2 py-1 -ml-2 rounded-md inline-block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Pencari Kerja</h3>
            <ul className="space-y-2">
              {footerLinks.pencariKerja.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary hover-elevate px-2 py-1 -ml-2 rounded-md inline-block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Perekrut</h3>
            <ul className="space-y-2">
              {footerLinks.perekrut.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary hover-elevate px-2 py-1 -ml-2 rounded-md inline-block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary hover-elevate px-2 py-1 -ml-2 rounded-md inline-block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Pintu Kerja. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
