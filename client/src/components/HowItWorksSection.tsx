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
    <section className="relative py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Side - Steps */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 leading-tight" data-testid="how-it-works-title">
              Temukan Pekerjaan<br />dengan Mudah
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 text-base leading-relaxed" data-testid="how-it-works-description">
              Platform kami memudahkan Anda untuk mencari pekerjaan impian atau menemukan kandidat terbaik dalam tiga langkah sederhana.
            </p>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  data-testid={`step-${index}`}
                  onClick={() => setActiveStep(index)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {activeStep === index ? (
                    <div className="border-l-4 border-lime-400 pl-6 py-3 bg-lime-50 dark:bg-lime-950/20 rounded-r-lg">
                      <h4 
                        className="text-xl font-bold text-black dark:text-white mb-3" 
                        data-testid={`step-title-${index}`}
                      >
                        {step.number}. {step.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed" data-testid={`step-description-${index}`}>
                        {step.description}
                      </p>
                    </div>
                  ) : (
                    <h4 
                      className="text-xl font-bold text-gray-800 dark:text-gray-300 hover:text-lime-600 dark:hover:text-lime-400 transition-colors pl-6" 
                      data-testid={`step-title-${index}`}
                    >
                      {step.number}. {step.title}
                    </h4>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image Card */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <img 
                src={cardImg}
                alt="Upload Resume Card" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <h3 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-3" data-testid={`stat-value-${index}`}>
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto" data-testid={`stat-description-${index}`}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
