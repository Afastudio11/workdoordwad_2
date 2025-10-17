import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Briefcase, Users, Clock, GraduationCap, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logoImgDark from "@assets/black@4x_1760695283292.png";

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
    employeeCount: string | null;
  };
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

const jobCardColors = [
  "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900",
  "bg-pink-50 dark:bg-pink-950/20 border-pink-100 dark:border-pink-900",
  "bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900",
  "bg-cyan-50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900",
  "bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900",
  "bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900",
];

export default function JobDashboardPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const buildJobsUrl = () => {
    const params = new URLSearchParams();
    if (searchKeyword) params.append("keyword", searchKeyword);
    if (searchLocation) params.append("location", searchLocation);
    if (industry !== "all") params.append("industry", industry);
    if (jobType !== "all") params.append("jobType", jobType);
    if (experienceLevel !== "all") params.append("experience", experienceLevel);
    if (sortBy) params.append("sortBy", sortBy);
    
    const queryString = params.toString();
    return `/api/jobs${queryString ? `?${queryString}` : ""}`;
  };

  const { data, isLoading } = useQuery<JobsResponse>({
    queryKey: [buildJobsUrl()],
  });

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp${(amount / 1000000).toFixed(1)}jt`;
    }
    return `Rp${(amount / 1000).toFixed(0)}rb`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `Posted ${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `Posted ${diffDays} days ago`;
    } else {
      return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    }
  };

  const getValidUntil = (createdAt: string) => {
    const d = new Date(createdAt);
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getCompanyInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2);
  };

  const getApplicantCount = (index: number) => {
    const counts = [78, 58, 49, 50, 99, 99, 45, 67, 89, 34, 56, 73];
    return counts[index % counts.length];
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <img src={logoImgDark} alt="Pintu Kerja" className="h-8" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors" data-testid="link-home-nav">
                Home
              </Link>
              <Link href="/jobs" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors" data-testid="link-findjobs">
                Find jobs
              </Link>
              <Link href="/community" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-careers">
                Careers
              </Link>
              <Link href="/hiring" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-companyprofile">
                Company Profile
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600" data-testid="text-language">English</span>
              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-messages">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-profile">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">U</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <Select value={searchLocation || "all"} onValueChange={(val) => setSearchLocation(val === "all" ? "" : val)}>
              <SelectTrigger className="bg-gray-50" data-testid="select-location">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Jakarta">Jakarta</SelectItem>
                <SelectItem value="Bandung">Bandung</SelectItem>
                <SelectItem value="Surabaya">Surabaya</SelectItem>
                <SelectItem value="Medan">Medan</SelectItem>
                <SelectItem value="Semarang">Semarang</SelectItem>
              </SelectContent>
            </Select>

            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="bg-gray-50" data-testid="select-jobtype">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Fulltime</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="bg-gray-50" data-testid="select-industry">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Teknologi">Teknologi</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="F&B">F&B</SelectItem>
                <SelectItem value="Kesehatan">Kesehatan</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger className="bg-gray-50" data-testid="select-experience">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="0-1 tahun">0-1 years</SelectItem>
                <SelectItem value="1-3 tahun">1-3 years</SelectItem>
                <SelectItem value="3-5 tahun">3-5 years</SelectItem>
                <SelectItem value="5+ tahun">5+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Popular search:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-sm" data-testid="button-tag-developers">
                  Developers
                </Button>
                <Button variant="ghost" size="sm" className="text-sm" data-testid="button-tag-datamining">
                  Data mining
                </Button>
                <Button variant="ghost" size="sm" className="text-sm" data-testid="button-tag-designer">
                  Product designer
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-auto border-0 bg-transparent font-medium" data-testid="select-sortby">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="salary">Highest Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-blue-600 text-white hover:bg-blue-700" data-testid="button-search">
                Search
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.jobs.map((job, index) => {
              const icons = ["🍎", "🎨", "💼", "🚀", "💻", "📱", "🎯", "⚡", "🔧", "📊"];
              const jobIcon = icons[index % icons.length];

              const getJobTypeBadge = (type: string) => {
                const normalized = type.toLowerCase().replace(/\s+/g, '-');
                if (normalized === 'full-time' || type === 'Fulltime') return "Penuh Waktu";
                if (normalized === 'part-time') return "Paruh Waktu";
                if (normalized === 'contract') return "Kontrak";
                return "Freelance";
              };

              return (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
                  data-testid={`card-job-${index}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                      {jobIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2" data-testid={`text-title-${index}`}>
                        {job.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-1" data-testid={`text-location-${index}`}>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-1" data-testid={`text-company-${index}`}>{job.company.name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600" data-testid={`text-posted-${index}`}>
                        {formatDate(job.createdAt)}
                      </span>
                      <span className="ml-auto px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md" data-testid={`badge-type-${index}`}>
                        {getJobTypeBadge(job.jobType)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <span className="text-gray-600">
                      {job.industry || "General"}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="font-semibold text-gray-900" data-testid={`text-salary-${index}`}>
                      {job.salaryMin && job.salaryMax
                        ? `Rp ${formatSalary(job.salaryMin)}-${formatSalary(job.salaryMax)}`
                        : 'Gratis'}
                    </span>
                  </div>

                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-800 rounded-full font-medium" 
                    data-testid={`button-apply-${index}`}
                  >
                    Lamar Sekarang
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {data && data.jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
