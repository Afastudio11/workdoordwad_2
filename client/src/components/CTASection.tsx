import { useState } from "react";

export default function CTASection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section className="py-24 bg-green-950 relative overflow-hidden">
      <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-primary/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-primary/20" />
      
      <div className="max-w-6xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6" data-testid="cta-title">
              Let's Contact
            </h2>
            <p className="text-lg text-white/80 mb-8 leading-relaxed" data-testid="cta-subtitle">
              Hubungi kami untuk informasi lebih lanjut atau bergabung dengan ribuan perusahaan dan pencari kerja di platform kami
            </p>
            <div className="space-y-4 text-white/70">
              <p>📧 info@pintukerja.com</p>
              <p>📱 +62 812-3456-7890</p>
              <p>📍 Jakarta, Indonesia</p>
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder:text-gray-400"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama kamu"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder:text-gray-400"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Pesan
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-white placeholder:text-gray-400"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tulis pesan kamu..."
                />
              </div>
              <button 
                type="submit"
                className="w-full px-8 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="button-mulai-sekarang"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
