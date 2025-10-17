const testimonials = [
  {
    name: "Budi Santoso",
    role: "Staff Gudang",
    company: "PT Logistics Indonesia",
    content: "Dapat pekerjaan dalam 3 hari. Quick Apply sangat memudahkan.",
    initials: "BS"
  },
  {
    name: "Siti Nurhaliza",
    role: "HR Manager",
    company: "CV Maju Bersama",
    content: "Sebagai UMKM, kami senang bisa posting lowongan gratis.",
    initials: "SN"
  },
  {
    name: "Ahmad Rifai",
    role: "Teknisi AC",
    company: "Freelancer",
    content: "Mobile-friendly, bisa cari lowongan dari mana saja.",
    initials: "AR"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="testimonials-title">
            Why teams love Qualery's Board Software
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Apa kata mereka yang sudah menggunakan platform kami
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{testimonial.initials}</span>
                </div>
                <div>
                  <div className="font-semibold text-white" data-testid={`testimonial-name-${index}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-400" data-testid={`testimonial-role-${index}`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed" data-testid={`testimonial-content-${index}`}>
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
