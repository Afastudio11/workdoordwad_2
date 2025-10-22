import { MapPin, Clock, Search, Briefcase, Coins } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  industry?: string;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
  company: {
    name: string;
    logo?: string;
  };
}

export default function JobCircularsSection() {
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const { data: jobsData, isLoading } = useQuery<{ jobs: Job[], total: number }>({
    queryKey: ["/api/jobs/trending", { limit: 6 }],
  });

  // Get unique industries from jobs data for dynamic categories
  const categories = jobsData?.jobs 
    ? Array.from(new Set(jobsData.jobs.map(job => job.industry).filter(Boolean)))
        .slice(0, 5) as string[]
    : [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    setLocation(`/find-job${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
  };

  const jobs = jobsData?.jobs || [];
  const filteredJobs = activeCategory
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
        job.industry?.toLowerCase().includes(activeCategory.toLowerCase())
      )
    : jobs;
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Negosiasi";
    if (min && max) {
      return `Rp ${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)} juta`;
    }
    if (min) return `Rp ${(min / 1000000).toFixed(0)} juta+`;
    return "Negosiasi";
  };

  const formatJobType = (type: string) => {
    const types: Record<string, string> = {
      "full-time": "Waktu Penuh",
      "part-time": "Paruh Waktu",
      "contract": "Kontrak",
      "freelance": "Freelance"
    };
    return types[type] || type;
  };

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 md:mb-8">
            Lowongan Pekerjaan Unggulan
          </h2>
          
          {/* Search Bar - Single Pill Shape */}
          <div className="mb-6">
            <div className="flex items-center gap-0 bg-white rounded-full border border-gray-200 p-1.5 max-w-2xl shadow-sm">
              <input 
                type="text" 
                placeholder="Cari kebutuhan kamu..." 
                className="flex-1 pl-6 pr-4 py-2.5 bg-transparent text-black text-sm focus:outline-none"
                data-testid="input-search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center flex-shrink-0"
                data-testid="button-search"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-gray-600 text-sm font-medium">Kategori Populer:</span>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !activeCategory 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              data-testid="button-category-all"
              onClick={() => setActiveCategory(null)}
            >
              Semua
            </button>
            {categories.map((cat, index) => (
              <button 
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid={`button-category-${index}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Memuat lowongan...</div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada lowongan tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job, index) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                data-testid={`job-card-${index}`}
              >
                {/* Position and Location */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job.location}</span>
                  </div>
                </div>
                
                {/* Company */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-2xl">🏢</div>
                  <span className="text-sm font-medium text-black">{job.company.name}</span>
                </div>

                {/* Time and Type */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: localeId })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{formatJobType(job.jobType)}</span>
                  </div>
                </div>

                {/* Category and Salary */}
                <div className="flex items-center gap-2 mb-5">
                  {job.industry && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{job.industry}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Coins className="h-3.5 w-3.5" />
                    <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowApplyDialog(true);
                  }}
                  className="block w-full py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-full hover:opacity-90 transition-colors text-center"
                  data-testid={`button-apply-${index}`}
                >
                  Lamar Sekarang
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Link 
            href="/register"
            className="inline-block w-full md:w-auto px-16 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
            data-testid="button-load-more"
          >
            Lihat Lebih Banyak
          </Link>
        </div>
      </div>

      {/* Apply Job Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-md" data-testid="dialog-apply-job">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Lamar Pekerjaan</DialogTitle>
            <DialogDescription>
              Silakan daftar atau masuk untuk melamar pekerjaan ini
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-4">
              {/* Job Info */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{selectedJob.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{selectedJob.company.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedJob.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Coins className="h-4 w-4" />
                  <span>{formatSalary(selectedJob.salaryMin, selectedJob.salaryMax)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/register">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setShowApplyDialog(false)}
                    data-testid="button-register-apply"
                  >
                    Daftar untuk Melamar
                  </Button>
                </Link>
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowApplyDialog(false)}
                    data-testid="button-login-apply"
                  >
                    Sudah punya akun? Masuk
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
