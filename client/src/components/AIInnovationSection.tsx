import { Instagram, Sparkles } from "lucide-react";

export default function AIInnovationSection() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-wide text-primary font-medium" data-testid="badge-ai-powered">
              AI-Powered
            </span>
            <h2 className="text-3xl font-semibold text-white mb-4 mt-3" data-testid="ai-title">
              Lowongan dari Instagram, Langsung di Dashboard
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed" data-testid="ai-description">
              AI kami mengidentifikasi lowongan dari Instagram dan mengekstrak informasi penting seperti posisi, lokasi, dan kualifikasi. Semua lowongan diverifikasi editor sebelum tayang.
            </p>

            <div className="space-y-6">
              <div data-testid="ai-feature-0">
                <h4 className="font-medium text-white mb-1">Scraping Otomatis</h4>
                <p className="text-gray-400 leading-relaxed">AI mengambil data lowongan dari Instagram secara real-time</p>
              </div>
              <div data-testid="ai-feature-1">
                <h4 className="font-medium text-white mb-1">NLP Processing</h4>
                <p className="text-gray-400 leading-relaxed">Natural Language Processing mengekstrak informasi penting</p>
              </div>
              <div data-testid="ai-feature-2">
                <h4 className="font-medium text-white mb-1">Human Verification</h4>
                <p className="text-gray-400 leading-relaxed">Diverifikasi tim editor sebelum dipublikasi</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8">
              <div className="border-b border-white/10 pb-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Instagram className="h-6 w-6 text-white" />
                  <div>
                    <h4 className="font-medium text-white">Instagram Post</h4>
                    <p className="text-xs text-gray-400">@company_indonesia</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 italic">
                  "Dicari: Staff Admin di Jakarta. Minimal SMA, bisa Excel. Gaji 4-5 juta. Hub: 0812xxx"
                </p>
              </div>

              <div className="flex items-center justify-center py-4">
                <div className="flex gap-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <Sparkles className="h-4 w-4 text-primary" />
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="font-medium text-white mb-4">Lowongan Terstruktur</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posisi:</span>
                    <span className="font-medium text-white">Staff Admin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lokasi:</span>
                    <span className="font-medium text-white">Jakarta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gaji:</span>
                    <span className="font-medium text-white">Rp 4-5 juta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pendidikan:</span>
                    <span className="font-medium text-white">SMA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
