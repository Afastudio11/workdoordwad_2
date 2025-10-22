import { Link, useLocation } from "wouter";
import { User, Briefcase, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const DEV_MODE = import.meta.env.VITE_DEV_BYPASS_AUTH === "true" || import.meta.env.MODE === "development";

export default function QuickAccessPage() {
  const [, setLocation] = useLocation();
  const { setDevUser } = useAuth();

  const handleRoleSelect = (role: "pekerja" | "pemberi_kerja" | "admin", redirectPath: string) => {
    if (DEV_MODE) {
      setDevUser(role);
      setLocation(redirectPath);
    } else {
      setLocation(redirectPath);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="heading-1 text-foreground mb-4">Akses Cepat</h1>
          <p className="text-muted-foreground">Pilih role untuk mengakses dashboard yang sesuai</p>
          {DEV_MODE && (
            <div className="mt-4 inline-block px-4 py-2 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">
                🛠️ Mode Development: Auto-login aktif
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => handleRoleSelect("pekerja", "/user/dashboard")}
            className="bg-card border-2 border-border rounded-xl p-8 hover:border-primary transition-all cursor-pointer group"
            data-testid="link-access-pekerja"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                <User className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="heading-4 text-foreground mb-2">Pekerja</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Cari dan lamar pekerjaan yang sesuai dengan keahlian kamu
              </p>
              <Button className="w-full" data-testid="button-access-pekerja">
                Masuk sebagai Pekerja
              </Button>
            </div>
          </div>

          <div
            onClick={() => handleRoleSelect("pemberi_kerja", "/employer/dashboard")}
            className="bg-card border-2 border-border rounded-xl p-8 hover:border-primary transition-all cursor-pointer group"
            data-testid="link-access-pemberi"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                <Briefcase className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="heading-4 text-foreground mb-2">Pemberi Kerja</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Posting lowongan dan kelola proses rekrutmen
              </p>
              <Button className="w-full" data-testid="button-access-pemberi">
                Masuk sebagai Pemberi Kerja
              </Button>
            </div>
          </div>

          <div
            onClick={() => handleRoleSelect("admin", "/admin/dashboard")}
            className="bg-card border-2 border-border rounded-xl p-8 hover:border-primary transition-all cursor-pointer group"
            data-testid="link-access-admin"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                <Shield className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="heading-4 text-foreground mb-2">Admin</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Kelola platform, verifikasi lowongan, dan monitor sistem
              </p>
              <Button className="w-full" data-testid="button-access-admin">
                Masuk sebagai Admin
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-black hover:underline font-semibold" data-testid="link-back-home">
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
