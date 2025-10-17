import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Briefcase, Filter } from "lucide-react";
import { Link } from "wouter";

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  industry: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  education: string | null;
  experience: string | null;
  isFeatured: boolean;
  source: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    location: string | null;
  };
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export default function BrowseJobsPage() {
  const params = new URLSearchParams(window.location.search);
  const [keyword, setKeyword] = useState(params.get("keyword") || "");
  const [location, setLocation] = useState(params.get("location") || "");
  const [industry, setIndustry] = useState("");
  const [jobType, setJobType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(params.get("keyword") || "");
  const [searchLocation, setSearchLocation] = useState(params.get("location") || "");

  const { data, isLoading } = useQuery<JobsResponse>({
    queryKey: ["/api/jobs", { keyword: searchKeyword, location: searchLocation, industry, jobType }],
  });

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setSearchLocation(location);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Gaji Dirahasiakan";
    if (min && max) {
      return `Rp ${(min / 1000000).toFixed(1)}-${(max / 1000000).toFixed(1)} jt`;
    }
    if (min) return `Rp ${(min / 1000000).toFixed(1)} jt`;
    return `Rp ${(max! / 1000000).toFixed(1)} jt`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return `${Math.floor(diffDays / 30)} bulan lalu`;
  };

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

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Cari Lowongan Kerja</h1>
          
          <div className="bg-white rounded-md border border-gray-300 p-3 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari posisi atau perusahaan"
                  className="w-full pl-10 pr-4 py-3 border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-500"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  data-testid="input-search-keyword"
                />
              </div>
              <div className="hidden md:block w-px bg-gray-200" />
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Lokasi"
                  className="w-full pl-10 pr-4 py-3 border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  data-testid="input-search-location"
                />
              </div>
              <button 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleSearch}
                data-testid="button-search"
              >
                Cari
              </button>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setIndustry("")}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                industry === "" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              data-testid="filter-industry-all"
            >
              Semua Industri
            </button>
            {["Retail", "F&B", "Teknologi", "Logistik", "Kesehatan"].map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  industry === ind ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                data-testid={`filter-industry-${ind.toLowerCase()}`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          {data && (
            <span data-testid="results-count">
              {data.total} lowongan ditemukan
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 pb-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {data?.jobs.map((job, index) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block border-b border-gray-200 py-6 hover:bg-gray-50 transition-colors -mx-6 px-6"
                data-testid={`job-card-${index}`}
              >
                {job.isFeatured && (
                  <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded mb-2">
                    Featured
                  </span>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1" data-testid={`job-company-${index}`}>
                      {job.company.name}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2" data-testid={`job-title-${index}`}>
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span data-testid={`job-location-${index}`}>{job.location}</span>
                      <span>•</span>
                      <span data-testid={`job-type-${index}`}>{job.jobType}</span>
                      {job.experience && (
                        <>
                          <span>•</span>
                          <span>{job.experience}</span>
                        </>
                      )}
                    </div>
                    {(job.salaryMin || job.salaryMax) && (
                      <div className="text-base font-semibold text-gray-900 mb-3" data-testid={`job-salary-${index}`}>
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span data-testid={`job-posted-${index}`}>{formatDate(job.createdAt)}</span>
                      {job.source === "instagram" && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600">Dari Instagram</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {data && data.jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada lowongan yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
