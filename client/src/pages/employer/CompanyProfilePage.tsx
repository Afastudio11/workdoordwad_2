/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/company-profile
 * - DO NOT import admin or worker components
 */
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Building2, Loader2, Save, AlertTriangle, Upload, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Company } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VerifiedBadge } from "@/components/VerifiedBadge";

interface VerificationStatus {
  status: string;
  rejectionReason?: string;
  rejectionCategory?: string;
  rejectedAt?: string;
  canResubmit: boolean;
  resubmissionCount: number;
  maxResubmissions: number;
  documentsRequired: string[];
}

export default function CompanyProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showReuploadModal, setShowReuploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [uploadFiles, setUploadFiles] = useState({
    companyRegistration: null as File | null,
    taxDocument: null as File | null,
    directorId: null as File | null,
  });
  const [additionalNotes, setAdditionalNotes] = useState("");

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ["/api/employer/company"],
  });

  const { data: verificationStatus } = useQuery<VerificationStatus>({
    queryKey: ["/api/employer/verification-status"],
    enabled: !!company,
  });

  const [formData, setFormData] = useState<Partial<Company>>({});

  const updateCompanyMutation = useMutation({
    mutationFn: async (data: Partial<Company>) => {
      const res = await apiRequest("/api/employer/company", "PUT", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/company"] });
      setIsEditing(false);
      toast({
        title: "Berhasil",
        description: "Profil perusahaan berhasil diperbarui",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal memperbarui profil perusahaan",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    setFormData(company || {});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({});
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyMutation.mutate(formData);
  };

  const handleChange = (field: keyof Company, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (fieldName: keyof typeof uploadFiles, file: File | null) => {
    if (!file) {
      setUploadFiles(prev => ({ ...prev, [fieldName]: null }));
      return;
    }

    const errors: string[] = [];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      errors.push(`${fieldName}: Hanya file PDF, JPG, dan PNG yang diperbolehkan`);
    }

    if (file.size > maxSize) {
      errors.push(`${fieldName}: Ukuran file maksimal 5MB`);
    }

    if (errors.length > 0) {
      setFileErrors(errors);
      return;
    }

    setFileErrors([]);
    setUploadFiles(prev => ({ ...prev, [fieldName]: file }));
  };

  const reuploadMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (!uploadFiles.companyRegistration || !uploadFiles.taxDocument || !uploadFiles.directorId) {
        throw new Error("Semua dokumen wajib diupload");
      }

      formData.append('companyRegistration', uploadFiles.companyRegistration);
      formData.append('taxDocument', uploadFiles.taxDocument);
      formData.append('directorId', uploadFiles.directorId);
      if (additionalNotes) {
        formData.append('additionalNotes', additionalNotes);
      }

      const res = await fetch('/api/employer/resubmit-verification', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Gagal mengirim ulang dokumen');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/verification-status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employer/company"] });
      setShowReuploadModal(false);
      setShowSuccessModal(true);
      setUploadFiles({
        companyRegistration: null,
        taxDocument: null,
        directorId: null,
      });
      setAdditionalNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal mengirim ulang dokumen verifikasi",
        variant: "destructive",
      });
    },
  });

  const handleReuploadSubmit = () => {
    const errors: string[] = [];
    
    if (!uploadFiles.companyRegistration) errors.push("Dokumen Registrasi Perusahaan wajib diupload");
    if (!uploadFiles.taxDocument) errors.push("Dokumen NPWP wajib diupload");
    if (!uploadFiles.directorId) errors.push("KTP Direktur wajib diupload");

    if (errors.length > 0) {
      setFileErrors(errors);
      return;
    }

    reuploadMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profil Perusahaan</h1>
        {!isEditing && (
          <Button onClick={handleEdit} variant="outline" data-testid="button-edit-profile">
            Edit Profil
          </Button>
        )}
      </div>

      {/* Verification Rejection Alert */}
      {verificationStatus?.status === 'rejected' && (
        <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" data-testid="alert-verification-rejected">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-900 dark:text-red-100 font-semibold">
            Permohonan Verifikasi Ditolak
          </AlertTitle>
          <AlertDescription className="text-red-800 dark:text-red-200 mt-2">
            <p className="mb-3">
              <strong>Alasan penolakan:</strong> {verificationStatus.rejectionReason}
            </p>
            <p className="mb-4">
              Silakan perbarui informasi perusahaan Anda dan ajukan verifikasi ulang, 
              atau hubungi tim support kami untuk bantuan lebih lanjut.
            </p>
            {verificationStatus.canResubmit ? (
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowReuploadModal(true)}
                  className="bg-lime-600 hover:bg-lime-700 text-white"
                  data-testid="button-reupload-docs"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Perbarui Informasi
                </Button>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300"
                  data-testid="button-contact-support"
                >
                  Hubungi Support
                </Button>
              </div>
            ) : (
              <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 mt-3">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertTitle className="text-yellow-900 dark:text-yellow-100 text-sm">
                  Batas Resubmit Tercapai
                </AlertTitle>
                <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-sm mt-1">
                  Anda sudah mencapai batas maksimal resubmit ({verificationStatus.maxResubmissions}x). 
                  Silakan hubungi tim support untuk bantuan lebih lanjut.
                </AlertDescription>
              </Alert>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6 border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6">
            {isEditing ? (
              <>
                <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {formData.logo || company?.logo ? (
                    <img 
                      src={formData.logo || company?.logo || ""} 
                      alt="Company Logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="logo">URL Logo Perusahaan</Label>
                  <Input
                    id="logo"
                    type="text"
                    value={formData.logo || ""}
                    onChange={(e) => handleChange("logo", e.target.value)}
                    placeholder="https://example.com/logo.png"
                    data-testid="input-logo"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Masukkan URL gambar logo perusahaan Anda (format: PNG, JPG, atau SVG)
                  </p>
                </div>
              </>
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {company?.logo ? (
                  <img 
                    src={company.logo} 
                    alt="Company Logo" 
                    className="w-full h-full object-cover"
                    data-testid="img-company-logo"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-gray-400" />
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="name">Nama Perusahaan *</Label>
            {isEditing ? (
              <Input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                data-testid="input-company-name"
              />
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-gray-900 text-lg font-semibold" data-testid="text-company-name">
                  {company?.name || "-"}
                </p>
                <VerifiedBadge plan={company?.subscriptionPlan as any} size="md" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description">Deskripsi Perusahaan</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
                placeholder="Ceritakan tentang perusahaan kamu..."
                data-testid="textarea-description"
              />
            ) : (
              <p className="text-gray-900 mt-2 whitespace-pre-wrap" data-testid="text-description">
                {company?.description || "-"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="industry">Industri</Label>
              {isEditing ? (
                <Input
                  id="industry"
                  type="text"
                  value={formData.industry || ""}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  placeholder="e.g., Teknologi, Keuangan"
                  data-testid="input-industry"
                />
              ) : (
                <p className="text-gray-900 mt-2" data-testid="text-industry">
                  {company?.industry || "-"}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Lokasi</Label>
              {isEditing ? (
                <Input
                  id="location"
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g., Jakarta, Indonesia"
                  data-testid="input-location"
                />
              ) : (
                <p className="text-gray-900 mt-2" data-testid="text-location">
                  {company?.location || "-"}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              {isEditing ? (
                <Input
                  id="website"
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://www.example.com"
                  data-testid="input-website"
                />
              ) : (
                <p className="text-gray-900 mt-2" data-testid="text-website">
                  {company?.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="employeeCount">Jumlah Karyawan</Label>
              {isEditing ? (
                <Input
                  id="employeeCount"
                  type="text"
                  value={formData.employeeCount || ""}
                  onChange={(e) => handleChange("employeeCount", e.target.value)}
                  placeholder="e.g., 50-100"
                  data-testid="input-employee-count"
                />
              ) : (
                <p className="text-gray-900 mt-2" data-testid="text-employee-count">
                  {company?.employeeCount || "-"}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contactEmail">Email Kontak</Label>
              {isEditing ? (
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  placeholder="hr@example.com"
                  data-testid="input-contact-email"
                />
              ) : (
                <p className="text-gray-900 mt-2" data-testid="text-contact-email">
                  {company?.contactEmail || "-"}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contactPhone">Telepon Kontak</Label>
              {isEditing ? (
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone || ""}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  placeholder="+62 xxx xxxx xxxx"
                  data-testid="input-contact-phone"
                />
              ) : (
                <p className="text-gray-900 mt-2" data-testid="text-contact-phone">
                  {company?.contactPhone || "-"}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900"
                disabled={updateCompanyMutation.isPending}
                data-testid="button-save-profile"
              >
                {updateCompanyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateCompanyMutation.isPending}
                data-testid="button-cancel-edit"
              >
                Batal
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Reupload Documents Modal */}
      <Dialog open={showReuploadModal} onOpenChange={setShowReuploadModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Perbarui Dokumen Verifikasi</DialogTitle>
            <DialogDescription>
              {verificationStatus?.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md mt-2">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Alasan Penolakan:</strong> {verificationStatus.rejectionReason}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyRegistration">
                  1. Dokumen Registrasi Perusahaan (SIUP/NIB) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyRegistration"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('companyRegistration', e.target.files?.[0] || null)}
                  className="mt-2"
                  data-testid="input-company-registration"
                />
                <p className="text-xs text-gray-500 mt-1">Format: PDF, JPG, PNG (Max 5MB)</p>
                {uploadFiles.companyRegistration && (
                  <p className="text-sm text-green-600 mt-1">✓ {uploadFiles.companyRegistration.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="taxDocument">
                  2. Dokumen Pajak (NPWP) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="taxDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('taxDocument', e.target.files?.[0] || null)}
                  className="mt-2"
                  data-testid="input-tax-document"
                />
                <p className="text-xs text-gray-500 mt-1">Format: PDF, JPG, PNG (Max 5MB)</p>
                {uploadFiles.taxDocument && (
                  <p className="text-sm text-green-600 mt-1">✓ {uploadFiles.taxDocument.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="directorId">
                  3. KTP Direktur <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="directorId"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('directorId', e.target.files?.[0] || null)}
                  className="mt-2"
                  data-testid="input-director-id"
                />
                <p className="text-xs text-gray-500 mt-1">Format: PDF, JPG, PNG (Max 5MB)</p>
                {uploadFiles.directorId && (
                  <p className="text-sm text-green-600 mt-1">✓ {uploadFiles.directorId.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="additionalNotes">Catatan Tambahan (Opsional)</Label>
                <Textarea
                  id="additionalNotes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Tambahkan catatan jika diperlukan..."
                  rows={4}
                  maxLength={500}
                  className="mt-2"
                  data-testid="textarea-additional-notes"
                />
                <p className="text-xs text-gray-500 mt-1">{additionalNotes.length}/500 karakter</p>
              </div>

              {verificationStatus && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ℹ️ Anda bisa resubmit maksimal {verificationStatus.maxResubmissions}x. 
                    Sisa: {verificationStatus.maxResubmissions - verificationStatus.resubmissionCount}x
                  </p>
                </div>
              )}

              {fileErrors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  <ul className="text-sm text-red-800 dark:text-red-200 list-disc list-inside">
                    {fileErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowReuploadModal(false);
                setFileErrors([]);
                setUploadFiles({
                  companyRegistration: null,
                  taxDocument: null,
                  directorId: null,
                });
                setAdditionalNotes("");
              }}
              disabled={reuploadMutation.isPending}
              data-testid="button-cancel-reupload"
            >
              Batal
            </Button>
            <Button
              onClick={handleReuploadSubmit}
              disabled={reuploadMutation.isPending}
              className="bg-lime-600 hover:bg-lime-700 text-white"
              data-testid="button-submit-reupload"
            >
              {reuploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Ulang Verifikasi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl mb-2">Dokumen Berhasil Dikirim Ulang!</DialogTitle>
            <DialogDescription className="text-base">
              Tim kami akan mereview dokumen Anda dalam 1-3 hari kerja. 
              Anda akan menerima notifikasi via email.
            </DialogDescription>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-lime-600 hover:bg-lime-700 text-white"
              data-testid="button-close-success"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
