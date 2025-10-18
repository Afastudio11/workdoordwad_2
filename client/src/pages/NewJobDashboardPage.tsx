import { useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import JobCard from "@/components/JobCard";
import FilterSidebar, { type FilterState } from "@/components/FilterSidebar";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/DashboardHeader";

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

export default function NewJobDashboardPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [salaryRange, setSalaryRange] = useState([2000000, 20000000]);
  const [filters, setFilters] = useState<FilterState>({
    workingSchedule: [],
    employmentType: [],
  });
  const [sortBy, setSortBy] = useState("last_updated");

  const { data, isLoading, error } = useQuery<JobsResponse>({
    queryKey: ["/api/jobs", { 
      keyword: searchKeyword,
      salaryMin: salaryRange[0],
      salaryMax: salaryRange[1],
      jobType: filters.workingSchedule.join(","),
      sortBy 
    }],
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const getJobCardColor = (index: number) => {
    const colors = [
      "bg-blue-100",
      "bg-pink-100",
      "bg-orange-100",
      "bg-gray-100",
      "bg-cyan-100",
      "bg-indigo-100",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      {/* Search Section */}
      <div className="bg-background text-foreground pb-6 md:pb-8 border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 pt-4 md:pt-6">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari pekerjaan..."
                className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                data-testid="input-search-jobs"
              />
            </div>

            <button 
              className="p-2.5 md:p-3 bg-card border border-border rounded-xl hover:bg-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              data-testid="button-filter-location"
              aria-label="Filter lokasi"
            >
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            </button>

            <button 
              className="p-2.5 md:p-3 bg-card border border-border rounded-xl hover:bg-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              data-testid="button-filter-type"
              aria-label="Filter jenis pekerjaan"
            >
              <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            </button>

            <div className="hidden lg:flex items-center gap-3 ml-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Rentang Gaji</span>
              <div className="w-48">
                <Slider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  min={1000000}
                  max={25000000}
                  step={500000}
                  className="cursor-pointer"
                />
              </div>
              <span className="text-sm font-medium whitespace-nowrap">
                Rp{(salaryRange[0]/1000000).toFixed(1)}-{(salaryRange[1]/1000000).toFixed(1)}jt
              </span>
            </div>
          </div>

          {/* Mobile Salary Range */}
          <div className="lg:hidden mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Rentang Gaji</span>
              <span className="text-xs sm:text-sm font-medium">
                Rp{(salaryRange[0]/1000000).toFixed(1)}-{(salaryRange[1]/1000000).toFixed(1)}jt
              </span>
            </div>
            <Slider
              value={salaryRange}
              onValueChange={setSalaryRange}
              min={1000000}
              max={25000000}
              step={500000}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-9">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-black">Pekerjaan Populer</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Urutkan:</span>
                <select 
                  className="text-xs sm:text-sm border border-border rounded-lg px-2 py-1 bg-card font-medium text-black focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  data-testid="select-sort"
                >
                  <option value="last_updated">Terakhir diperbarui</option>
                  <option value="salary_high">Gaji tertinggi</option>
                  <option value="salary_low">Gaji terendah</option>
                  <option value="most_recent">Terbaru</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {data?.jobs.slice(0, 6).map((job, index) => {
                const formatSalary = (min: number | null, max: number | null) => {
                  if (!min || !max) return "Kompetitif";
                  const minJuta = (min / 1000000).toFixed(1);
                  const maxJuta = (max / 1000000).toFixed(1);
                  return `Rp${minJuta}-${maxJuta}jt/bln`;
                };
                
                return (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    date={formatDate(job.createdAt)}
                    company={job.company.name}
                    title={job.title}
                    tags={[job.jobType, job.location, job.industry || "General"].slice(0, 3)}
                    salary={formatSalary(job.salaryMin, job.salaryMax)}
                    location={job.location}
                    bgColor={getJobCardColor(index)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
