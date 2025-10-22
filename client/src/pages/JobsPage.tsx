import { useState } from "react";
import { Search, Loader2, MapPin, Briefcase, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  industry: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: string;
  company: {
    id: string;
    name: string;
  };
}

interface JobsResponse {
  jobs: Job[];
  total: number;
}

export default function JobsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 20;

  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: jobsPerPage.toString(),
  });

  if (searchKeyword) queryParams.append("keyword", searchKeyword);

  const { data, isLoading } = useQuery<JobsResponse>({
    queryKey: ["/api/jobs", currentPage, searchKeyword],
    queryFn: async () => {
      const res = await fetch(`/api/jobs?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
  });

  const jobs = data?.jobs || [];
  const totalJobs = data?.total || 0;
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Gaji dapat dinegosiasi";
    if (min && max) {
      return `Rp ${(min / 1000000).toFixed(1)} - ${(max / 1000000).toFixed(1)} jt/bulan`;
    }
    if (min) return `Dari Rp ${(min / 1000000).toFixed(1)} jt/bulan`;
    return `Hingga Rp ${(max! / 1000000).toFixed(1)} jt/bulan`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header variant="dark" />

      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-page-title">
            Cari Lowongan Pekerjaan
          </h1>
          <div className="flex items-center gap-4 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pekerjaan berdasarkan posisi, perusahaan..."
                className="w-full pl-12 pr-4 py-3 text-base bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>
          <p className="mt-4 text-gray-300" data-testid="text-total-jobs">
            {totalJobs.toLocaleString()} lowongan tersedia
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12" data-testid="loading-jobs">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-gray-600">Memuat lowongan...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12" data-testid="no-jobs">
            <p className="text-gray-600 text-lg">Tidak ada lowongan yang ditemukan</p>
            <p className="text-gray-500 mt-2">Coba ubah kata kunci pencarian Anda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  data-testid={`job-card-${job.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2" data-testid={`job-title-${job.id}`}>
                        {job.title}
                      </h3>
                      <p className="text-gray-700 font-medium mb-3" data-testid={`company-name-${job.id}`}>
                        {job.company.name}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span className="capitalize">{job.jobType}</span>
                        </div>
                        {(job.salaryMin || job.salaryMax) && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-block px-4 py-2 bg-primary text-black font-semibold rounded-full text-sm">
                        Lihat Detail
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              data-testid="button-prev-page"
            >
              Sebelumnya
            </button>
            <span className="px-4 py-2 text-gray-700" data-testid="text-current-page">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              data-testid="button-next-page"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
