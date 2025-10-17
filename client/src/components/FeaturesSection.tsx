import { Clock, Sparkles, DollarSign, Smartphone } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Quick Apply",
    description: "Lamar pekerjaan dalam hitungan detik dengan CV yang sudah tersimpan"
  },
  {
    icon: Sparkles,
    title: "Agregasi AI",
    description: "AI mengumpulkan lowongan dari Instagram, diverifikasi tim editor"
  },
  {
    icon: DollarSign,
    title: "Gratis Selamanya",
    description: "Posting lowongan tanpa biaya untuk UMKM Indonesia"
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Akses lowongan dari mana saja, kapan saja"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get things Done with Minimal Effort
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Platform yang dirancang untuk mempermudah proses rekrutmen dan pencarian kerja
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex gap-4"
              data-testid={`feature-card-${index}`}
            >
              <div className="flex-shrink-0">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2" data-testid={`feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed" data-testid={`feature-description-${index}`}>
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
