import { AlertCircle, Clock, XCircle, FileCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface VerificationBannerProps {
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string | null;
  isBlocked?: boolean;
  blockedReason?: string | null;
}

export default function VerificationBanner({
  verificationStatus,
  rejectionReason,
  isBlocked,
  blockedReason,
}: VerificationBannerProps) {
  if (isBlocked) {
    return (
      <Alert
        className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20"
        data-testid="alert-account-blocked"
      >
        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-red-800 dark:text-red-300 font-semibold">
          Akun Anda Telah Diblokir
        </AlertTitle>
        <AlertDescription className="text-red-700 dark:text-red-400">
          {blockedReason ? (
            <p className="mb-2">Alasan: {blockedReason}</p>
          ) : (
            <p className="mb-2">
              Akun Anda telah diblokir oleh administrator. Anda tidak dapat melakukan
              aktivitas apapun saat ini.
            </p>
          )}
          <p className="text-sm">
            Silakan hubungi tim support kami untuk informasi lebih lanjut atau untuk mengajukan banding.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  if (verificationStatus === "verified") {
    return null;
  }

  if (verificationStatus === "pending") {
    return (
      <Alert
        className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
        data-testid="alert-verification-pending"
      >
        <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-300 font-semibold">
          Akun Anda Sedang Dalam Proses Verifikasi
        </AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-400">
          <p className="mb-2">
            Tim kami sedang meninjau informasi perusahaan Anda. Proses ini biasanya memakan
            waktu 1-2 hari kerja.
          </p>
          <p className="text-sm">
            Anda dapat melengkapi profil perusahaan Anda sambil menunggu. Setelah terverifikasi,
            Anda dapat mulai memposting lowongan pekerjaan.
          </p>
          <div className="mt-3">
            <Link href="/employer/dashboard#company-profile">
              <Button
                variant="outline"
                size="sm"
                className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-600 dark:border-yellow-400 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                data-testid="button-complete-profile"
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Lengkapi Profil Perusahaan
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (verificationStatus === "rejected") {
    return (
      <Alert
        className="mb-6 border-red-500 bg-red-50 dark:bg-red-950/20"
        data-testid="alert-verification-rejected"
      >
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        <AlertTitle className="text-red-800 dark:text-red-300 font-semibold">
          Permohonan Verifikasi Ditolak
        </AlertTitle>
        <AlertDescription className="text-red-700 dark:text-red-400">
          {rejectionReason ? (
            <p className="mb-2">
              <strong>Alasan penolakan:</strong> {rejectionReason}
            </p>
          ) : (
            <p className="mb-2">
              Permohonan verifikasi akun Anda telah ditolak oleh tim kami.
            </p>
          )}
          <p className="text-sm mb-3">
            Silakan perbarui informasi perusahaan Anda dan ajukan verifikasi ulang, atau
            hubungi tim support kami untuk bantuan lebih lanjut.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link href="/employer/dashboard#company-profile">
              <Button
                variant="outline"
                size="sm"
                className="bg-red-100 dark:bg-red-900/30 border-red-600 dark:border-red-400 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                data-testid="button-update-info"
              >
                Perbarui Informasi
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              data-testid="button-contact-support"
              onClick={() => window.open('mailto:support@pintukerja.com', '_blank')}
            >
              Hubungi Support
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
