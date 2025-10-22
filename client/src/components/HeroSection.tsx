import { Search } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import cityscapeImg from "@assets/Cari Pekerjaan Kamu Disini,(1)_1760686523490.png";
import starburstImg from "@assets/0d231d(1)_1760687086089.png";

export default function HeroSection() {
  const [keyword, setKeyword] = useState("");
  const [, setLocation] = useLocation();
  
  const { data: trendingData } = useQuery<{ jobs: any[]; total: number }>({
    queryKey: ["/api/jobs/trending"],
  });
  
  const hasJobs = (trendingData?.total || 0) > 0;
  
  const popularJobs = hasJobs 
    ? Array.from(new Set(
        trendingData?.jobs
          ?.slice(0, 3)
          .map((job) => job.title || job.industry)
          .filter(Boolean) || []
      )).slice(0, 3)
    : [];

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

  const handleJobTagClick = (job: string) => {
    const params = new URLSearchParams();
    params.append("keyword", job);
    setLocation(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative py-16 md:py-32 bg-black overflow-hidden">
      {/* Decorative starburst shapes - hidden on mobile */}
      <div className="hidden md:block absolute top-20 right-16 w-48 h-48">
        <img src={starburstImg} alt="" className="w-full h-full" />
      </div>
      
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="text-center mb-4">
          <h1 className="heading-1 text-white mb-6 md:mb-8" data-testid="hero-title">
            Wujudkan Pekerjaan Impianmu!<br />Cari di Sini Sekarang!
          </h1>

          <div className="max-w-2xl mx-auto mb-5">
            <div className="relative rounded-full p-1.5 md:p-2 flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm">
              <input
                type="text"
                placeholder="Cari Pekerjaan..."
                className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder:text-white/60 text-sm md:text-base"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="input-keyword"
              />
              <button 
                onClick={handleSearch}
                className="p-2.5 md:p-3 bg-primary rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center shrink-0"
                data-testid="button-search"
              >
                <Search className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
              </button>
            </div>
          </div>

          {hasJobs && popularJobs.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-4">
              <span className="text-white/60 text-xs md:text-sm">Pekerjaan Populer Saat ini:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {popularJobs.map((job, index) => (
                  <button 
                    key={index}
                    onClick={() => handleJobTagClick(job)}
                    className="px-3 md:px-4 py-1.5 text-white text-xs md:text-sm rounded-full hover:border-primary hover:border transition-colors cursor-pointer bg-white/10 backdrop-blur-sm"
                    data-testid={`tag-job-${index}`}
                  >
                    {job}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hero Image - Cityscape */}
        <div className="relative max-w-[1600px] mx-auto mb-8 md:mb-12">
          <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden">
            <img 
              src={cityscapeImg}
              alt="Cityscape" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Corporate Clients - Auto Scrolling */}
        <div className="max-w-[1600px] mx-auto overflow-hidden">
          <div className="flex items-center gap-4 md:gap-12 py-4">
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
              <span className="text-white font-semibold text-xs md:text-sm">Dipercaya Oleh 1 Juta+</span>
              <span className="text-white font-semibold text-xs md:text-sm">Bisnis</span>
            </div>
            
            <div className="h-4 md:h-6 w-px bg-white/20"></div>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex animate-marquee gap-4 md:gap-12">
                <div className="flex items-center gap-4 md:gap-12 shrink-0">
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                    </svg>
                    <span>Luminous</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    <span>Lightbox</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="3"/>
                      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>FocalPoint</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Polymath</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 12h8M13 12h8M3 6h18M3 18h18"/>
                    </svg>
                    <span>Alt+Shift</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span>Nice</span>
                  </div>
                </div>
                
                {/* Duplicate for seamless loop */}
                <div className="flex items-center gap-4 md:gap-12 shrink-0">
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                    </svg>
                    <span>Luminous</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                    <span>Lightbox</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="3"/>
                      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>FocalPoint</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Polymath</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 12h8M13 12h8M3 6h18M3 18h18"/>
                    </svg>
                    <span>Alt+Shift</span>
                  </div>
                  
                  <div className="text-white/60 font-medium text-sm md:text-lg flex items-center gap-1 md:gap-2">
                    <svg className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor">
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
