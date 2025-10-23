import { Clock, AlertCircle, FileCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface AccountUnverifiedPageProps {
  context?: "post-job" | "general";
}

export default function AccountUnverifiedPage({ context = "general" }: AccountUnverifiedPageProps) {
  const { user } = useAuth();
  const isPending = user?.verificationStatus === "pending";
  const isRejected = user?.verificationStatus === "rejected";

  const getTitle = () => {
    if (context === "post-job") {
      return "Verifikasi Diperlukan untuk Posting Lowongan";
    }
    if (isPending) {
      return "Akun Anda Sedang Dalam Proses Verifikasi";
    }
    return "Verifikasi Akun Diperlukan";
  };

  const getDescription = () => {
    if (context === "post-job") {
      return "Anda harus memverifikasi akun terlebih dahulu sebelum dapat memposting lowongan pekerjaan";
    }
    if (isPending) {
      return "Mohon bersabar, tim kami sedang meninjau informasi Anda";
    }
    return "Lengkapi proses verifikasi untuk mengakses semua fitur";
  };

  const getIcon = () => {
    if (isRejected) {
      return <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400" />;
    }
    return <Clock className="h-16 w-16 text-yellow-600 dark:text-yellow-400" />;
  };

  const getBgColor = () => {
    if (isRejected) {
      return "bg-red-100 dark:bg-red-900/30";
    }
    return "bg-yellow-100 dark:bg-yellow-900/30";
  };

  const getBorderColor = () => {
    if (isRejected) {
      return "border-red-200 dark:border-red-900";
    }
    return "border-yellow-200 dark:border-yellow-900";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className={`max-w-2xl w-full ${getBorderColor()}`}>
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className={`rounded-full ${getBgColor()} p-6`}>
              {getIcon()}
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
              {getTitle()}
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-gray-600 dark:text-gray-400" data-testid="text-page-description">
              {getDescription()}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Message */}
          {isPending && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4" data-testid="alert-verification-pending">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-2" data-testid="text-verification-status">
                <Clock className="h-5 w-5" />
                Status Verifikasi: Sedang Diproses
              </h3>
              <p className="text-yellow-800 dark:text-yellow-400" data-testid="text-verification-message">
                Proses verifikasi biasanya memakan waktu 1-2 hari kerja. Tim kami sedang meninjau
                dokumen dan informasi perusahaan Anda untuk memastikan keabsahan akun.
              </p>
            </div>
          )}

          {isRejected && user?.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4" data-testid="alert-verification-rejected">
              <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2" data-testid="text-rejection-label">
                Alasan Penolakan:
              </h3>
              <p className="text-red-800 dark:text-red-400 mb-3" data-testid="text-rejection-reason">{user.rejectionReason}</p>
              <p className="text-sm text-red-700 dark:text-red-500" data-testid="text-rejection-next-steps">
                Silakan perbarui informasi Anda dan ajukan ulang permintaan verifikasi.
              </p>
            </div>
          )}

          {/* What you can do */}
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Apa yang bisa Anda lakukan sekarang?
            </h3>
            {isPending && (
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Lengkapi profil perusahaan Anda agar lebih menarik</li>
                <li>Jelajahi kandidat potensial di platform</li>
                <li>Baca tips dan panduan rekrutmen di blog kami</li>
                <li>Siapkan template lowongan pekerjaan untuk dipublikasikan nanti</li>
              </ul>
            )}
            {isRejected && (
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Perbarui informasi perusahaan yang kurang lengkap atau tidak valid</li>
                <li>Pastikan dokumen legal perusahaan sudah benar dan jelas</li>
                <li>Hubungi support jika ada pertanyaan</li>
                <li>Ajukan ulang permintaan verifikasi setelah perbaikan</li>
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <Link href="/employer/dashboard#company-profile">
              <Button
                className="w-full bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900"
                data-testid="button-complete-profile"
              >
                <FileCheck className="mr-2 h-4 w-4" />
                {isRejected ? "Perbarui Profil" : "Lengkapi Profil"}
              </Button>
            </Link>
            <Link href="/employer/dashboard">
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600"
                data-testid="button-go-dashboard"
              >
                Ke Dashboard
              </Button>
            </Link>
          </div>

          {/* Contact Support */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Butuh bantuan atau memiliki pertanyaan?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('mailto:support@pintukerja.com?subject=Pertanyaan Verifikasi Akun', '_blank')}
              data-testid="button-contact-support"
            >
              <Mail className="mr-2 h-4 w-4" />
              Hubungi Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
