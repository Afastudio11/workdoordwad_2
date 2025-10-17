import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/generated_images/Indonesian_diverse_workers_hero_image_c9226c11.png";

export default function HeroSection() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log("Search triggered:", { keyword, location });
  };

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight" data-testid="hero-title">
            Cari Kerja. Posting Lowongan. Sederhana.
          </h1>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed" data-testid="hero-subtitle">
            Platform rekrutmen untuk UMKM dan pencari kerja Indonesia
          </p>

          <div className="bg-white rounded-md border border-gray-300 p-3 mb-6 max-w-2xl mx-auto shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari posisi atau perusahaan"
                  className="w-full pl-10 pr-4 py-3 border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-500"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  data-testid="input-keyword"
                />
              </div>
              <div className="hidden md:block w-px bg-gray-200" />
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Lokasi"
                  className="w-full pl-10 pr-4 py-3 border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  data-testid="input-location"
                />
              </div>
              <button 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleSearch}
                data-testid="button-search"
              >
                Cari
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500" data-testid="stats-text">
            15,000+ Lowongan Aktif
          </p>
        </div>
      </div>
    </section>
  );
}
