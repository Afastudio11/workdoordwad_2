import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Briefcase, MapPin, Clock, GraduationCap, Wallet, Building2, Instagram, ArrowLeft, AlertCircle, RefreshCw, Mail, Phone, Globe, Bookmark, Calendar } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string;
  jobType: string;
  industry: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  education: string | null;
  experience: string | null;
  isFeatured: boolean;
  source: string;
  sourceUrl: string | null;
  createdAt: string;
  company: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    industry: string | null;
    website: string | null;
    logo: string | null;
    employeeCount: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
  };
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const viewTracked = useRef(false);

  const { data: job, isLoading, isError, error } = useQuery<Job>({
    queryKey: [`/api/jobs/${jobId}`],
    enabled: !!jobId,
  });

  useEffect(() => {
    if (jobId && job && !viewTracked.current) {
      viewTracked.current = true;
      apiRequest(`/api/jobs/${jobId}/view`, "POST").catch(err => 
        console.error("Failed to track view:", err)
      );
    }
  }, [jobId, job]);

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Negosiasi";
    
    const format = (amount: number) => {
      if (amount >= 1000000) {
        const juta = (amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1);
        return `${juta} juta`;
      }
      if (amount >= 1000) {
        const ribu = (amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1);
        return `${ribu} ribu`;
      }
      return amount.toLocaleString('id-ID');
    };
    
    if (min && max) {
      return `Rp ${format(min)} - ${format(max)}`;
    }
    if (min) return `Rp ${format(min)}`;
    return `Rp ${format(max!)}`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex items-center justify-between h-14 md:h-16">
              <Link href="/" className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
                <span className="text-base md:text-lg font-semibold text-gray-900">Pintu Kerja</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12">
          <div className="animate-pulse space-y-4 md:space-y-6">
            <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 md:h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex items-center justify-between h-14 md:h-16">
              <Link href="/" className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
                <span className="text-base md:text-lg font-semibold text-gray-900">Pintu Kerja</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12">
          <Alert variant="destructive" className="mb-6" data-testid="error-alert">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Terjadi Kesalahan</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p>{(error as any)?.message || "Gagal memuat detail lowongan. Silakan coba lagi."}</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  onClick={() => queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] })}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  data-testid="button-retry"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
                <Link href="/jobs">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" data-testid="button-back-to-jobs">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali ke Daftar Lowongan
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex items-center justify-between h-14 md:h-16">
              <Link href="/" className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
                <span className="text-base md:text-lg font-semibold text-gray-900">Pintu Kerja</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12">
          <p className="text-sm md:text-base text-gray-500">Lowongan tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
              <span className="text-base md:text-lg font-semibold text-gray-900">Pintu Kerja</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 mb-4 md:mb-6" data-testid="link-back">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar lowongan
        </Link>

        <div className="mb-6 md:mb-8">
          {job.isFeatured && (
            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded mb-2 md:mb-3">
              Unggulan
            </span>
          )}
          
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 md:mb-4" data-testid="job-title">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 text-base sm:text-lg text-gray-600 mb-4 md:mb-6" data-testid="company-name">
            <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            {job.company.name}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 md:p-6 my-4 md:my-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200" data-testid="job-salary">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Wallet className="h-5 w-5 text-black" />
                  <span className="text-sm uppercase tracking-wide">GAJI</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatSalary(job.salaryMin, job.salaryMax)}/bln
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200" data-testid="job-type">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Briefcase className="h-5 w-5 text-black" />
                  <span className="text-sm uppercase tracking-wide">TIPE PEKERJAAN</span>
                </div>
                <div className="text-lg font-semibold text-gray-900 capitalize">{job.jobType}</div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200" data-testid="job-location">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <MapPin className="h-5 w-5 text-black" />
                  <span className="text-sm uppercase tracking-wide">LOKASI</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">{job.location}</div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200" data-testid="job-posted">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="h-5 w-5 text-black" />
                  <span className="text-sm uppercase tracking-wide">DIPOSTING</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">{formatDate(job.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Deskripsi Pekerjaan</h2>
          <div className="prose prose-sm max-w-none text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line" data-testid="job-description">
            {job.description}
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Tentang Perusahaan</h2>
          <div className="bg-gray-50 rounded-md p-4 sm:p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2" data-testid="company-info-name">{job.company.name}</h3>
            {job.company.description && (
              <p className="text-sm text-gray-600 mb-4">{job.company.description}</p>
            )}
            <div className="space-y-2 text-sm">
              {job.company.location && (
                <div className="text-gray-600">
                  <span className="font-medium">Lokasi:</span> {job.company.location}
                </div>
              )}
              {job.company.industry && (
                <div className="text-gray-600">
                  <span className="font-medium">Industri:</span> {job.company.industry}
                </div>
              )}
              {job.company.contactEmail && (
                <div className="text-gray-600">
                  <span className="font-medium">Email:</span> {job.company.contactEmail}
                </div>
              )}
              {job.company.contactPhone && (
                <div className="text-gray-600">
                  <span className="font-medium">Telepon:</span> {job.company.contactPhone}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 md:pt-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {job.source === "instagram" && job.sourceUrl && (
              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <Instagram className="h-4 w-4" />
                <span>Lowongan dari Instagram</span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
              <button 
                className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-900 text-sm md:text-base font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] flex items-center justify-center gap-2"
                data-testid="button-save"
              >
                <Bookmark className="h-5 w-5" />
                Simpan
              </button>
              
              <button 
                className="w-full sm:w-auto px-6 md:px-8 py-3 bg-primary text-primary-foreground text-sm md:text-base font-medium rounded-lg hover:bg-primary/90 transition-colors min-h-[44px]"
                onClick={() => setShowCompanyDialog(true)}
                data-testid="button-apply"
              >
                Lamar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-company-detail">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold">Tentang Perusahaan</DialogTitle>
            <DialogDescription>
              Pelajari lebih lanjut tentang perusahaan sebelum melamar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-start gap-4">
              {job.company.logo ? (
                <img 
                  src={job.company.logo} 
                  alt={`${job.company.name} logo`}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
                  data-testid="img-company-logo"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1" data-testid="text-company-name-dialog">
                  {job.company.name}
                </h3>
                {job.company.industry && (
                  <p className="text-sm text-gray-600">{job.company.industry}</p>
                )}
                {job.company.employeeCount && (
                  <p className="text-sm text-gray-600 mt-1">{job.company.employeeCount} karyawan</p>
                )}
              </div>
            </div>

            {job.company.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Deskripsi Perusahaan</h4>
                <p className="text-sm text-gray-600 leading-relaxed" data-testid="text-company-description">
                  {job.company.description}
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Informasi Kontak</h4>
              <div className="space-y-3">
                {job.company.location && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600" data-testid="text-company-location">{job.company.location}</span>
                  </div>
                )}
                {job.company.contactEmail && (
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <a 
                      href={`mailto:${job.company.contactEmail}`}
                      className="text-blue-600 hover:text-blue-700 break-all"
                      data-testid="link-company-email"
                    >
                      {job.company.contactEmail}
                    </a>
                  </div>
                )}
                {job.company.contactPhone && (
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <a 
                      href={`tel:${job.company.contactPhone}`}
                      className="text-blue-600 hover:text-blue-700"
                      data-testid="link-company-phone"
                    >
                      {job.company.contactPhone}
                    </a>
                  </div>
                )}
                {job.company.website && (
                  <div className="flex items-start gap-3 text-sm">
                    <Globe className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <a 
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 break-all"
                      data-testid="link-company-website"
                    >
                      {job.company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCompanyDialog(false)}
              className="w-full sm:w-auto"
              data-testid="button-cancel-apply"
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                setShowCompanyDialog(false);
                console.log("Proceed with application for job:", job.id);
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              data-testid="button-proceed-apply"
            >
              Lanjutkan Melamar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
