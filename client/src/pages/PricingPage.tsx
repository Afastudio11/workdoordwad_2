import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Check, Shield, ArrowRight, Phone, Mail, Zap, Users, TrendingUp, Building2, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: number | string;
  period: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  badge?: string;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant: "outline" | "default" | "primary";
  icon: any;
  description?: string;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "GRATIS",
    tagline: "Untuk Memulai",
    price: 0,
    period: "/bulan",
    badge: "Cocok untuk UMKM",
    icon: Zap,
    features: [
      { text: "Posting 3 lowongan kerja per bulan", included: true },
      { text: "Lowongan tampil di pencarian standar", included: true },
      { text: "Dashboard pemberi kerja dasar", included: true },
      { text: "Notifikasi email (max 50/bulan)", included: true },
      { text: "Profil perusahaan standar", included: true },
      { text: "Durasi lowongan: 30 hari", included: true },
      { text: "Support email (2-3 hari kerja)", included: true },
      { text: "Badge Featured", included: false },
      { text: "Analytics", included: false },
      { text: "Database CV kandidat", included: false },
    ],
    buttonText: "Pilih Gratis",
    buttonVariant: "outline",
  },
  {
    id: "starter",
    name: "STARTER",
    tagline: "Untuk Bisnis Berkembang",
    price: 199000,
    period: "/bulan",
    badge: "Populer",
    isPopular: true,
    icon: Users,
    features: [
      { text: "Posting 10 lowongan kerja per bulan", included: true },
      { text: "Badge \"Featured\" di 3 lowongan", included: true },
      { text: "Prioritas lebih tinggi di pencarian", included: true },
      { text: "Logo perusahaan di listing", included: true },
      { text: "Analytics dasar (views, aplikasi)", included: true },
      { text: "Notifikasi email unlimited", included: true },
      { text: "Profil perusahaan enhanced", included: true },
      { text: "Durasi lowongan: 45 hari", included: true },
      { text: "Support email & chat (1 hari kerja)", included: true },
      { text: "Social media boost", included: false },
      { text: "Database CV kandidat", included: false },
    ],
    buttonText: "Pilih Starter",
    buttonVariant: "outline",
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    tagline: "Solusi Terbaik untuk Perekrutan",
    price: 399000,
    period: "/bulan",
    badge: "RECOMMENDED",
    isRecommended: true,
    icon: TrendingUp,
    features: [
      { text: "Posting 30 lowongan kerja per bulan", included: true },
      { text: "Badge \"Featured\" & \"Urgent\" unlimited", included: true },
      { text: "Prioritas TOP 3 di hasil pencarian", included: true },
      { text: "Logo perusahaan size besar & highlight", included: true },
      { text: "Analytics lengkap + demografi kandidat", included: true },
      { text: "Notifikasi email & WhatsApp unlimited", included: true },
      { text: "Boost ke media sosial otomatis", included: true },
      { text: "Profil premium dengan video & gallery", included: true },
      { text: "Durasi lowongan: 60 hari", included: true },
      { text: "Support prioritas (<6 jam)", included: true },
      { text: "Akses database CV (100 CV/bulan)", included: true },
    ],
    buttonText: "Pilih Professional",
    buttonVariant: "primary",
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    tagline: "Untuk Korporasi & Perusahaan Besar",
    price: "Hubungi Kami",
    period: "",
    badge: "Custom Solution",
    icon: Building2,
    features: [
      { text: "Posting UNLIMITED lowongan kerja", included: true },
      { text: "Semua fitur Professional +", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "Custom branding di halaman perusahaan", included: true },
      { text: "API integration untuk ATS", included: true },
      { text: "White-label career page", included: true },
      { text: "Database CV kandidat UNLIMITED", included: true },
      { text: "Banner iklan eksklusif homepage (7 hari)", included: true },
      { text: "Laporan analytics bulanan (PDF)", included: true },
      { text: "Training gratis untuk HR team", included: true },
      { text: "Support 24/7 prioritas tertinggi", included: true },
    ],
    buttonText: "Hubungi Sales",
    buttonVariant: "outline",
  },
];

export default function PricingPage() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<Record<string, string>>({
    starter: "1_month",
    professional: "1_month",
  });
  const [showComparison, setShowComparison] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const userDataStr = params.get("userData");
    if (userDataStr) {
      try {
        setUserData(JSON.parse(decodeURIComponent(userDataStr)));
      } catch (e) {
        console.error("Failed to parse userData:", e);
      }
    }
  }, [search]);

  const getPricing = (planId: string, duration: string) => {
    const prices: Record<string, Record<string, { price: number; discount: string }>> = {
      starter: {
        "1_month": { price: 199000, discount: "" },
        "3_months": { price: 549000, discount: "Hemat 8%" },
        "12_months": { price: 1999000, discount: "Hemat 16%" },
      },
      professional: {
        "1_month": { price: 399000, discount: "" },
        "3_months": { price: 1099000, discount: "Hemat 8%" },
        "12_months": { price: 3999000, discount: "Hemat 16%" },
      },
    };
    return prices[planId]?.[duration] || { price: 0, discount: "" };
  };

  const handleSelectPlan = async (planId: string) => {
    if (!userData) {
      toast({
        title: "Error",
        description: "Data registrasi tidak ditemukan. Silakan mulai dari awal.",
        variant: "destructive",
      });
      navigate("/register/employer");
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      const duration = selectedDuration[planId] || "1_month";
      const pricing = getPricing(planId, duration);

      // Register user + create company
      const response = await apiRequest("/api/auth/register", "POST", {
        username: userData.email?.split('@')[0] || "",
        email: userData.email,
        password: userData.password,
        fullName: userData.picName,
        phone: userData.contactPhone,
        role: "pemberi_kerja",
        company: {
          name: userData.companyName,
          description: userData.description,
          industry: userData.industry,
          location: userData.city,
          website: userData.website,
          contactEmail: userData.email,
          contactPhone: userData.contactPhone,
          whatsappNumber: userData.whatsappNumber,
          employeeCount: userData.employeeCount,
          foundedYear: userData.foundedYear,
          logo: userData.logo,
          legalDocUrl: userData.legalDocUrl,
          picName: userData.picName,
          picPosition: userData.picPosition,
          subscriptionPlan: planId,
          subscriptionDuration: duration,
          paymentStatus: planId === "free" ? "completed" : "pending",
        },
      });

      if (response.ok) {
        if (planId === "free") {
          toast({
            title: "Registrasi Berhasil!",
            description: "Akun Anda telah dibuat dengan paket Gratis. Silakan cek email untuk verifikasi.",
          });
          navigate("/login");
        } else if (planId === "enterprise") {
          toast({
            title: "Terima Kasih!",
            description: "Tim sales kami akan menghubungi Anda dalam 1x24 jam.",
          });
          navigate("/");
        } else {
          // Redirect to payment page
          navigate(`/payment?plan=${planId}&duration=${duration}&price=${pricing.price}`);
        }
      } else {
        throw new Error("Registrasi gagal");
      }
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header variant="dark" />

      {/* Hero Section */}
      <div className="bg-white dark:bg-black py-12 md:py-16 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="heading-1 text-heading mb-4">
            Pilih Paket yang Tepat untuk Kebutuhan Anda
          </h1>
          <p className="body-large text-muted-foreground max-w-3xl mx-auto">
            Dapatkan akses ke ribuan kandidat berkualitas dengan paket yang sesuai dengan skala bisnis Anda
          </p>
          
          {/* Guarantee Badge */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-heading">Garansi Uang Kembali 7 Hari</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isRecommended = plan.isRecommended;
            
            return (
              <div key={plan.id} className="relative">
                {/* Ribbon Badge */}
                {plan.badge && (
                  <div 
                    className={`absolute -top-3 -right-3 z-10 px-3 py-1 rounded text-xs font-bold ${
                      isRecommended 
                        ? "bg-primary text-black dark:text-black" 
                        : plan.id === "enterprise"
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <Card 
                  className={`h-full transition-all duration-300 ${
                    isRecommended
                      ? "border-[3px] border-primary shadow-[0_8px_24px_rgba(212,255,0,0.3)] hover:scale-105"
                      : "border-2 border-gray-200 dark:border-gray-700 hover:scale-102 hover:shadow-lg"
                  }`}
                >
                  <CardHeader className="text-center pb-6">
                    <div 
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isRecommended 
                          ? "bg-primary/20" 
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${isRecommended ? "text-primary" : "text-heading"}`} />
                    </div>
                    <CardTitle className="heading-3 text-heading mb-2">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="body-small">
                      {plan.tagline}
                    </CardDescription>
                    
                    <div className="mt-6">
                      {typeof plan.price === "number" ? (
                        <>
                          <div className="text-4xl font-bold text-heading">
                            Rp {plan.price.toLocaleString("id-ID")}
                          </div>
                          <div className="text-sm text-muted-foreground">{plan.period}</div>
                        </>
                      ) : (
                        <div className="text-3xl font-bold text-heading">{plan.price}</div>
                      )}
                    </div>

                    {/* Duration Tabs for Starter & Professional */}
                    {(plan.id === "starter" || plan.id === "professional") && (
                      <Tabs 
                        defaultValue="1_month" 
                        className="mt-4"
                        onValueChange={(value) => setSelectedDuration({ ...selectedDuration, [plan.id]: value })}
                      >
                        <TabsList className="grid w-full grid-cols-3 h-auto">
                          <TabsTrigger value="1_month" className="text-xs py-2">1 Bulan</TabsTrigger>
                          <TabsTrigger value="3_months" className="text-xs py-2">
                            3 Bulan
                            <Badge variant="secondary" className="ml-1 text-[10px] bg-primary/20 text-black dark:text-black">-8%</Badge>
                          </TabsTrigger>
                          <TabsTrigger value="12_months" className="text-xs py-2">
                            12 Bulan
                            <Badge variant="secondary" className="ml-1 text-[10px] bg-primary/20 text-black dark:text-black">-16%</Badge>
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="1_month" className="mt-2">
                          <div className="text-sm text-muted-foreground">
                            Rp {getPricing(plan.id, "1_month").price.toLocaleString("id-ID")}
                          </div>
                        </TabsContent>
                        <TabsContent value="3_months" className="mt-2">
                          <div className="text-sm font-semibold text-heading">
                            Rp {getPricing(plan.id, "3_months").price.toLocaleString("id-ID")}
                          </div>
                          <div className="text-xs text-primary">{getPricing(plan.id, "3_months").discount}</div>
                        </TabsContent>
                        <TabsContent value="12_months" className="mt-2">
                          <div className="text-sm font-semibold text-heading">
                            Rp {getPricing(plan.id, "12_months").price.toLocaleString("id-ID")}
                          </div>
                          <div className="text-xs text-primary">{getPricing(plan.id, "12_months").discount}</div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features List */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          {feature.included ? (
                            <Check className={`h-5 w-5 flex-shrink-0 ${isRecommended ? "text-primary" : "text-green-500"}`} />
                          ) : (
                            <span className="h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-600">—</span>
                          )}
                          <span className={feature.included ? "text-heading" : "text-muted-foreground line-through"}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isProcessing && selectedPlan === plan.id}
                      className={`w-full mt-6 ${
                        isRecommended
                          ? "btn-cta-primary shadow-[0_4px_12px_rgba(212,255,0,0.4)]"
                          : plan.buttonVariant === "outline"
                          ? "border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                          : ""
                      }`}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {isProcessing && selectedPlan === plan.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          {plan.buttonText}
                          {plan.id === "enterprise" ? (
                            <Mail className="ml-2 h-4 w-4" />
                          ) : (
                            <ArrowRight className="ml-2 h-4 w-4" />
                          )}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Comparison Table Toggle */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => setShowComparison(!showComparison)}
            className="gap-2"
            data-testid="button-toggle-comparison"
          >
            {showComparison ? (
              <>
                Sembunyikan Perbandingan
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Bandingkan Semua Paket
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-4 text-left font-semibold text-heading">Fitur</th>
                  <th className="p-4 text-center font-semibold text-heading">Gratis</th>
                  <th className="p-4 text-center font-semibold text-heading">Starter</th>
                  <th className="p-4 text-center font-semibold text-primary">Professional</th>
                  <th className="p-4 text-center font-semibold text-heading">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium">Posting Lowongan/Bulan</td>
                  <td className="p-4 text-center">3</td>
                  <td className="p-4 text-center">10</td>
                  <td className="p-4 text-center">30</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-4 font-medium">Badge Featured</td>
                  <td className="p-4 text-center">—</td>
                  <td className="p-4 text-center">3</td>
                  <td className="p-4 text-center">Unlimited</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium">Prioritas Pencarian</td>
                  <td className="p-4 text-center">—</td>
                  <td className="p-4 text-center">Medium</td>
                  <td className="p-4 text-center">Top 3</td>
                  <td className="p-4 text-center">Top 1</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-4 font-medium">Analytics</td>
                  <td className="p-4 text-center">Basic</td>
                  <td className="p-4 text-center">Basic</td>
                  <td className="p-4 text-center">Advanced</td>
                  <td className="p-4 text-center">Advanced + Report</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium">Support</td>
                  <td className="p-4 text-center text-xs">Email (2-3 hari)</td>
                  <td className="p-4 text-center text-xs">Email & Chat (1 hari)</td>
                  <td className="p-4 text-center text-xs">Prioritas (&lt;6 jam)</td>
                  <td className="p-4 text-center text-xs">24/7 Dedicated</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-4 font-medium">Database CV</td>
                  <td className="p-4 text-center">—</td>
                  <td className="p-4 text-center">—</td>
                  <td className="p-4 text-center">100/bulan</td>
                  <td className="p-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-medium">Social Media Boost</td>
                  <td className="p-4 text-center">—</td>
                  <td className="p-4 text-center">—</td>
                  <td className="p-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-4 font-medium">Durasi Aktif Lowongan</td>
                  <td className="p-4 text-center">30 hari</td>
                  <td className="p-4 text-center">45 hari</td>
                  <td className="p-4 text-center">60 hari</td>
                  <td className="p-4 text-center">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="heading-4 text-heading mb-4">Pembayaran Aman & Terpercaya</h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <Badge variant="outline" className="text-sm px-4 py-2">BCA</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Mandiri</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">GoPay</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">OVO</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">DANA</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">QRIS</Badge>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="heading-2 text-heading text-center mb-8">
          Pertanyaan yang Sering Diajukan
        </h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="faq-1" className="border border-gray-200 dark:border-gray-700 rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <span className="font-semibold text-heading">Apakah bisa upgrade paket nanti?</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Ya, Anda bisa upgrade paket kapan saja. Perbedaan harga akan disesuaikan secara pro-rata.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="border border-gray-200 dark:border-gray-700 rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <span className="font-semibold text-heading">Bagaimana cara pembayaran?</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Kami menerima pembayaran melalui transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, DANA, ShopeePay), Virtual Account, dan QRIS.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="border border-gray-200 dark:border-gray-700 rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <span className="font-semibold text-heading">Apakah ada refund?</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Ya, kami menyediakan garansi uang kembali dalam 7 hari jika Anda tidak puas dengan layanan kami (khusus paket berbayar).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4" className="border border-gray-200 dark:border-gray-700 rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <span className="font-semibold text-heading">Bagaimana cara kerja paket tahunan?</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Dengan paket tahunan, Anda membayar sekali untuk 12 bulan dan mendapatkan diskon hingga 16%. Paket akan otomatis diperpanjang setelah masa aktif berakhir.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5" className="border border-gray-200 dark:border-gray-700 rounded-lg px-6">
            <AccordionTrigger className="hover:no-underline">
              <span className="font-semibold text-heading">Apakah paket gratis memiliki batasan waktu?</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Tidak ada batasan waktu untuk paket gratis. Anda dapat menggunakannya selama yang Anda butuhkan dengan batasan fitur yang sudah ditentukan.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-2 text-black dark:text-black mb-4">
            Mulai Rekrut Talenta Terbaik Hari Ini
          </h2>
          <p className="body-large text-black/80 dark:text-black/80 mb-8">
            Bergabunglah dengan ratusan perusahaan yang sudah menemukan kandidat terbaik melalui platform kami
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/employer">
              <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-100 border-2 border-black">
                Daftar Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-transparent text-black border-2 border-black hover:bg-black/10">
                <Phone className="mr-2 h-5 w-5" />
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
