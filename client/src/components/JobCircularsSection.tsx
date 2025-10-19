import { MapPin, Clock, Search, Briefcase, DollarSign } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const jobCirculars = [
  {
    company: "Apple Inc.",
    position: "Desainer Antarmuka Senior",
    location: "Jakarta, Indonesia",
    type: "Waktu Penuh",
    category: "Pengembangan Web",
    salary: "Rp 8-10 juta",
    postedTime: "5 Jam yang Lalu",
    logo: "🍎"
  },
  {
    company: "Fiverr",
    position: "Pengembang PHP",
    location: "Bandung, Indonesia",
    type: "Waktu Penuh",
    category: "Desain Grafis",
    salary: "Rp 7-9 juta",
    postedTime: "5 Jam yang Lalu",
    logo: "🎯"
  },
  {
    company: "Behance",
    position: "Insinyur Perangkat Lunak Senior",
    location: "Surabaya, Indonesia",
    type: "Waktu Penuh",
    category: "Rekayasa Perangkat Lunak",
    salary: "Rp 10-15 juta",
    postedTime: "5 Jam yang Lalu",
    logo: "🔷"
  },
  {
    company: "Apple Inc.",
    position: "Peneliti Pengalaman Pengguna",
    location: "Jakarta, Indonesia",
    type: "Waktu Penuh",
    category: "Pengembangan Web",
    salary: "Rp 9-12 juta",
    postedTime: "5 Jam yang Lalu",
    logo: "🍎"
  },
  {
    company: "Apple Inc.",
    position: "Manajer Proyek",
    location: "Jakarta, Indonesia",
    type: "Waktu Penuh",
    category: "Pengembangan Web",
    salary: "Rp 12-18 juta",
    postedTime: "5 Jam yang Lalu",
    logo: "🍎"
  },
  {
    company: "Behance",
    position: "Desainer Produk",
    location: "Yogyakarta, Indonesia",
    type: "Waktu Penuh",
    category: "Desain Produk",
    salary: "Rp 7-10 juta",
    postedTime: "5 Jam yang Lalu",
    logo: "🔷"
  }
];

const categories = ["Desainer", "Pengembang Web", "Insinyur Perangkat Lunak", "Dokter", "Pemasaran"];

export default function JobCircularsSection() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Pengembangan Web");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (category) params.append("category", category);
    setLocation(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
  };

  const filteredJobs = activeCategory
    ? jobCirculars.filter(job => 
        job.position.toLowerCase().includes(activeCategory.toLowerCase()) ||
        job.category.toLowerCase().includes(activeCategory.toLowerCase())
      )
    : jobCirculars;

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
              <select 
                className="px-4 py-2.5 bg-transparent text-black text-sm border-l border-gray-200 focus:outline-none cursor-pointer"
                data-testid="select-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Pengembangan Web</option>
                <option>Desain</option>
                <option>Pemasaran</option>
              </select>
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
                  ? 'bg-black text-white' 
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
                    ? 'bg-black text-white' 
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
              data-testid={`job-card-${index}`}
            >
              {/* Position and Location */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-black mb-2">
                  {job.position}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{job.location}</span>
                </div>
              </div>
              
              {/* Company */}
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">{job.logo}</div>
                <span className="text-sm font-medium text-black">{job.company}</span>
              </div>

              {/* Time and Type */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{job.postedTime}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{job.type}</span>
                </div>
              </div>

              {/* Category and Salary */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{job.category}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>{job.salary}</span>
                </div>
              </div>

              {/* Apply Button */}
              <Link 
                href="/register"
                className="block w-full py-2.5 bg-black text-white font-medium text-sm rounded-md hover:bg-gray-800 transition-colors text-center"
                data-testid={`button-apply-${index}`}
              >
                Lamar Sekarang
              </Link>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Link 
            href="/jobs"
            className="inline-block w-full md:w-auto px-16 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
            data-testid="button-load-more"
          >
            Lihat Lebih Banyak
          </Link>
        </div>
      </div>
    </section>
  );
}
