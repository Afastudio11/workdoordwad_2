import { Calendar, CreditCard } from "lucide-react";
import recruitmentImg from "@assets/0d231d(4)_1760693392965.png";

export default function TestimonialsSection() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight" data-testid="cta-title">
              Siap Mengorganisir<br />Rekrutmen Anda?
            </h2>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5" />
                <span>Gratis trial 15 hari</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5" />
                <span>Tanpa kartu kredit</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button 
                className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-full hover:bg-gray-700 transition-colors min-w-[200px]"
                data-testid="button-start-trial"
              >
                Mulai Trial Gratis
              </button>
              <button 
                className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors min-w-[200px]"
                data-testid="button-get-demo"
              >
                Dapatkan Demo
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative max-w-lg w-full">
              <img 
                src={recruitmentImg}
                alt="Recruitment" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
