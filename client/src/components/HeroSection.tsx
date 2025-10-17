import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Indonesian_diverse_workers_hero_image_c9226c11.png";

export default function HeroSection() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [, setLocation2] = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    setLocation2(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative py-20 md:py-32 bg-black overflow-hidden">
      <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-primary" />
      <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full bg-primary/30" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight" data-testid="hero-title">
              Build & Ship a job Board Fast with Qualery
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed" data-testid="hero-subtitle">
              Platform rekrutmen untuk UMKM dan pencari kerja Indonesia
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 mb-6 max-w-xl shadow-xl">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari posisi atau perusahaan"
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder:text-gray-400"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    data-testid="input-keyword"
                  />
                </div>
                <button 
                  className="px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors"
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

          <div className="relative">
            <div className="aspect-square bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <img 
                src={heroImage} 
                alt="Hero" 
                className="w-full h-full object-cover rounded-xl grayscale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
