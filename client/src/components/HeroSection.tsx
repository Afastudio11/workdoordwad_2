import { Search } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { useLocation } from "wouter";
import cityscapeImg from "@assets/Cari Pekerjaan Kamu Disini,(1)_1760686523490.png";
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
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight" data-testid="hero-title">
            Wujudkan Pekerjaan Impianmu!<br />Cari di Sini Sekarang!
          </h1>

          <div className="max-w-2xl mx-auto mb-5">
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
        <div className="relative max-w-7xl mx-auto mb-12">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden">
            <img 
              src={cityscapeImg}
              alt="Cityscape" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Corporate Clients - Auto Scrolling */}
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="flex items-center gap-8 md:gap-12 py-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-white font-semibold text-sm">Trusted By 1M+</span>
              <span className="text-white font-semibold text-sm">Business</span>
            </div>
            
            <div className="h-6 w-px bg-gray-600"></div>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex animate-marquee gap-8 md:gap-12">
                <div className="flex items-center gap-8 md:gap-12 shrink-0">
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                    </svg>
                    <span>Luminous</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    <span>Lightbox</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="3"/>
                      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>FocalPoint</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Polymath</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 12h8M13 12h8M3 6h18M3 18h18"/>
                    </svg>
                    <span>Alt+Shift</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span>Nice</span>
                  </div>
                </div>
                
                {/* Duplicate for seamless loop */}
                <div className="flex items-center gap-8 md:gap-12 shrink-0">
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                    </svg>
                    <span>Luminous</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    <span>Lightbox</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="3"/>
                      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>FocalPoint</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Polymath</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 12h8M13 12h8M3 6h18M3 18h18"/>
                    </svg>
                    <span>Alt+Shift</span>
                  </div>
                  
                  <div className="text-gray-400 font-medium text-lg flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span>Nice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
