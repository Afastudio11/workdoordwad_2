import { Clock, Sparkles, DollarSign, Smartphone } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Quick Apply",
    description: "Lamar pekerjaan dalam hitungan detik dengan CV yang sudah tersimpan. Tidak perlu mengisi formulir berulang kali."
  },
  {
    icon: Sparkles,
    title: "AI Social Media Aggregation",
    description: "Teknologi AI kami mengumpulkan lowongan dari Instagram dan media sosial, diverifikasi oleh tim editor."
  },
  {
    icon: DollarSign,
    title: "Posting Gratis",
    description: "Posting lowongan kerja tanpa biaya. Tingkatkan visibilitas dengan fitur Booster dan Bump yang terjangkau."
  },
  {
    icon: Smartphone,
    title: "Multi-Platform",
    description: "Akses lowongan dari berbagai sumber dalam satu platform. Mobile-friendly untuk pencari kerja di mana saja."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="features-title">
            Kenapa Pintu Kerja?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="features-subtitle">
            Platform rekrutmen modern yang memudahkan pencari kerja dan perekrut
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex gap-4 p-6 rounded-lg bg-card border border-card-border hover-elevate"
              data-testid={`feature-card-${index}`}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
