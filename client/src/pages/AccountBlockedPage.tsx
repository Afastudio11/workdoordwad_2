import { useState } from "react";
import { XCircle, Mail, LogOut, Upload, CheckCircle, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

const CATEGORY_LABELS: Record<string, string> = {
  DOCUMENT_INCOMPLETE: "Dokumen Tidak Lengkap",
  DOCUMENT_INVALID: "Dokumen Tidak Valid/Palsu",
  COMPANY_INFO_MISMATCH: "Informasi Perusahaan Tidak Sesuai",
  SUSPICIOUS_ACTIVITY: "Aktivitas Mencurigakan/Spam",
  TERMS_VIOLATION: "Pelanggaran Ketentuan Layanan",
  FRAUD_REPORT: "Laporan Penipuan",
  OTHER: "Lainnya"
};

export default function AccountBlockedPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const canReupload = user?.canReuploadDocuments || false;
  const blockCategory = user?.blockCategory || "";

  const uploadDocsMutation = useMutation({
    mutationFn: async () => {
      // First upload files
      const formData = new FormData();
      if (selectedLogo) {
        formData.append('logo', selectedLogo);
      }
      if (selectedLegalDoc) {
        formData.append('legalDoc', selectedLegalDoc);
      }

      let logoUrl = "";
      let legalDocUrl = "";

      if (selectedLogo || selectedLegalDoc) {
        const uploadResponse = await apiRequest("/api/upload/company-docs", "POST", formData) as any;
        logoUrl = uploadResponse.logoUrl || "";
        legalDocUrl = uploadResponse.legalDocUrl || "";
      }

      // Then submit reupload
      return await apiRequest("/api/employer/reupload-docs", "POST", {
        logoUrl,
        legalDocUrl,
        notes
      });
    },
    onSuccess: () => {
      setUploadSuccess(true);
      toast({
        title: "Dokumen Berhasil Dikirim",
        description: "Tim kami akan meninjau dokumen Anda dalam 1-2 hari kerja",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Gagal Mengirim Dokumen",
        description: error.message || "Terjadi kesalahan saat mengirim dokumen",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedLogo && !selectedLegalDoc) {
      toast({
        variant: "destructive",
        title: "Dokumen Diperlukan",
        description: "Harap upload minimal satu dokumen",
      });
      return;
    }
    uploadDocsMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-red-200 dark:border-red-900">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-6">
              {uploadSuccess ? (
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              {uploadSuccess ? "Dokumen Terkirim" : "Akun Anda Telah Diblokir"}
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-gray-600 dark:text-gray-400">
              {uploadSuccess 
                ? "Terima kasih, kami sedang meninjau dokumen Anda" 
                : "Akses ke akun Anda telah dibatasi oleh administrator"
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {uploadSuccess ? (
            <>
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                  Status: Menunggu Tinjauan
                </h3>
                <p className="text-green-800 dark:text-green-400">
                  Dokumen Anda telah diterima dan sedang dalam proses peninjauan oleh tim kami.
                  Anda akan menerima notifikasi melalui email dalam 1-2 hari kerja.
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <strong>Perlu bantuan?</strong><br />
                  Email: support@pintukerja.com<br />
                  Jam: Senin - Jumat, 09:00 - 17:00 WIB
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Link href="/" className="w-full">
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
                  className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  data-testid="button-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Blocked Reason */}
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                  Kategori: {CATEGORY_LABELS[blockCategory] || "Tidak Diketahui"}
                </h3>
                {user?.blockedReason && (
                  <p className="text-red-800 dark:text-red-400 mt-2">{user.blockedReason}</p>
                )}
              </div>

              {canReupload ? (
                <>
                  {/* Can Reupload Documents */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Ulang Dokumen
                    </h3>
                    <p className="text-blue-800 dark:text-blue-400 mb-4">
                      Untuk membuka blokir akun Anda, harap upload dokumen yang benar dan lengkap di bawah ini.
                    </p>

                    <div className="space-y-4">
                      {/* Logo Upload */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Logo Perusahaan (Opsional)
                        </Label>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logo-reupload')?.click()}
                            className="flex-1"
                            data-testid="button-upload-logo"
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            {selectedLogo ? selectedLogo.name : "Pilih Logo"}
                          </Button>
                          {selectedLogo && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLogo(null)}
                            >
                              Hapus
                            </Button>
                          )}
                        </div>
                        <input
                          id="logo-reupload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setSelectedLogo(e.target.files?.[0] || null)}
                        />
                      </div>

                      {/* Legal Document Upload */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dokumen Legal (NPWP/NIB/Akta - Opsional)
                        </Label>
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('legal-doc-reupload')?.click()}
                            className="flex-1"
                            data-testid="button-upload-legal"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {selectedLegalDoc ? selectedLegalDoc.name : "Pilih Dokumen"}
                          </Button>
                          {selectedLegalDoc && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLegalDoc(null)}
                            >
                              Hapus
                            </Button>
                          )}
                        </div>
                        <input
                          id="legal-doc-reupload"
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) => setSelectedLegalDoc(e.target.files?.[0] || null)}
                        />
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Catatan untuk Admin (Opsional)
                        </Label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Jelaskan pembaruan atau perbaikan yang Anda lakukan..."
                          className="bg-white dark:bg-black border-gray-300 dark:border-gray-700"
                          rows={3}
                          data-testid="input-notes"
                        />
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={uploadDocsMutation.isPending}
                        className="w-full bg-primary text-black hover:bg-primary/90"
                        data-testid="button-submit-docs"
                      >
                        {uploadDocsMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Kirim Dokumen
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Cannot Reupload - Contact Support Only */}
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
                </>
              )}

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <strong>Email Support:</strong> support@pintukerja.com<br />
                  <strong>Jam Operasional:</strong> Senin - Jumat, 09:00 - 17:00 WIB
                </p>
              </div>

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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
