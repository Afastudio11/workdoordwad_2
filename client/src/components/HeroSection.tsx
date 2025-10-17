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
    <section className="relative min-h-screen flex flex-col bg-black overflow-hidden py-6">
      {/* Decorative starburst shapes */}
      <div className="absolute top-16 left-8 md:left-16 w-24 h-24 md:w-40 md:h-40 opacity-80">
        <img src={starburstImg} alt="" className="w-full h-full" />
      </div>
      <div className="absolute top-24 right-8 md:right-20 w-32 h-32 md:w-56 md:h-56 opacity-80">
        <img src={starburstImg} alt="" className="w-full h-full" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 md:mb-12 tracking-tight leading-tight" data-testid="hero-title">
            Wujudkan Pekerjaan Impianmu!<br />Cari di Sini Sekarang!
          </h1>

          <div className="max-w-3xl mx-auto mb-6 md:mb-8">
            <div className="relative rounded-full p-2 md:p-3 flex items-center gap-3" style={{ backgroundColor: '#484946' }}>
              <input
                type="text"
                placeholder="Cari Pekerjaan Yang Kamu Inginkan"
                className="flex-1 px-6 md:px-8 py-4 md:py-5 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder:text-gray-400 text-base md:text-lg"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="input-keyword"
              />
              <button 
                onClick={handleSearch}
                className="p-4 md:p-5 bg-primary rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center"
                data-testid="button-search"
              >
                <Search className="h-6 w-6 md:h-7 md:w-7 text-black" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12">
            <span className="text-gray-400 text-sm md:text-base">Pekerjaan Populer Saat ini:</span>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {popularJobs.map((job, index) => (
                <span 
                  key={index}
                  className="px-5 md:px-6 py-2 md:py-2.5 text-white text-sm md:text-base rounded-full hover:border-primary transition-colors cursor-pointer"
                  style={{ backgroundColor: '#484946' }}
                >
                  {job}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Image - Cityscape */}
        <div className="relative w-full max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden" style={{ height: '280px' }}>
            <img 
              src={cityscapeImg}
              alt="Cityscape" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
