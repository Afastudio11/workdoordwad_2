import { Search, FileCheck, TrendingUp, FileText, Users, Sparkles } from "lucide-react";

const jobSeekerSteps = [
  {
    icon: Search,
    number: "1",
    title: "Cari Lowongan",
    description: "Gunakan filter lokasi, industri, dan kata kunci untuk menemukan pekerjaan impian"
  },
  {
    icon: FileCheck,
    title: "Quick Apply",
    number: "2",
    description: "Lamar dengan 1 klik menggunakan CV yang sudah tersimpan di profil Anda"
  },
  {
    icon: TrendingUp,
    number: "3",
    title: "Track Progress",
    description: "Pantau status lamaran Anda secara real-time dari dashboard"
  }
];

const recruiterSteps = [
  {
    icon: FileText,
    number: "1",
    title: "Post Lowongan",
    description: "Buat iklan lowongan dengan formulir sederhana dan posting gratis"
  },
  {
    icon: Users,
    number: "2",
    title: "Review Aplikasi",
    description: "Lihat daftar pelamar dan CV mereka langsung dari dashboard"
  },
  {
    icon: Sparkles,
    number: "3",
    title: "Rekrut Talenta",
    description: "Hubungi kandidat terbaik dan isi posisi dengan cepat"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="how-it-works-title">
            Cara Kerjanya
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="how-it-works-subtitle">
            Proses sederhana untuk pencari kerja dan perekrut
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center md:text-left" data-testid="job-seeker-title">
              Untuk Pencari Kerja
            </h3>
            <div className="space-y-6">
              {jobSeekerSteps.map((step, index) => (
                <div key={index} className="flex gap-4" data-testid={`job-seeker-step-${index}`}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="h-5 w-5 text-primary" />
                      <h4 className="text-lg font-semibold text-foreground" data-testid={`job-seeker-step-title-${index}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-muted-foreground" data-testid={`job-seeker-step-description-${index}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center md:text-left" data-testid="recruiter-title">
              Untuk Perekrut
            </h3>
            <div className="space-y-6">
              {recruiterSteps.map((step, index) => (
                <div key={index} className="flex gap-4" data-testid={`recruiter-step-${index}`}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-chart-2 text-white flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="h-5 w-5 text-chart-2" />
                      <h4 className="text-lg font-semibold text-foreground" data-testid={`recruiter-step-title-${index}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-muted-foreground" data-testid={`recruiter-step-description-${index}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
