import { Building2, MapPin, Clock } from "lucide-react";

const jobCirculars = [
  {
    company: "Tech Startup",
    position: "Frontend Developer",
    location: "Jakarta",
    type: "Full-time",
    logo: "TS"
  },
  {
    company: "Digital Agency",
    position: "UI/UX Designer",
    location: "Bandung",
    type: "Full-time",
    logo: "DA"
  },
  {
    company: "E-commerce",
    position: "Backend Developer",
    location: "Surabaya",
    type: "Remote",
    logo: "EC"
  },
  {
    company: "Fintech",
    position: "Product Manager",
    location: "Jakarta",
    type: "Full-time",
    logo: "FT"
  }
];

export default function JobCircularsSection() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Job Circulars
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Temukan lowongan kerja terbaik dari berbagai perusahaan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobCirculars.map((job, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center font-bold text-white">
                  {job.logo}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                {job.position}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Building2 className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            Lihat Semua Lowongan
          </button>
        </div>
      </div>
    </section>
  );
}
