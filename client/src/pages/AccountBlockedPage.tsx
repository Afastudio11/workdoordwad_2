import { XCircle, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function AccountBlockedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-red-200 dark:border-red-900">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-6">
              <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Akun Anda Telah Diblokir
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-gray-600 dark:text-gray-400">
              Akses ke akun Anda telah dibatasi oleh administrator
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Blocked Reason */}
          {user?.blockedReason && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                Alasan Pemblokiran:
              </h3>
              <p className="text-red-800 dark:text-red-400">{user.blockedReason}</p>
            </div>
          )}

          {/* Information */}
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Akun Anda telah diblokir karena melanggar kebijakan dan ketentuan layanan kami.
              Selama masa pemblokiran, Anda tidak dapat:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Memposting lowongan pekerjaan baru</li>
              <li>Melamar pekerjaan</li>
              <li>Mengirim atau menerima pesan</li>
              <li>Mengakses fitur-fitur utama platform</li>
            </ul>
          </div>

          {/* What to do */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Apa yang harus dilakukan?
            </h3>
            <p className="text-blue-800 dark:text-blue-400 mb-3">
              Jika Anda merasa pemblokiran ini adalah kesalahan atau ingin mengajukan banding,
              silakan hubungi tim support kami melalui email.
            </p>
            <Button
              variant="outline"
              className="bg-blue-100 dark:bg-blue-900/30 border-blue-600 dark:border-blue-400 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
              onClick={() => window.open('mailto:support@pintukerja.com?subject=Permohonan Pembukaan Blokir Akun', '_blank')}
              data-testid="button-contact-support"
            >
              <Mail className="mr-2 h-4 w-4" />
              Hubungi Support
            </Button>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <strong>Email Support:</strong> support@pintukerja.com<br />
              <strong>Jam Operasional:</strong> Senin - Jumat, 09:00 - 17:00 WIB
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600"
                data-testid="button-back-home"
              >
                Kembali ke Beranda
              </Button>
            </Link>
            <Button
              onClick={logout}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
