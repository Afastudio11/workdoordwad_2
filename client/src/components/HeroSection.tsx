import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import heroImage from "@assets/generated_images/Indonesian_diverse_workers_hero_image_c9226c11.png";

export default function HeroSection() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log("Search triggered:", { keyword, location });
  };

  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" data-testid="hero-title">
            Cari Kerja Lebih Cepat, Posting Lowongan Lebih Mudah
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8" data-testid="hero-subtitle">
            Platform rekrutmen dengan AI yang mengagregasi lowongan dari Instagram dan media sosial
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                <Input
                  placeholder="Cari posisi, perusahaan..."
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  data-testid="input-keyword"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                <Input
                  placeholder="Lokasi"
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  data-testid="input-location"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 border-white"
                onClick={handleSearch}
                data-testid="button-search"
              >
                <Search className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Cari</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20"
              data-testid="button-posting-gratis"
            >
              Posting Lowongan Gratis
            </Button>
          </div>

          <p className="text-sm text-white/80" data-testid="stats-text">
            50,000+ Lowongan Aktif • 10,000+ Perusahaan Terdaftar
          </p>
        </div>
      </div>
    </section>
  );
}
