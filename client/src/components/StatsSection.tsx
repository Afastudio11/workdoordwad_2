const stats = [
  { number: "15,000+", label: "LOWONGAN" },
  { number: "5,000+", label: "PERUSAHAAN" },
  { number: "20,000+", label: "PENCARI KERJA" },
  { number: "85%", label: "SUCCESS RATE" }
];

export default function StatsSection() {
  return (
    <section className="py-16 border-y border-white/10 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <div className="text-4xl font-bold text-primary mb-2" data-testid={`stat-number-${index}`}>
                {stat.number}
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-400 font-medium" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
