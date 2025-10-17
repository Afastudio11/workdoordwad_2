import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Posting lowongan gratis tanpa batas",
  "Akses ribuan kandidat berkualitas",
  "AI aggregation dari Instagram",
  "Quick Apply untuk pelamar"
];

export default function CTASection() {
  const handleGetStarted = () => {
    console.log("Get started clicked");
  };

  return (
    <section className="py-24 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="cta-title">
            Siap Menemukan Talenta Terbaik atau Pekerjaan Impian?
          </h2>
          <p className="text-lg text-white/90 mb-8" data-testid="cta-subtitle">
            Bergabunglah dengan ribuan perusahaan dan pencari kerja yang sudah mempercayai Pintu Kerja
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-left" data-testid={`benefit-${index}`}>
                <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
                <span className="text-white/90">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 border-white"
              onClick={handleGetStarted}
              data-testid="button-mulai-sekarang"
            >
              Mulai Sekarang - Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20"
              data-testid="button-pelajari-lebih-lanjut"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
