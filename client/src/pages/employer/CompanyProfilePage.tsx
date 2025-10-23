/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/company-profile
 * - DO NOT import admin or worker components
 */
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Building2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Company } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export default function CompanyProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ["/api/employer/company"],
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
    </div>
  );
}
