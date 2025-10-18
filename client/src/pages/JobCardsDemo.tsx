import JobCard from "@/components/JobCard";
import DashboardHeader from "@/components/DashboardHeader";

const mockJobs = [
  {
    id: "1",
    title: "Sr. User Interface",
    location: "Jakarta, Indonesia",
    company: "Apple Inc.",
    date: "5 Jam Lalu",
    tags: ["Pengembangan Web"],
    salary: "Rp 8jt-Rp 12jt",
    icon: "🍎",
    jobType: "Penuh Waktu"
  },
  {
    id: "2",
    title: "PHP Developer",
    location: "Bandung, Indonesia",
    company: "Fiverr",
    date: "5 Jam Lalu",
    tags: ["Grafis"],
    salary: "Rp 10jt-Rp 15jt",
    icon: "🎯",
    jobType: "Penuh Waktu"
  },
  {
    id: "3",
    title: "Sr. Software Engineer",
    location: "Surabaya, Indonesia",
    company: "Behance",
    date: "5 Jam Lalu",
    tags: ["Teknologi"],
    salary: "Rp 12jt-Rp 18jt",
    icon: "💼",
    jobType: "Penuh Waktu"
  },
  {
    id: "4",
    title: "UX Researcher",
    location: "Jakarta, Indonesia",
    company: "Apple Inc.",
    date: "5 Jam Lalu",
    tags: ["Pengembangan Web"],
    salary: "Rp 9jt-Rp 14jt",
    icon: "🎨",
    jobType: "Penuh Waktu"
  },
  {
    id: "5",
    title: "Project Manager",
    location: "Jakarta, Indonesia",
    company: "Apple Inc.",
    date: "5 Jam Lalu",
    tags: ["Pengembangan Web"],
    salary: "Rp 15jt-Rp 25jt",
    icon: "💻",
    jobType: "Penuh Waktu"
  },
  {
    id: "6",
    title: "Products Designer",
    location: "Yogyakarta, Indonesia",
    company: "Behance",
    date: "5 Jam Lalu",
    tags: ["Desain"],
    salary: "Rp 9jt-Rp 13jt",
    icon: "🚀",
    jobType: "Penuh Waktu"
  }
];

export default function JobCardsDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Lowongan Pekerjaan Terbaru</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              location={job.location}
              company={job.company}
              date={job.date}
              tags={job.tags}
              salary={job.salary}
              icon={job.icon}
              jobType={job.jobType}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
