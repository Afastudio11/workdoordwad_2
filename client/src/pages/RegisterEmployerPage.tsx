import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Loader2, Mail, CheckCircle2 } from "lucide-react";
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
  password: z.string().min(8, "Password minimal 8 karakter").regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Password harus kombinasi huruf dan angka"),
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
  logo: z.string().optional(),
  legalDocUrl: z.string().optional(),
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

export default function RegisterEmployerPage() {
  const [, navigate] = useState();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      logo: formData.logo || "",
      legalDocUrl: formData.legalDocUrl || "",
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

  const handleStep3Submit = (data: Step3Data) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(4);
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
                          <Input type="email" placeholder="hr@perusahaan.com" {...field} data-testid="input-email" />
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
                          <Input type="password" placeholder="Minimal 8 karakter" {...field} data-testid="input-password" />
                        </FormControl>
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
                          <Input type="password" placeholder="Ulangi password" {...field} data-testid="input-confirm-password" />
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
                            <Link href="/terms" className="text-primary hover:underline">Syarat & Ketentuan</Link>
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
                    <Label className="text-base">Opsional</Label>
                    
                    <FormField
                      control={form3.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Logo Perusahaan (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} data-testid="input-logo-url" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">JPG/PNG, max 1MB</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="legalDocUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Dokumen Legalitas (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://drive.google.com/..." {...field} data-testid="input-legal-doc-url" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">SIUP/NIB/TDP (PDF, max 2MB)</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="w-full"
                      data-testid="button-back-step-3"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali
                    </Button>
                    <Button type="submit" className="w-full btn-cta-primary" data-testid="button-next-step-3">
                      Lanjutkan ke Pilih Paket
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Pilih Paket - This will redirect to PricingPage */}
        {currentStep === 4 && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="heading-2">Pilih Paket Layanan</CardTitle>
              <CardDescription className="text-base mt-2">
                Anda akan diarahkan ke halaman pemilihan paket
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Link href={`/pricing?userData=${encodeURIComponent(JSON.stringify({...formData, role: 'pemberi_kerja'}))}`}>
                <Button className="btn-cta-primary" data-testid="button-to-pricing">
                  Lihat Paket Layanan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(3)}
                className="mt-4"
                data-testid="button-back-step-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-6">
          <p className="body-small text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login">
              <a className="text-primary hover:underline font-medium">Masuk di sini</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
