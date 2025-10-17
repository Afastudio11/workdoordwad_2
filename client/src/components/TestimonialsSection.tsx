import { Calendar, CreditCard } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section className="relative py-32 bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 overflow-hidden">
      {/* Floating Icons/Badges */}
      <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-90">
        <span className="text-2xl">🌐</span>
      </div>
      
      <div className="absolute top-40 left-32 w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center opacity-80">
        <span className="text-3xl">🎨</span>
      </div>
      
      <div className="absolute bottom-32 left-20 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center opacity-90">
        <span className="text-2xl">💬</span>
      </div>
      
      <div className="absolute top-1/2 right-32 px-6 py-3 bg-transparent border-2 border-primary rounded-full">
        <span className="text-primary font-semibold">PHP Developer</span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight" data-testid="cta-title">
          Siap Mengorganisir<br />Rekrutmen Anda?
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5" />
            <span>Gratis trial 15 hari</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5" />
            <span>Tanpa kartu kredit</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
    </section>
  );
}
