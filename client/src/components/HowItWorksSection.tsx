import starburstImg from "@assets/0d231d(1)_1760687086089.png";
import cardImg from "@assets/b5000e60-d453-4e7f-9f37-bda9504555b7_1760687707154.png";

const steps = [
  {
    number: "1",
    title: "Buat Akun",
    description: "Daftar gratis dan buat profil profesional Anda. Lengkapi dengan CV, foto, dan portofolio untuk meningkatkan peluang ditemukan oleh perekrut terbaik."
  },
  {
    number: "2",
    title: "Lengkapi Profil Anda",
    description: "Tambahkan pengalaman kerja, pendidikan, dan keahlian Anda untuk mendapatkan rekomendasi pekerjaan yang lebih relevan."
  },
  {
    number: "3",
    title: "Lamar Pekerjaan atau Rekrut",
    description: "Cari dan lamar pekerjaan impian Anda dengan mudah, atau jika Anda perekrut, posting lowongan dan temukan kandidat terbaik."
  }
];

const stats = [
  {
    value: "45k+",
    description: "Lowongan pekerjaan aktif dari berbagai perusahaan terkemuka di Indonesia yang siap menerima kandidat terbaik."
  },
  {
    value: "15min+",
    description: "Waktu rata-rata yang dibutuhkan untuk membuat profil lengkap dan mulai melamar pekerjaan impian Anda."
  },
  {
    value: "2000+",
    description: "Perusahaan terpercaya yang telah bergabung dan menemukan talenta terbaik melalui platform kami."
  }
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-gray-100 overflow-hidden">
      {/* Decorative starburst */}
      <div className="absolute bottom-32 left-8 w-24 h-24 opacity-60">
        <img src={starburstImg} alt="" className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Side - Steps */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6" data-testid="how-it-works-title">
              Temukan Pekerjaan<br />dengan Mudah
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed" data-testid="how-it-works-description">
              Platform kami memudahkan Anda untuk mencari pekerjaan impian atau menemukan kandidat terbaik dalam tiga langkah sederhana.
            </p>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4" data-testid={`step-${index}`}>
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold text-black">{step.number}.</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-black mb-2" data-testid={`step-title-${index}`}>
                      {step.title}
                    </h4>
                    {step.description && (
                      <p className="text-gray-600 text-sm leading-relaxed" data-testid={`step-description-${index}`}>
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image Card */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Decorative starburst on image */}
              <div className="absolute -top-4 -right-4 w-24 h-24 z-10">
                <img src={starburstImg} alt="" className="w-full h-full" />
              </div>
              
              <div className="relative max-w-md transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src={cardImg}
                  alt="Upload Resume Card" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center md:text-left" data-testid={`stat-${index}`}>
              <h3 className="text-4xl md:text-5xl font-bold text-black mb-4" data-testid={`stat-value-${index}`}>
                {stat.value}
              </h3>
              <p className="text-gray-600 leading-relaxed" data-testid={`stat-description-${index}`}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
