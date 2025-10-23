import { MapPin, Clock, Search, Briefcase, Coins, Building2, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VerifiedBadge } from "@/components/ui/verified-badge";

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  industry?: string;
  salaryMin?: number;
  salaryMax?: number;
  createdAt: string;
  description?: string;
  requirements?: string;
  company: {
    name: string;
    logo?: string;
    subscriptionPlan?: string;
    industry?: string;
    description?: string;
    location?: string;
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
            {filteredJobs.map((job, index) => {
              const isVerified = job.company.subscriptionPlan && 
                ['starter', 'professional', 'enterprise'].includes(job.company.subscriptionPlan);
              
              return (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 flex flex-col"
                  data-testid={`job-card-${index}`}
                >
                  {/* Company Logo and Title */}
                  <div className="flex items-start gap-3 mb-4">
                    {job.company.logo ? (
                      <img 
                        src={job.company.logo} 
                        alt={`${job.company.name} logo`}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-300">
                          {job.company.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Company */}
                  <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 mb-3">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.company.name}</span>
                    {isVerified && <VerifiedBadge size="sm" />}
                  </div>

                  {/* Time and Type */}
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: localeId })}</span>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium">
                      {formatJobType(job.jobType)}
                    </span>
                  </div>

                  {/* Category and Salary */}
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                    {job.industry && <span>{job.industry}</span>}
                    {job.industry && <span className="mx-2">•</span>}
                    <span className="font-semibold text-black dark:text-white">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowApplyDialog(true);
                    }}
                    className="block w-full py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-full hover:opacity-90 transition-colors text-center mt-auto"
                    data-testid={`button-apply-${index}`}
                  >
                    Lamar Sekarang
                  </button>
                </div>
              );
            })}
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

      {/* Job Detail Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-apply-job">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black dark:text-white">
              {selectedJob?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {selectedJob && `${selectedJob.company.name} • ${selectedJob.location}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6 py-4">
              {/* Company Info */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {selectedJob.company.logo ? (
                  <img 
                    src={selectedJob.company.logo} 
                    alt={`${selectedJob.company.name} logo`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-black dark:text-white">{selectedJob.company.name}</h3>
                    {selectedJob.company.subscriptionPlan && 
                      ['starter', 'professional', 'enterprise'].includes(selectedJob.company.subscriptionPlan) && 
                      <VerifiedBadge size="md" />
                    }
                  </div>
                  {selectedJob.company.industry && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.company.industry}</p>
                  )}
                  {selectedJob.company.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedJob.company.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Coins className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Gaji</p>
                    <p className="font-semibold text-black dark:text-white">
                      {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Tipe Pekerjaan</p>
                    <p className="font-semibold text-black dark:text-white">{formatJobType(selectedJob.jobType)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Lokasi</p>
                    <p className="font-semibold text-black dark:text-white">{selectedJob.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Diposting</p>
                    <p className="font-semibold text-black dark:text-white">
                      {formatDistanceToNow(new Date(selectedJob.createdAt), { addSuffix: true, locale: localeId })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedJob.description && (
                <div>
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Deskripsi Pekerjaan
                  </h4>
                  <div 
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                  />
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-3">Persyaratan</h4>
                  <div 
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedJob.requirements }}
                  />
                </div>
              )}

              {/* Company Description */}
              {selectedJob.company.description && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold text-black dark:text-white mb-3">Tentang Perusahaan</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedJob.company.description}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowApplyDialog(false)}
              className="w-full sm:w-auto"
            >
              Tutup
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link href="/register" className="flex-1 sm:flex-none">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setShowApplyDialog(false)}
                  data-testid="button-register-apply"
                >
                  Daftar untuk Melamar
                </Button>
              </Link>
              <Link href="/login" className="flex-1 sm:flex-none">
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={() => setShowApplyDialog(false)}
                  data-testid="button-login-apply"
                >
                  Sudah Punya Akun? Masuk
                </Button>
              </Link>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
