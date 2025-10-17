import { Instagram, Sparkles } from "lucide-react";

export default function AIInnovationSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-wide text-gray-500 font-medium" data-testid="badge-ai-powered">
              AI-Powered
            </span>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 mt-3" data-testid="ai-title">
              Lowongan dari Instagram, Langsung di Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="ai-description">
              AI kami mengidentifikasi lowongan dari Instagram dan mengekstrak informasi penting seperti posisi, lokasi, dan kualifikasi. Semua lowongan diverifikasi editor sebelum tayang.
            </p>

            <div className="space-y-6">
              <div data-testid="ai-feature-0">
                <h4 className="font-medium text-gray-900 mb-1">Scraping Otomatis</h4>
                <p className="text-gray-600 leading-relaxed">AI mengambil data lowongan dari Instagram secara real-time</p>
              </div>
              <div data-testid="ai-feature-1">
                <h4 className="font-medium text-gray-900 mb-1">NLP Processing</h4>
                <p className="text-gray-600 leading-relaxed">Natural Language Processing mengekstrak informasi penting</p>
              </div>
              <div data-testid="ai-feature-2">
                <h4 className="font-medium text-gray-900 mb-1">Human Verification</h4>
                <p className="text-gray-600 leading-relaxed">Diverifikasi tim editor sebelum dipublikasi</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-md border border-gray-200 p-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Instagram className="h-6 w-6 text-gray-900" />
                  <div>
                    <h4 className="font-medium text-gray-900">Instagram Post</h4>
                    <p className="text-xs text-gray-500">@company_indonesia</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">
                  "Dicari: Staff Admin di Jakarta. Minimal SMA, bisa Excel. Gaji 4-5 juta. Hub: 0812xxx"
                </p>
              </div>

              <div className="flex items-center justify-center py-4">
                <div className="flex gap-1">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Lowongan Terstruktur</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Posisi:</span>
                    <span className="font-medium text-gray-900">Staff Admin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lokasi:</span>
                    <span className="font-medium text-gray-900">Jakarta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gaji:</span>
                    <span className="font-medium text-gray-900">Rp 4-5 juta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pendidikan:</span>
                    <span className="font-medium text-gray-900">SMA</span>
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
