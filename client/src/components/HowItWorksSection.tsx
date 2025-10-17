const jobSeekerSteps = [
  {
    number: "1",
    title: "Cari Lowongan",
    description: "Gunakan filter untuk menemukan pekerjaan yang sesuai"
  },
  {
    number: "2",
    title: "Quick Apply",
    description: "Lamar dengan 1 klik menggunakan CV tersimpan"
  },
  {
    number: "3",
    title: "Track Progress",
    description: "Pantau status lamaran dari dashboard"
  }
];

const recruiterSteps = [
  {
    number: "1",
    title: "Post Lowongan",
    description: "Buat iklan dengan formulir sederhana, gratis"
  },
  {
    number: "2",
    title: "Review Aplikasi",
    description: "Lihat pelamar dan CV dari dashboard"
  },
  {
    number: "3",
    title: "Rekrut",
    description: "Hubungi kandidat dan isi posisi"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8" data-testid="job-seeker-title">
              Untuk Pencari Kerja
            </h3>
            <div className="space-y-8">
              {jobSeekerSteps.map((step, index) => (
                <div key={index} className="flex gap-4" data-testid={`job-seeker-step-${index}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    {step.number}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-lg font-medium text-gray-900 mb-1" data-testid={`job-seeker-step-title-${index}`}>
                      {step.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed" data-testid={`job-seeker-step-description-${index}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-l border-gray-200 pl-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8" data-testid="recruiter-title">
              Untuk Perekrut
            </h3>
            <div className="space-y-8">
              {recruiterSteps.map((step, index) => (
                <div key={index} className="flex gap-4" data-testid={`recruiter-step-${index}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    {step.number}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-lg font-medium text-gray-900 mb-1" data-testid={`recruiter-step-title-${index}`}>
                      {step.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed" data-testid={`recruiter-step-description-${index}`}>
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
