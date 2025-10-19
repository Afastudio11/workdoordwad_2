import { Calendar, CreditCard } from "lucide-react";
import recruitmentImg from "@assets/0d231d(6)_1760871652852.png";

export default function TestimonialsSection() {
  return (
    <section className="relative py-8 md:py-12 lg:py-16 bg-lime-400 overflow-hidden">
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-left w-full">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 md:mb-8 leading-tight" data-testid="cta-title">
              Siap Mengorganisir<br />Rekrutmen Anda?
            </h2>

            <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="flex items-center gap-2 text-black text-sm md:text-base">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span>Gratis trial 15 hari</span>
              </div>
              <div className="flex items-center gap-2 text-black text-sm md:text-base">
                <CreditCard className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span>Tanpa kartu kredit</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 md:gap-4">
              <button 
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-black text-lime-400 text-sm md:text-base font-semibold rounded-full hover:opacity-90 transition-colors sm:min-w-[180px] md:min-w-[200px]"
                data-testid="button-start-trial"
              >
                Mulai Trial Gratis
              </button>
              <button 
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black text-sm md:text-base font-semibold rounded-full hover:bg-white/90 transition-colors sm:min-w-[180px] md:min-w-[200px]"
                data-testid="button-get-demo"
              >
                Dapatkan Demo
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center w-full">
            <div className="relative max-w-md w-full">
              <img 
                src={recruitmentImg}
                alt="Recruitment" 
                className="w-full h-auto max-h-64 md:max-h-80 lg:max-h-96 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
