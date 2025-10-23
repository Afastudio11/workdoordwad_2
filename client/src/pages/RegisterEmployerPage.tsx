import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Loader2, Mail, CheckCircle2, Zap, Users, TrendingUp, Building2, Check, X, BadgeCheck } from "lucide-react";
import Header from "@/components/Header";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Form schemas
const step1Schema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf besar")
    .regex(/[a-z]/, "Password harus mengandung minimal 1 huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung minimal 1 angka"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, "Anda harus menyetujui syarat dan ketentuan"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

const step2Schema = z.object({
  companyName: z.string().min(3, "Nama perusahaan minimal 3 karakter"),
  industry: z.string().min(1, "Bidang industri harus dipilih"),
  employeeCount: z.string().min(1, "Jumlah karyawan harus dipilih"),
  foundedYear: z.string().min(4, "Tahun berdiri harus diisi"),
  website: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
  description: z.string().min(100, "Deskripsi minimal 100 karakter"),
});

const step3Schema = z.object({
  picName: z.string().min(3, "Nama PIC minimal 3 karakter"),
  picPosition: z.string().min(2, "Jabatan PIC harus diisi"),
  contactPhone: z.string().min(10, "Nomor telepon tidak valid"),
  whatsappNumber: z.string().min(10, "Nomor WhatsApp tidak valid"),
  city: z.string().min(1, "Kota harus dipilih"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

const industries = [
  "Teknologi", "Manufaktur", "Jasa", "Retail", "Pendidikan", "Kesehatan",
  "F&B", "Konstruksi", "Keuangan", "Media", "Transportasi", "Pariwisata", "Lainnya"
];

const cities = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang",
  "Tangerang", "Depok", "Bekasi", "Bogor", "Batam", "Pekanbaru", "Bandar Lampung",
  "Yogyakarta", "Malang", "Denpasar", "Balikpapan", "Pontianak", "Manado"
];

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number | string;
  priceYearly: number | string;
  badge?: string;
  isPopular?: boolean;
  features: PlanFeature[];
  icon: any;
  hasVerifiedBadge?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "GRATIS",
    tagline: "Untuk Memulai",
    priceMonthly: 0,
    priceYearly: 0,
    badge: "Cocok untuk UMKM",
    icon: Zap,
    hasVerifiedBadge: false,
    features: [
      { text: "Posting 3 lowongan kerja per bulan", included: true },
      { text: "Dashboard pemberi kerja dasar", included: true },
      { text: "Durasi lowongan: 30 hari", included: true },
      { text: "Verified Badge (Centang Biru)", included: false },
      { text: "Badge Featured", included: false },
      { text: "Analytics", included: false },
    ],
  },
  {
    id: "starter",
    name: "STARTER",
    tagline: "Untuk Bisnis Berkembang",
    priceMonthly: 199000,
    priceYearly: 1990000, // 10 bulan, hemat 2 bulan
    badge: "Populer",
    isPopular: true,
    icon: Users,
    hasVerifiedBadge: true,
    features: [
      { text: "Verified Badge (Centang Biru)", included: true },
      { text: "Posting 10 lowongan kerja per bulan", included: true },
      { text: "Badge \"Featured\" di 3 lowongan", included: true },
      { text: "Analytics dasar (views, aplikasi)", included: true },
      { text: "Durasi lowongan: 45 hari", included: true },
      { text: "Support email & chat (1 hari kerja)", included: true },
    ],
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    tagline: "Solusi Terbaik untuk Perekrutan",
    priceMonthly: 399000,
    priceYearly: 3990000, // 10 bulan, hemat 2 bulan
    badge: "RECOMMENDED",
    icon: TrendingUp,
    hasVerifiedBadge: true,
    features: [
      { text: "Verified Badge (Centang Biru)", included: true },
      { text: "Posting 30 lowongan kerja per bulan", included: true },
      { text: "Badge \"Featured\" & \"Urgent\" unlimited", included: true },
      { text: "Analytics lengkap + demografi kandidat", included: true },
      { text: "Akses database CV (100 CV/bulan)", included: true },
      { text: "Support prioritas (<6 jam)", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    tagline: "Untuk Korporasi & Perusahaan Besar",
    priceMonthly: "Hubungi Kami",
    priceYearly: "Hubungi Kami",
    badge: "Custom Solution",
    icon: Building2,
    hasVerifiedBadge: true,
    features: [
      { text: "Verified Badge (Centang Biru)", included: true },
      { text: "Posting UNLIMITED lowongan kerja", included: true },
      { text: "Dedicated Account Manager", included: true },
      { text: "Database CV kandidat UNLIMITED", included: true },
      { text: "API integration untuk ATS", included: true },
      { text: "Support 24/7 prioritas tertinggi", included: true },
    ],
  },
];

export default function RegisterEmployerPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data> & { logo?: string; legalDocUrl?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("free");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [legalDocFile, setLegalDocFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const steps = ["Informasi Akun", "Data Perusahaan", "Kontak & Alamat", "Pilih Paket"];

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      email: formData.email || "",
      password: formData.password || "",
      confirmPassword: formData.confirmPassword || "",
      agreeToTerms: formData.agreeToTerms || false,
    },
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      companyName: formData.companyName || "",
      industry: formData.industry || "",
      employeeCount: formData.employeeCount || "",
      foundedYear: formData.foundedYear || "",
      website: formData.website || "",
      description: formData.description || "",
    },
  });

  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      picName: formData.picName || "",
      picPosition: formData.picPosition || "",
      contactPhone: formData.contactPhone || "",
      whatsappNumber: formData.whatsappNumber || "",
      city: formData.city || "",
      address: formData.address || "",
    },
  });

  const handleStep1Submit = (data: Step1Data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
  };

  const handleStep3Submit = async (data: Step3Data) => {
    // Validate files
    if (!logoFile) {
      toast({
        title: "Error",
        description: "Logo perusahaan wajib diupload",
        variant: "destructive",
      });
      return;
    }
    
    if (!legalDocFile) {
      toast({
        title: "Error",
        description: "Dokumen legalitas wajib diupload",
        variant: "destructive",
      });
      return;
    }

    // Upload files
    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('logo', logoFile);
      uploadFormData.append('legalDoc', legalDocFile);

      const response = await fetch('/api/upload/company-docs', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal mengupload dokumen');
      }

      const result = await response.json();
      
      setFormData({ 
        ...formData, 
        ...data,
        logo: result.logoUrl,
        legalDocUrl: result.legalDocUrl,
      });
      setCurrentStep(4);
    } catch (error: any) {
      toast({
        title: "Gagal Upload",
        description: error.message || "Terjadi kesalahan saat mengupload dokumen",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const completeData = formData;
      
      // Register user + create company
      const response = await apiRequest("/api/auth/register/pemberi-kerja", "POST", {
        username: completeData.email?.split('@')[0] || "",
        email: completeData.email,
        password: completeData.password,
        fullName: completeData.picName,
        phone: completeData.contactPhone,
        companyName: completeData.companyName,
        logo: completeData.logo,
        legalDocUrl: completeData.legalDocUrl,
        industry: completeData.industry,
        employeeCount: completeData.employeeCount,
        foundedYear: completeData.foundedYear,
        website: completeData.website,
        description: completeData.description,
        picPosition: completeData.picPosition,
        whatsappNumber: completeData.whatsappNumber,
        city: completeData.city,
        address: completeData.address,
      });

      if (response.ok) {
        toast({
          title: "Registrasi Berhasil!",
          description: "Akun Anda telah dibuat. Selamat datang di Pintu Kerja!",
        });
        navigate("/employer/dashboard");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Registrasi gagal");
      }
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header variant="dark" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <Link href="/register">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="heading-1 text-heading mb-2">
            Daftar sebagai Pemberi Kerja
          </h1>
          <p className="body-base text-muted-foreground">
            Temukan talenta terbaik untuk perusahaan Anda
          </p>
        </div>

        <ProgressIndicator currentStep={currentStep} totalSteps={4} steps={steps} />

        {/* Step 1: Informasi Akun */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="heading-3">Informasi Akun</CardTitle>
              <CardDescription>Buat akun perusahaan dengan email dan password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form1}>
                <form onSubmit={form1.handleSubmit(handleStep1Submit)} className="space-y-6">
                  <FormField
                    control={form1.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Perusahaan *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="hr@perusahaan.com" autoComplete="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form1.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Minimal 8 karakter" autoComplete="new-password" {...field} data-testid="input-password" />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Minimal 8 karakter, harus ada huruf besar, huruf kecil, dan angka</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form1.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Password *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Ulangi password" autoComplete="new-password" {...field} data-testid="input-confirm-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form1.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-terms"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            Saya setuju dengan{" "}
                            <Link href="/terms" className="text-foreground hover:underline">Syarat & Ketentuan</Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full btn-cta-primary" data-testid="button-next-step-1">
                    Lanjutkan ke Step 2
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Data Perusahaan */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="heading-3">Data Perusahaan</CardTitle>
              <CardDescription>Lengkapi informasi perusahaan Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form2}>
                <form onSubmit={form2.handleSubmit(handleStep2Submit)} className="space-y-6">
                  <FormField
                    control={form2.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Perusahaan *</FormLabel>
                        <FormControl>
                          <Input placeholder="PT. Nama Perusahaan" {...field} data-testid="input-company-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form2.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bidang Industri *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-industry">
                                <SelectValue placeholder="Pilih bidang industri" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name="employeeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah Karyawan *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-employee-count">
                                <SelectValue placeholder="Pilih jumlah karyawan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10</SelectItem>
                              <SelectItem value="11-50">11-50</SelectItem>
                              <SelectItem value="51-200">51-200</SelectItem>
                              <SelectItem value="201-500">201-500</SelectItem>
                              <SelectItem value=">500">&gt;500</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form2.control}
                      name="foundedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tahun Berdiri *</FormLabel>
                          <FormControl>
                            <Input placeholder="2020" {...field} data-testid="input-founded-year" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website Perusahaan</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.perusahaan.com" {...field} data-testid="input-website" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">Opsional</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form2.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Perusahaan *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ceritakan tentang perusahaan Anda, visi, misi, dan budaya kerja..." 
                            rows={5} 
                            {...field} 
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Minimal 100 karakter</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="w-full"
                      data-testid="button-back-step-2"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali
                    </Button>
                    <Button type="submit" className="w-full btn-cta-primary" data-testid="button-next-step-2">
                      Lanjutkan ke Step 3
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Kontak & Alamat */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="heading-3">Informasi Kontak & Alamat</CardTitle>
              <CardDescription>Lengkapi data kontak perusahaan Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form3}>
                <form onSubmit={form3.handleSubmit(handleStep3Submit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form3.control}
                      name="picName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap PIC *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama person in charge" {...field} data-testid="input-pic-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="picPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jabatan PIC *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., HR Manager" {...field} data-testid="input-pic-position" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form3.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon Perusahaan *</FormLabel>
                          <FormControl>
                            <Input placeholder="021xxxxxxxx" {...field} data-testid="input-contact-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor WhatsApp *</FormLabel>
                          <FormControl>
                            <Input placeholder="08xxxxxxxxxx" {...field} data-testid="input-whatsapp" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">Untuk notifikasi aplikasi</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form3.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kota Kantor Pusat *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-city">
                              <SelectValue placeholder="Pilih kota" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form3.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Lengkap Kantor *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Alamat lengkap kantor pusat" rows={3} {...field} data-testid="textarea-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4 border-t border-border">
                    <Label className="text-base font-semibold">Dokumen Perusahaan (Wajib)</Label>
                    
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Upload Logo Perusahaan *</FormLabel>
                        <div className="mt-2">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    // Validate file size (max 1MB)
                                    if (file.size > 1024 * 1024) {
                                      toast({
                                        title: "File terlalu besar",
                                        description: "Ukuran logo maksimal 1MB",
                                        variant: "destructive",
                                      });
                                      e.target.value = "";
                                      return;
                                    }
                                    // Validate file type
                                    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                                      toast({
                                        title: "Format file tidak valid",
                                        description: "Hanya file JPG/PNG yang diperbolehkan",
                                        variant: "destructive",
                                      });
                                      e.target.value = "";
                                      return;
                                    }
                                    setLogoFile(file);
                                  }
                                }}
                                data-testid="input-logo-file"
                                className="cursor-pointer"
                              />
                            </div>
                            {logoFile && (
                              <div className="flex-shrink-0 w-16 h-16 border-2 border-border rounded-lg overflow-hidden bg-muted">
                                <img 
                                  src={URL.createObjectURL(logoFile)} 
                                  alt="Logo preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Format: JPG/PNG, Ukuran maksimal: 1MB
                            {logoFile && (
                              <span className="text-foreground font-medium ml-2 inline-flex items-center gap-2">
                                ✓ {logoFile.name} ({(logoFile.size / 1024).toFixed(0)} KB)
                                <button
                                  type="button"
                                  onClick={() => setLogoFile(null)}
                                  className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                                  aria-label="Hapus file"
                                  data-testid="button-remove-logo"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <FormLabel>Upload Dokumen Legalitas *</FormLabel>
                        <div className="mt-2">
                          <Input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Validate file size (max 2MB)
                                if (file.size > 2 * 1024 * 1024) {
                                  toast({
                                    title: "File terlalu besar",
                                    description: "Ukuran dokumen maksimal 2MB",
                                    variant: "destructive",
                                  });
                                  e.target.value = "";
                                  return;
                                }
                                // Validate file type
                                if (file.type !== 'application/pdf') {
                                  toast({
                                    title: "Format file tidak valid",
                                    description: "Hanya file PDF yang diperbolehkan",
                                    variant: "destructive",
                                  });
                                  e.target.value = "";
                                  return;
                                }
                                setLegalDocFile(file);
                              }
                            }}
                            data-testid="input-legal-doc-file"
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            SIUP/NIB/TDP, Format: PDF, Ukuran maksimal: 2MB
                            {legalDocFile && (
                              <span className="text-foreground font-medium ml-2 inline-flex items-center gap-2">
                                ✓ {legalDocFile.name} ({(legalDocFile.size / 1024).toFixed(0)} KB)
                                <button
                                  type="button"
                                  onClick={() => setLegalDocFile(null)}
                                  className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                                  aria-label="Hapus file"
                                  data-testid="button-remove-legal-doc"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="w-full"
                      disabled={isUploading}
                      data-testid="button-back-step-3"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-full btn-cta-primary" 
                      disabled={isUploading}
                      data-testid="button-next-step-3"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mengupload dokumen...
                        </>
                      ) : (
                        <>
                          Lanjutkan ke Pilih Paket
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Pilih Paket */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="heading-2 text-heading mb-2">Pilih Paket Layanan</h2>
              <p className="body-base text-muted-foreground">
                Pilih paket yang sesuai dengan kebutuhan perusahaan Anda
              </p>
              
              {/* Billing Cycle Toggle */}
              <div className="inline-flex items-center gap-2 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === "monthly"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="button-billing-monthly"
                >
                  Bulanan
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === "yearly"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid="button-billing-yearly"
                >
                  Tahunan
                  <span className="ml-1 text-xs text-primary font-semibold">Hemat 2 Bulan!</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                
                return (
                  <Card 
                    key={plan.id}
                    className={`relative cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-2 border-foreground shadow-lg' 
                        : 'hover:border-muted-foreground'
                    } ${plan.isPopular ? 'border-primary/50' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                    data-testid={`plan-${plan.id}`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                          {plan.badge}
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center space-y-4 pt-8">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-foreground inline-flex items-center gap-2">
                          {plan.name}
                          {plan.hasVerifiedBadge && (
                            <BadgeCheck className="w-6 h-6 text-primary" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{plan.tagline}</p>
                      </div>
                      <div className="pt-4">
                        {typeof (billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly) === 'number' ? (
                          <>
                            <div className="text-3xl font-bold text-foreground">
                              {(billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly) === 0 
                                ? 'Rp 0' 
                                : `Rp ${((billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly) as number).toLocaleString('id-ID')}`
                              }
                            </div>
                            <div className="text-sm text-muted-foreground">
                              per {billingCycle === "monthly" ? "bulan" : "tahun"}
                            </div>
                            {billingCycle === "yearly" && plan.priceYearly !== 0 && (
                              <div className="text-xs text-primary font-medium mt-1">
                                ~Rp {Math.floor((plan.priceYearly as number) / 12).toLocaleString('id-ID')}/bulan
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-2xl font-bold text-foreground">
                            {billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className={`h-5 w-5 flex-shrink-0 ${
                              feature.included ? 'text-foreground' : 'text-muted-foreground opacity-30'
                            }`} />
                            <span className={`text-sm ${
                              feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
                            }`}>
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className={`w-full ${isSelected ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan.id);
                        }}
                        data-testid={`button-select-${plan.id}`}
                      >
                        {isSelected ? 'Terpilih' : 'Pilih Paket'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="w-full"
                data-testid="button-back-step-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <Button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full btn-cta-primary"
                data-testid="button-complete-registration"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  <>
                    Selesaikan Registrasi
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="body-small text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login">
              <a className="text-foreground hover:underline font-medium">Masuk di sini</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
