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
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4" data-testid="testimonials-title">
            Apa Kata Mereka
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-md p-8"
              data-testid={`testimonial-${index}`}
            >
              <p className="text-lg text-gray-900 mb-6 leading-relaxed" data-testid={`testimonial-content-${index}`}>
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">{testimonial.initials}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900" data-testid={`testimonial-name-${index}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600" data-testid={`testimonial-role-${index}`}>
                    {testimonial.role}
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
