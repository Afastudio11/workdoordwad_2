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
      <div className="bg-background text-foreground pb-8 border-b border-border">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Designer"
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>

            <button className="p-3 bg-card border border-border rounded-xl hover:bg-secondary transition-colors">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </button>

            <button className="p-3 bg-card border border-border rounded-xl hover:bg-secondary transition-colors">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-orange-400 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Dapatkan
                <br />
                profesi terbaikmu
                <br />
                dengan PintuKerja
              </h2>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
                Pelajari Lebih Lanjut
              </button>
            </div>

            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Pekerjaan Populer</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Urutkan:</span>
                <select 
                  className="text-sm border-none bg-transparent font-medium text-black focus:outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="last_updated">Terakhir diperbarui</option>
                  <option value="salary_high">Gaji tertinggi</option>
                  <option value="salary_low">Gaji terendah</option>
                  <option value="most_recent">Terbaru</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {data?.jobs.slice(0, 6).map((job, index) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  date={formatDate(job.createdAt)}
                  company={job.company.name}
                  title={job.title}
                  tags={[job.jobType, job.location, job.industry || "General"].slice(0, 3)}
                  salary={
                    job.salaryMin && job.salaryMax
                      ? `$${job.salaryMin}/jam - $${job.salaryMax}/jam`
                      : "Kompetitif"
                  }
                  location={job.location}
                  bgColor={getJobCardColor(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
