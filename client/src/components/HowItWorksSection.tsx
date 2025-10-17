import { useState } from "react";
import starburstImg from "@assets/0d231d(1)_1760687086089.png";
import cardImg from "@assets/0d231d(2)_1760688190358.png";

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
  const [activeStep, setActiveStep] = useState(0);
  return (
    <section className="relative py-24 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Side - Steps */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight" data-testid="how-it-works-title">
              Temukan Pekerjaan<br />dengan Mudah
            </h2>
            <p className="text-gray-600 mb-12 text-base leading-relaxed" data-testid="how-it-works-description">
              Platform kami memudahkan Anda untuk mencari pekerjaan impian atau menemukan kandidat terbaik dalam tiga langkah sederhana.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} data-testid={`step-${index}`}>
                  {activeStep === index ? (
                    <div className="border-l-4 border-primary pl-6 py-2">
                      <h4 
                        className="text-2xl font-bold text-black mb-4 cursor-pointer" 
                        data-testid={`step-title-${index}`}
                        onClick={() => setActiveStep(index)}
                      >
                        {step.number}. {step.title}
                      </h4>
                      <p className="text-gray-600 text-base leading-relaxed" data-testid={`step-description-${index}`}>
                        {step.description}
                      </p>
                    </div>
                  ) : (
                    <h4 
                      className="text-2xl font-bold text-black cursor-pointer hover:text-primary transition-colors" 
                      data-testid={`step-title-${index}`}
                      onClick={() => setActiveStep(index)}
                    >
                      {step.number}. {step.title}
                    </h4>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image Card */}
          <div className="flex items-center justify-center">
            <div className="relative max-w-2xl w-full">
              <img 
                src={cardImg}
                alt="Upload Resume Card" 
                className="w-full h-auto"
              />
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
