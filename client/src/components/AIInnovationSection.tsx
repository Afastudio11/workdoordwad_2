import { Instagram, CheckCircle, Sparkles, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AIInnovationSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" data-testid="badge-ai-powered">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="ai-title">
              Lowongan dari Instagram, Langsung di Dashboard Anda
            </h2>
            <p className="text-lg text-muted-foreground mb-6" data-testid="ai-description">
              Teknologi AI kami secara otomatis mengidentifikasi dan mengekstrak lowongan kerja dari postingan Instagram, menganalisis posisi, perusahaan, lokasi, dan kualifikasi yang dibutuhkan.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3" data-testid="ai-feature-0">
                <CheckCircle className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Scraping Otomatis</h4>
                  <p className="text-sm text-muted-foreground">AI mengambil data lowongan dari Instagram secara real-time</p>
                </div>
              </div>
              <div className="flex items-start gap-3" data-testid="ai-feature-1">
                <CheckCircle className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">NLP Processing</h4>
                  <p className="text-sm text-muted-foreground">Natural Language Processing mengekstrak informasi penting dari teks</p>
                </div>
              </div>
              <div className="flex items-start gap-3" data-testid="ai-feature-2">
                <CheckCircle className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Human Verification</h4>
                  <p className="text-sm text-muted-foreground">Setiap lowongan diverifikasi oleh tim editor sebelum dipublikasi</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg border border-muted" data-testid="trust-badge">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Verified by Human Editors</span>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-chart-2/20 rounded-2xl p-8 border border-primary/30">
              <div className="bg-card rounded-lg p-6 mb-4 border border-card-border">
                <div className="flex items-center gap-3 mb-4">
                  <Instagram className="h-8 w-8 text-chart-3" />
                  <div>
                    <h4 className="font-semibold text-foreground">Instagram Post</h4>
                    <p className="text-xs text-muted-foreground">@company_indonesia</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic mb-3">
                  "Dicari: Staff Admin di Jakarta. Minimal lulusan SMA, bisa Excel. Gaji 4-5 juta. Hub: 0812xxx"
                </p>
              </div>

              <div className="flex items-center justify-center my-4">
                <div className="flex gap-1">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <Sparkles className="h-5 w-5 text-primary animate-pulse delay-100" />
                  <Sparkles className="h-5 w-5 text-primary animate-pulse delay-200" />
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-card-border">
                <h4 className="font-semibold text-foreground mb-3">Lowongan Terstruktur</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posisi:</span>
                    <span className="font-medium text-foreground">Staff Admin</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lokasi:</span>
                    <span className="font-medium text-foreground">Jakarta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gaji:</span>
                    <span className="font-medium text-foreground">Rp 4-5 juta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pendidikan:</span>
                    <span className="font-medium text-foreground">SMA</span>
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
