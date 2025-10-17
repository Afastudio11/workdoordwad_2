const stats = [
  { number: "50,000+", label: "Lowongan Aktif" },
  { number: "10,000+", label: "Pengguna Terdaftar" },
  { number: "2,500+", label: "Perusahaan" },
  { number: "< 7 Hari", label: "Rata-rata Waktu Rekrutmen" }
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-chart-1">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2" data-testid={`stat-number-${index}`}>
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-white/90" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
