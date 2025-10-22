import { Link } from "wouter";
import { Briefcase, Building2, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterRoleSelectionPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header variant="dark" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="heading-1 text-heading mb-4">
            Mulai Perjalanan Anda
          </h1>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto">
            Pilih bagaimana Anda ingin menggunakan platform kami
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card Pencari Kerja */}
          <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg group cursor-pointer">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Briefcase className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="heading-3 text-heading">
                Daftar sebagai Pencari Kerja
              </CardTitle>
              <CardDescription className="body-base mt-2">
                Temukan pekerjaan impian Anda dari ribuan lowongan tersedia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="body-small text-muted-foreground">
                    Akses ke ribuan lowongan pekerjaan dari berbagai industri
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="body-small text-muted-foreground">
                    Buat profil profesional dan upload CV Anda
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="body-small text-muted-foreground">
                    Dapatkan rekomendasi pekerjaan yang sesuai
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="body-small text-muted-foreground">
                    Lamar pekerjaan dengan satu klik
                  </p>
                </div>
              </div>
              
              <Link href="/register/job-seeker">
                <Button 
                  className="w-full btn-cta-primary group mt-6"
                  data-testid="button-register-job-seeker"
                >
                  Daftar Sebagai Pencari Kerja
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Pemberi Kerja */}
          <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg group cursor-pointer">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="heading-3 text-heading">
                Daftar sebagai Pemberi Kerja
              </CardTitle>
              <CardDescription className="body-base mt-2">
                Temukan talenta terbaik untuk mengembangkan bisnis Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="body-small text-muted-foreground">
                    Posting lowongan pekerjaan dengan mudah
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="body-small text-muted-foreground">
                    Akses database kandidat berkualitas
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="body-small text-muted-foreground">
                    Kelola aplikasi dan rekrutmen dalam satu platform
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <p className="body-small text-muted-foreground">
                    Berbagai paket layanan sesuai kebutuhan perusahaan
                  </p>
                </div>
              </div>
              
              <Link href="/register/employer">
                <Button 
                  className="w-full btn-cta-primary group mt-6"
                  data-testid="button-register-employer"
                >
                  Daftar Sebagai Pemberi Kerja
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="body-small text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login">
              <a className="text-primary hover:underline font-medium" data-testid="link-login">
                Masuk di sini
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
