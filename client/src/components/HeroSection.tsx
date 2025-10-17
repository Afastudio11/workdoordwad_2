import { Search } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { useLocation } from "wouter";
import cityscapeImg from "@assets/Cari Pekerjaan Kamu Disini,_1760685931944.png";
import starburstImg from "@assets/1_1760685924443.png";

const popularJobs = ["Sales Marketing", "Software Engineer", "Web Developer"];

export default function HeroSection() {
  const [keyword, setKeyword] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    setLocation(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative py-20 md:py-32 bg-black overflow-hidden">
      {/* Decorative starburst shapes */}
      <div className="absolute top-20 right-16 w-48 h-48 opacity-80">
        <img src={starburstImg} alt="" className="w-full h-full" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight" data-testid="hero-title">
            Wujudkan Pekerjaan Impianmu!<br />Cari di Sini Sekarang!
          </h1>

          <div className="max-w-2xl mx-auto mb-3">
            <div className="relative rounded-full p-2 flex items-center gap-3" style={{ backgroundColor: '#484946' }}>
              <input
                type="text"
                placeholder="Cari Pekerjaan Yang Kamu Inginkan"
                className="flex-1 px-6 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder:text-gray-400"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="input-keyword"
              />
              <button 
                onClick={handleSearch}
                className="p-3 bg-primary rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center"
                data-testid="button-search"
              >
                <Search className="h-6 w-6 text-black" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-gray-400 text-sm">Pekerjaan Populer Saat ini:</span>
            <div className="flex gap-2">
              {popularJobs.map((job, index) => (
                <span 
                  key={index}
                  className="px-4 py-1.5 text-white text-sm rounded-full hover:border-primary transition-colors cursor-pointer"
                  style={{ backgroundColor: '#484946' }}
                >
                  {job}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Image - Cityscape */}
        <div className="relative max-w-6xl mx-auto">
          {/* Ornamen starburst di kiri bawah gambar */}
          <div className="absolute -bottom-16 -left-20 w-48 h-48 opacity-80 z-10">
            <img src={starburstImg} alt="" className="w-full h-full" />
          </div>
          
          <div className="aspect-[21/9] rounded-3xl overflow-hidden">
            <img 
              src={cityscapeImg}
              alt="Cityscape" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
