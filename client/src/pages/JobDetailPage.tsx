import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Briefcase, MapPin, Clock, GraduationCap, DollarSign, Building2, Instagram, ArrowLeft } from "lucide-react";

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
    contactEmail: string | null;
    contactPhone: string | null;
  };
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;

  const { data: job, isLoading } = useQuery<Job>({
    queryKey: [`/api/jobs/${jobId}`],
    enabled: !!jobId,
  });

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
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-gray-900" />
                <span className="text-lg font-semibold text-gray-900">Pintu Kerja</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-gray-900" />
                <span className="text-lg font-semibold text-gray-900">Pintu Kerja</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
          <p className="text-gray-500">Lowongan tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-gray-900" />
              <span className="text-lg font-semibold text-gray-900">Pintu Kerja</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar lowongan
        </Link>

        <div className="mb-8">
          {job.isFeatured && (
            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded mb-3">
              Featured
            </span>
          )}
          
          <h1 className="text-3xl font-semibold text-gray-900 mb-4" data-testid="job-title">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 text-lg text-gray-600 mb-6" data-testid="company-name">
            <Building2 className="h-5 w-5" />
            {job.company.name}
          </div>

          <div className="border-y border-gray-200 py-4 my-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div data-testid="job-location">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>Lokasi</span>
                </div>
                <div className="font-medium text-gray-900">{job.location}</div>
              </div>
              
              <div data-testid="job-type">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Briefcase className="h-4 w-4" />
                  <span>Tipe</span>
                </div>
                <div className="font-medium text-gray-900">{job.jobType}</div>
              </div>

              {job.experience && (
                <div data-testid="job-experience">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Pengalaman</span>
                  </div>
                  <div className="font-medium text-gray-900">{job.experience}</div>
                </div>
              )}

              {job.education && (
                <div data-testid="job-education">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>Pendidikan</span>
                  </div>
                  <div className="font-medium text-gray-900">{job.education}</div>
                </div>
              )}
            </div>
          </div>

          {(job.salaryMin || job.salaryMax) && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm">Gaji</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900" data-testid="job-salary">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi Pekerjaan</h2>
          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line" data-testid="job-description">
            {job.description}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tentang Perusahaan</h2>
          <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
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

        <div className="border-t border-gray-200 pt-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <p data-testid="job-posted-date">Diposting: {formatDate(job.createdAt)}</p>
              {job.source === "instagram" && job.sourceUrl && (
                <div className="flex items-center gap-2 mt-2 text-blue-600">
                  <Instagram className="h-4 w-4" />
                  <span>Lowongan dari Instagram</span>
                </div>
              )}
            </div>
            
            <button 
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => console.log("Apply clicked for job:", job.id)}
              data-testid="button-apply"
            >
              Lamar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
