import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Settings, Bell, User, Bookmark, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  };
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

const jobCardColors = [
  "bg-blue-50 border-blue-100",
  "bg-pink-50 border-pink-100",
  "bg-orange-50 border-orange-100",
  "bg-cyan-50 border-cyan-100",
  "bg-purple-50 border-purple-100",
  "bg-green-50 border-green-100",
];

export default function JobDashboardPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("Jakarta");
  const [salaryRange, setSalaryRange] = useState([1200000, 50000000]);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);

  const { data, isLoading } = useQuery<JobsResponse>({
    queryKey: ["/api/jobs", { keyword: searchKeyword, location: searchLocation }],
  });

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp${(amount / 1000000).toFixed(1)}jt`;
    }
    return `Rp${(amount / 1000).toFixed(0)}rb`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const toggleFilter = (value: string, selected: string[], setter: (arr: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(item => item !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const getCompanyLogo = (companyName: string) => {
    const logos: { [key: string]: string } = {
      'Google': 'https://www.google.com/favicon.ico',
      'Microsoft': 'https://www.microsoft.com/favicon.ico',
      'Amazon': 'https://www.amazon.com/favicon.ico',
      'IBM': 'https://www.ibm.com/favicon.ico',
      'Salesforce': 'https://www.salesforce.com/favicon.ico',
      'Facebook': 'https://www.facebook.com/favicon.ico',
    };
    return logos[companyName] || null;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="w-full px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <img src={logoImgDark} alt="Pintu Kerja" className="h-8" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/jobs" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors" data-testid="link-findjob">
                Find job
              </Link>
              <Link href="/messages" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-messages">
                Messages
              </Link>
              <Link href="/hiring" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-hiring">
                Hiring
              </Link>
              <Link href="/community" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-community">
                Community
              </Link>
              <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-faq">
                FAQ
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900" data-testid="button-settings">
                <Settings className="h-5 w-5" />
              </button>
              <button className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center" data-testid="button-profile">
                <User className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                  <button className="text-sm text-gray-900 hover:underline" data-testid="button-clear-filters">
                    Clear
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Working schedule</h4>
                  <div className="space-y-2">
                    {['Full time', 'Part time', 'Internship', 'Project work', 'Volunteering'].map((schedule) => (
                      <div key={schedule} className="flex items-center space-x-2">
                        <Checkbox
                          id={`schedule-${schedule}`}
                          checked={selectedSchedules.includes(schedule)}
                          onCheckedChange={() => toggleFilter(schedule, selectedSchedules, setSelectedSchedules)}
                          data-testid={`checkbox-schedule-${schedule.toLowerCase().replace(' ', '-')}`}
                        />
                        <Label
                          htmlFor={`schedule-${schedule}`}
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          {schedule}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Employment type</h4>
                  <div className="space-y-2">
                    {['Full day', 'Flexible schedule', 'Shift work', 'Distant work'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                          data-testid={`checkbox-type-${type.toLowerCase().replace(' ', '-')}`}
                        />
                        <Label
                          htmlFor={`type-${type}`}
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Shift method</h4>
                  <div className="space-y-2">
                    {['Distant work', 'Shift work'].map((shift) => (
                      <div key={shift} className="flex items-center space-x-2">
                        <Checkbox
                          id={`shift-${shift}`}
                          checked={selectedShifts.includes(shift)}
                          onCheckedChange={() => toggleFilter(shift, selectedShifts, setSelectedShifts)}
                          data-testid={`checkbox-shift-${shift.toLowerCase().replace(' ', '-')}`}
                        />
                        <Label
                          htmlFor={`shift-${shift}`}
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          {shift}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Designer"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  data-testid="input-search"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors" data-testid="button-filter-location">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors" data-testid="button-filter-date">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors" data-testid="button-filter-time">
                  <Clock className="h-5 w-5 text-gray-600" />
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">{searchLocation}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Salary range</span>
                  <span className="text-sm font-semibold text-gray-900" data-testid="text-salary-range">
                    {formatSalary(salaryRange[0])} - {formatSalary(salaryRange[1])}
                  </span>
                </div>
                <Slider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  min={1200000}
                  max={50000000}
                  step={100000}
                  className="mt-2"
                  data-testid="slider-salary"
                />
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Popular jobs</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="text-sm font-medium text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer" data-testid="select-sort">
                  <option value="updated">Last updated</option>
                  <option value="salary">Highest salary</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.jobs.slice(0, 6).map((job, index) => {
                  const colorClass = jobCardColors[index % jobCardColors.length];
                  const logo = getCompanyLogo(job.company.name);

                  return (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className={`block border rounded-lg p-6 hover:shadow-lg transition-all ${colorClass}`}
                      data-testid={`card-job-${index}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-xs text-gray-600" data-testid={`text-date-${index}`}>
                          {formatDate(job.createdAt)}
                        </div>
                        <button className="text-gray-600 hover:text-gray-900" data-testid={`button-bookmark-${index}`}>
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {logo ? (
                          <img src={logo} alt={job.company.name} className="h-10 w-10 rounded-lg" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600">{job.company.name.substring(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate" data-testid={`text-company-${index}`}>
                            {job.company.name}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 truncate" data-testid={`text-title-${index}`}>
                            {job.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 text-xs font-medium bg-white/50 rounded-full" data-testid={`badge-type-${index}`}>
                          {job.jobType}
                        </span>
                        {job.experience && (
                          <span className="px-3 py-1 text-xs font-medium bg-white/50 rounded-full">
                            {job.experience}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-base font-semibold text-gray-900" data-testid={`text-salary-${index}`}>
                          {job.salaryMin && job.salaryMax
                            ? `${formatSalary(job.salaryMin)}/hr`
                            : 'Competitive'}
                        </div>
                        <div className="text-xs text-gray-600" data-testid={`text-location-${index}`}>
                          {job.location}
                        </div>
                      </div>

                      <Button className="w-full mt-4" variant="outline" data-testid={`button-details-${index}`}>
                        Details
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}

            {data && data.jobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No jobs found</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
