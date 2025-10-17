import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Staff Gudang",
    company: "PT Logistics Indonesia",
    content: "Saya dapat pekerjaan dalam 3 hari! Quick Apply sangat memudahkan, tidak perlu isi formulir berkali-kali.",
    initials: "BS",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    name: "Siti Nurhaliza",
    role: "HR Manager",
    company: "CV Maju Bersama",
    content: "Sebagai UMKM, kami senang bisa posting lowongan gratis. Fitur AI aggregation juga membantu kami menemukan kandidat dari berbagai sumber.",
    initials: "SN",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Ahmad Rifai",
    role: "Teknisi AC",
    company: "Freelancer",
    content: "Platform-nya mobile-friendly, jadi bisa cari lowongan sambil jalan. Notifikasinya juga cepat, lowongan baru langsung muncul.",
    initials: "AR",
    gradient: "from-green-500 to-emerald-500"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="testimonials-title">
            Apa Kata Mereka
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="testimonials-subtitle">
            Pengalaman nyata dari pencari kerja dan perekrut
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-card border border-card-border rounded-lg p-6 hover-elevate"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-chart-3 text-chart-3" />
                ))}
              </div>
              <p className="text-foreground mb-6 italic" data-testid={`testimonial-content-${index}`}>
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className={`bg-gradient-to-br ${testimonial.gradient} text-white font-semibold`}>
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground" data-testid={`testimonial-name-${index}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`testimonial-role-${index}`}>
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
