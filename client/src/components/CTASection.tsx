export default function CTASection() {
  const handleGetStarted = () => {
    console.log("Get started clicked");
  };

  return (
    <section className="py-24 bg-blue-600">
      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4" data-testid="cta-title">
          Siap Memulai?
        </h2>
        <p className="text-lg text-white/90 mb-8 leading-relaxed" data-testid="cta-subtitle">
          Bergabunglah dengan ribuan perusahaan dan pencari kerja di Pintu Kerja
        </p>

        <button 
          className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-50 transition-colors"
          onClick={handleGetStarted}
          data-testid="button-mulai-sekarang"
        >
          Mulai Gratis
        </button>
      </div>
    </section>
  );
}
