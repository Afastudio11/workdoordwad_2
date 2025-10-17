import { Building2, MapPin, Clock, Search } from "lucide-react";

const jobCirculars = [
  {
    company: "Apple Inc.",
    position: "Sr. User Interface",
    location: "Jakarta, Indonesia",
    type: "Penuh Waktu",
    category: "Pengembangan Web",
    salary: "Rp 8jt-Rp 12jt",
    postedTime: "5 Jam Lalu",
    logo: "🍎"
  },
  {
    company: "Fiverr",
    position: "PHP Developer",
    location: "Bandung, Indonesia",
    type: "Penuh Waktu",
    category: "Grafis",
    salary: "Rp 10jt-Rp 15jt",
    postedTime: "5 Jam Lalu",
    logo: "🎯"
  },
  {
    company: "Behance",
    position: "Sr. Software Engineer",
    location: "Surabaya, Indonesia",
    type: "Penuh Waktu",
    category: "Teknologi",
    salary: "Rp 12jt-Rp 18jt",
    postedTime: "5 Jam Lalu",
    logo: "🎨"
  },
  {
    company: "Apple Inc.",
    position: "UX Researcher",
    location: "Jakarta, Indonesia",
    type: "Penuh Waktu",
    category: "Pengembangan Web",
    salary: "Rp 9jt-Rp 14jt",
    postedTime: "5 Jam Lalu",
    logo: "🍎"
  },
  {
    company: "Apple Inc.",
    position: "Project Manager",
    location: "Jakarta, Indonesia",
    type: "Penuh Waktu",
    category: "Pengembangan Web",
    salary: "Rp 15jt-Rp 25jt",
    postedTime: "5 Jam Lalu",
    logo: "🍎"
  },
  {
    company: "Behance",
    position: "Products Designer",
    location: "Yogyakarta, Indonesia",
    type: "Penuh Waktu",
    category: "Desain",
    salary: "Rp 8jt-Rp 13jt",
    postedTime: "5 Jam Lalu",
    logo: "🎨"
  }
];

const categories = ["Desainer", "Pengembang Web", "Software Engineer", "Dokter", "Marketing"];

export default function JobCircularsSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
            Lowongan Kerja Unggulan
          </h2>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari kebutuhan Anda" 
                className="w-full pl-12 pr-4 py-3 md:py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-search"
              />
            </div>
            <select 
              className="px-4 md:px-6 py-3 md:py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="select-category"
            >
              <option>Pengembangan Web</option>
              <option>Desain</option>
              <option>Marketing</option>
            </select>
            <button 
              className="px-8 py-3 md:py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Popular Categories */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Kategori Populer:</span>
            {categories.map((cat, index) => (
              <button 
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 1 
                    ? 'bg-black dark:bg-white text-white dark:text-black' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                data-testid={`button-category-${index}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobCirculars.map((job, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              data-testid={`job-card-${index}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{job.logo}</div>
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                      {job.position}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <Building2 className="h-4 w-4" />
                <span>{job.company}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {job.postedTime}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                  {job.type}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm mb-4">
                <span className="text-gray-500 dark:text-gray-400">{job.category}</span>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="font-semibold text-black dark:text-white">{job.salary}</span>
              </div>

              <button 
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                data-testid={`button-apply-${index}`}
              >
                Lamar Sekarang
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            className="w-full md:w-auto px-12 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors"
            data-testid="button-load-more"
          >
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </section>
  );
}
