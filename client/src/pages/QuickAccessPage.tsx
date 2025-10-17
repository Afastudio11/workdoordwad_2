import { Link } from "wouter";
import { User, Briefcase, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickAccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Quick Access</h1>
          <p className="text-muted-foreground">Pilih role untuk mengakses dashboard yang sesuai</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard" data-testid="link-access-pekerja">
            <div className="bg-card border-2 border-border rounded-xl p-8 hover:border-primary transition-all cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Pekerja</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Cari dan lamar pekerjaan yang sesuai dengan keahlian Anda
                </p>
                <Button className="w-full" data-testid="button-access-pekerja">
                  Masuk sebagai Pekerja
                </Button>
              </div>
            </div>
          </Link>

          <Link href="/employer/dashboard" data-testid="link-access-pemberi">
            <div className="bg-card border-2 border-border rounded-xl p-8 hover:border-primary transition-all cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Pemberi Kerja</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Posting lowongan dan kelola proses rekrutmen
                </p>
                <Button className="w-full" data-testid="button-access-pemberi">
                  Masuk sebagai Pemberi Kerja
                </Button>
              </div>
            </div>
          </Link>

          <Link href="/admin/dashboard" data-testid="link-access-admin">
            <div className="bg-card border-2 border-border rounded-xl p-8 hover:border-primary transition-all cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Admin</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Kelola platform, verifikasi lowongan, dan monitor sistem
                </p>
                <Button className="w-full" data-testid="button-access-admin">
                  Masuk sebagai Admin
                </Button>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-primary hover:underline" data-testid="link-back-home">
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
