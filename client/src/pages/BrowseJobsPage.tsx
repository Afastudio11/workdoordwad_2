import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, MapPin, Briefcase, Filter, Heart, Zap, DollarSign, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);
  
  const [keyword, setKeyword] = useState(params.get("keyword") || "");
  const [location, setLocation] = useState(params.get("location") || "");
  const [industry, setIndustry] = useState("");
  const [jobType, setJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [experience, setExperience] = useState("");
  
  const [searchKeyword, setSearchKeyword] = useState(params.get("keyword") || "");
  const [searchLocation, setSearchLocation] = useState(params.get("location") || "");
  const [searchIndustry, setSearchIndustry] = useState("");
  const [searchJobType, setSearchJobType] = useState("");
  const [searchSalaryMin, setSearchSalaryMin] = useState<number | undefined>();
  const [searchExperience, setSearchExperience] = useState("");

  const { data, isLoading } = useQuery<JobsResponse>({
    queryKey: ["/api/jobs", { 
      keyword: searchKeyword, 
      location: searchLocation, 
      industry: searchIndustry, 
      jobType: searchJobType,
      salaryMin: searchSalaryMin,
      experience: searchExperience,
    }],
  });

  const quickApplyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await apiRequest("/api/applications", "POST", { jobId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({ title: "Lamaran berhasil dikirim!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Gagal mengirim lamaran", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await apiRequest("/api/wishlists", "POST", { jobId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlists"] });
      toast({ title: "Ditambahkan ke wishlist" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Gagal menambahkan ke wishlist",
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setSearchLocation(location);
    setSearchIndustry(industry === "all" ? "" : industry);
    setSearchJobType(jobType === "all" ? "" : jobType);
    setSearchExperience(experience === "all" ? "" : experience);
    
    // Parse salary range
    if (salaryRange && salaryRange !== "all") {
      const ranges: Record<string, number> = {
        "0-5": 0,
        "5-10": 5000000,
        "10-15": 10000000,
        "15+": 15000000,
      };
      setSearchSalaryMin(ranges[salaryRange]);
    } else {
      setSearchSalaryMin(undefined);
    }
  };

  const handleQuickApply = (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({ 
        title: "Silakan login terlebih dahulu",
        variant: "destructive" 
      });
      return;
    }
    
    if (user?.role !== "pekerja") {
      toast({ 
        title: "Hanya pekerja yang dapat melamar pekerjaan",
        variant: "destructive" 
      });
      return;
    }
    
    quickApplyMutation.mutate(jobId);
  };

  const handleAddToWishlist = (jobId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({ 
        title: "Silakan login terlebih dahulu",
        variant: "destructive" 
      });
      return;
    }
    
    addToWishlistMutation.mutate(jobId);
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
        <div className="max-w-[1600px] mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-gray-900" />
              <span className="text-lg font-semibold text-gray-900">Pintu Kerja</span>
            </Link>
            {isAuthenticated && user?.role === "pekerja" && (
              <Link href="/user/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cari Lowongan Kerja</h1>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-gray-300 p-4 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari posisi, perusahaan, atau kata kunci"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-500"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  data-testid="input-search-keyword"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Lokasi (kota, provinsi)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  data-testid="input-search-location"
                />
              </div>
              
              {/* Mobile Filter Sheet */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filter Pencarian</SheetTitle>
                    <SheetDescription>Sesuaikan pencarian dengan preferensi Anda</SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Industri</label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih industri" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Industri</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="F&B">F&B</SelectItem>
                          <SelectItem value="Teknologi">Teknologi</SelectItem>
                          <SelectItem value="Logistik">Logistik</SelectItem>
                          <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Jenis Pekerjaan</label>
                      <Select value={jobType} onValueChange={setJobType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis pekerjaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Jenis</SelectItem>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Kontrak</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Range Gaji (juta/bulan)</label>
                      <Select value={salaryRange} onValueChange={setSalaryRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih range gaji" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Range</SelectItem>
                          <SelectItem value="0-5">0 - 5 juta</SelectItem>
                          <SelectItem value="5-10">5 - 10 juta</SelectItem>
                          <SelectItem value="10-15">10 - 15 juta</SelectItem>
                          <SelectItem value="15+">15 juta+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Pengalaman</label>
                      <Select value={experience} onValueChange={setExperience}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih pengalaman" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Tingkat</SelectItem>
                          <SelectItem value="0-1 tahun">0-1 tahun</SelectItem>
                          <SelectItem value="1-3 tahun">1-3 tahun</SelectItem>
                          <SelectItem value="3-5 tahun">3-5 tahun</SelectItem>
                          <SelectItem value="5+ tahun">5+ tahun</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full" onClick={handleSearch}>
                      Terapkan Filter
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button 
                className="px-8 py-3 md:w-auto"
                onClick={handleSearch}
                data-testid="button-search"
              >
                Cari
              </Button>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 mb-6">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Industri" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Industri</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="F&B">F&B</SelectItem>
                <SelectItem value="Teknologi">Teknologi</SelectItem>
                <SelectItem value="Logistik">Logistik</SelectItem>
                <SelectItem value="Kesehatan">Kesehatan</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Jenis Pekerjaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Kontrak</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={salaryRange} onValueChange={setSalaryRange}>
              <SelectTrigger>
                <SelectValue placeholder="Range Gaji" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Range</SelectItem>
                <SelectItem value="0-5">0 - 5 juta</SelectItem>
                <SelectItem value="5-10">5 - 10 juta</SelectItem>
                <SelectItem value="10-15">10 - 15 juta</SelectItem>
                <SelectItem value="15+">15 juta+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Pengalaman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat</SelectItem>
                <SelectItem value="0-1 tahun">0-1 tahun</SelectItem>
                <SelectItem value="1-3 tahun">1-3 tahun</SelectItem>
                <SelectItem value="3-5 tahun">3-5 tahun</SelectItem>
                <SelectItem value="5+ tahun">5+ tahun</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {data && (
              <span data-testid="results-count">
                Menampilkan <span className="font-semibold">{data.total}</span> lowongan
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data?.jobs.map((job, index) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white"
                data-testid={`job-card-${index}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/jobs/${job.id}`} className="flex-1">
                    {job.isFeatured && (
                      <Badge className="mb-3">
                        <Zap className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <div className="text-sm font-medium text-gray-500 mb-2" data-testid={`job-company-${index}`}>
                      {job.company.name}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary transition-colors" data-testid={`job-title-${index}`}>
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span data-testid={`job-location-${index}`}>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span data-testid={`job-type-${index}`}>{job.jobType}</span>
                      </span>
                      {job.experience && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.experience}</span>
                        </span>
                      )}
                    </div>
                    {(job.salaryMin || job.salaryMax) && (
                      <div className="flex items-center gap-1 text-lg font-semibold text-gray-900 mb-3">
                        <DollarSign className="w-5 h-5" />
                        <span data-testid={`job-salary-${index}`}>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span data-testid={`job-posted-${index}`}>{formatDate(job.createdAt)}</span>
                      {job.source === "instagram" && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            Dari Instagram
                          </Badge>
                        </>
                      )}
                    </div>
                  </Link>
                  
                  {isAuthenticated && user?.role === "pekerja" && (
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => handleQuickApply(job.id, e)}
                        className="whitespace-nowrap"
                        data-testid={`button-quick-apply-${index}`}
                        disabled={quickApplyMutation.isPending}
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        Quick Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleAddToWishlist(job.id, e)}
                        data-testid={`button-wishlist-${index}`}
                        disabled={addToWishlistMutation.isPending}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.jobs.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-500">Tidak ada lowongan yang ditemukan</p>
            <p className="text-sm text-gray-400 mt-2">Coba ubah kata kunci atau filter pencarian Anda</p>
          </div>
        )}
      </div>
    </div>
  );
}
