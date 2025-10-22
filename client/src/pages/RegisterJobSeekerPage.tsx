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

// Form schemas untuk setiap step
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
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().min(10, "Nomor telepon tidak valid"),
  dateOfBirth: z.string().min(1, "Tanggal lahir harus diisi"),
  gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Pilih jenis kelamin" }) }),
  city: z.string().min(1, "Kota harus diisi"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
});

const step3Schema = z.object({
  lastEducation: z.string().min(1, "Pendidikan terakhir harus dipilih"),
  major: z.string().min(1, "Jurusan harus diisi"),
  institution: z.string().min(1, "Nama institusi harus diisi"),
  graduationYear: z.string().min(4, "Tahun lulus harus diisi"),
  employmentStatus: z.string().min(1, "Status pekerjaan harus dipilih"),
  yearsOfExperience: z.string().min(1, "Pengalaman kerja harus dipilih"),
  cvUrl: z.string().optional(),
  photoUrl: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

const cities = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang",
  "Tangerang", "Depok", "Bekasi", "Bogor", "Batam", "Pekanbaru", "Bandar Lampung",
  "Yogyakarta", "Malang", "Denpasar", "Balikpapan", "Pontianak", "Manado"
];

export default function RegisterJobSeekerPage() {
  const [, navigate] = useState();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const steps = ["Informasi Akun", "Data Pribadi", "Pendidikan & Profesional"];

  // Step 1 Form
  const form1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      email: formData.email || "",
      password: formData.password || "",
      confirmPassword: formData.confirmPassword || "",
      agreeToTerms: formData.agreeToTerms || false,
    },
  });

  // Step 2 Form
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      fullName: formData.fullName || "",
      phone: formData.phone || "",
      dateOfBirth: formData.dateOfBirth || "",
      gender: formData.gender as "male" | "female" || undefined,
      city: formData.city || "",
      address: formData.address || "",
    },
  });

  // Step 3 Form
  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      lastEducation: formData.lastEducation || "",
      major: formData.major || "",
      institution: formData.institution || "",
      graduationYear: formData.graduationYear || "",
      employmentStatus: formData.employmentStatus || "",
      yearsOfExperience: formData.yearsOfExperience || "",
      cvUrl: formData.cvUrl || "",
      photoUrl: formData.photoUrl || "",
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
    const completeData = { ...formData, ...data };
    setFormData(completeData);
    setIsSubmitting(true);

    try {
      const response = await apiRequest("/api/auth/register", "POST", {
        username: completeData.email?.split('@')[0] || "",
        email: completeData.email,
        password: completeData.password,
        fullName: completeData.fullName,
        phone: completeData.phone,
        dateOfBirth: completeData.dateOfBirth,
        gender: completeData.gender,
        city: completeData.city,
        address: completeData.address,
        role: "pekerja",
        lastEducation: data.lastEducation,
        major: data.major,
        institution: data.institution,
        graduationYear: data.graduationYear,
        employmentStatus: data.employmentStatus,
        yearsOfExperience: data.yearsOfExperience,
        cvUrl: data.cvUrl,
        photoUrl: data.photoUrl,
      });

      if (response.ok) {
        setEmailSent(true);
        toast({
          title: "Registrasi Berhasil!",
          description: "Silakan cek email Anda untuk verifikasi akun.",
        });
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

  if (emailSent) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Header variant="dark" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="heading-2 text-heading">
                Verifikasi Email Anda
              </CardTitle>
              <CardDescription className="body-base mt-2">
                Kami telah mengirim link verifikasi ke email Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="body-base text-muted-foreground">
                Silakan cek inbox email <strong>{formData.email}</strong> dan klik link verifikasi untuk mengaktifkan akun Anda.
              </p>
              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outline" onClick={() => setEmailSent(false)}>
                  Kirim Ulang Email
                </Button>
                <Link href="/login">
                  <Button className="btn-cta-primary">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Sudah Verifikasi, Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            Daftar sebagai Pencari Kerja
          </h1>
          <p className="body-base text-muted-foreground">
            Isi data diri Anda untuk memulai
          </p>
        </div>

        <ProgressIndicator currentStep={currentStep} totalSteps={3} steps={steps} />

        {/* Step 1: Informasi Akun */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="heading-3">Informasi Akun</CardTitle>
              <CardDescription>Buat akun Anda dengan email dan password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form1}>
                <form onSubmit={form1.handleSubmit(handleStep1Submit)} className="space-y-6">
                  <FormField
                    control={form1.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="nama@email.com" {...field} data-testid="input-email" />
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
                            <Link href="/terms"><a className="text-primary hover:underline">Syarat & Ketentuan</a></Link>
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

        {/* Step 2: Data Pribadi */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="heading-3">Data Pribadi</CardTitle>
              <CardDescription>Lengkapi informasi pribadi Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form2}>
                <form onSubmit={form2.handleSubmit(handleStep2Submit)} className="space-y-6">
                  <FormField
                    control={form2.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama lengkap sesuai KTP" {...field} data-testid="input-fullname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form2.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon *</FormLabel>
                          <FormControl>
                            <Input placeholder="08xxxxxxxxxx" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Lahir *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-dob" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form2.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Kelamin *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-gender">
                                <SelectValue placeholder="Pilih jenis kelamin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Laki-laki</SelectItem>
                              <SelectItem value="female">Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form2.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kota Domisili *</FormLabel>
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
                  </div>

                  <FormField
                    control={form2.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Lengkap *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Alamat lengkap tempat tinggal" rows={3} {...field} data-testid="textarea-address" />
                        </FormControl>
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

        {/* Step 3: Pendidikan & Profesional */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="heading-3">Informasi Pendidikan & Profesional</CardTitle>
              <CardDescription>Lengkapi riwayat pendidikan dan pengalaman kerja Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form3}>
                <form onSubmit={form3.handleSubmit(handleStep3Submit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form3.control}
                      name="lastEducation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pendidikan Terakhir *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-education">
                                <SelectValue placeholder="Pilih pendidikan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                              <SelectItem value="D3">D3</SelectItem>
                              <SelectItem value="S1">S1</SelectItem>
                              <SelectItem value="S2">S2</SelectItem>
                              <SelectItem value="S3">S3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="major"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jurusan/Bidang Studi *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Teknik Informatika" {...field} data-testid="input-major" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form3.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Institusi/Universitas *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama sekolah/universitas" {...field} data-testid="input-institution" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="graduationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tahun Lulus *</FormLabel>
                          <FormControl>
                            <Input placeholder="2024" {...field} data-testid="input-graduation-year" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form3.control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status Pekerjaan Saat Ini *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-employment-status">
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Belum Bekerja">Belum Bekerja</SelectItem>
                              <SelectItem value="Bekerja - Mencari Peluang Baru">Bekerja - Mencari Peluang Baru</SelectItem>
                              <SelectItem value="Fresh Graduate">Fresh Graduate</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pengalaman Kerja *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-experience">
                                <SelectValue placeholder="Pilih pengalaman" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0 tahun">0 tahun</SelectItem>
                              <SelectItem value="<1 tahun">&lt;1 tahun</SelectItem>
                              <SelectItem value="1-3 tahun">1-3 tahun</SelectItem>
                              <SelectItem value="3-5 tahun">3-5 tahun</SelectItem>
                              <SelectItem value=">5 tahun">&gt;5 tahun</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <Label className="text-base">Opsional</Label>
                    
                    <FormField
                      control={form3.control}
                      name="cvUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload CV/Resume (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://drive.google.com/..." {...field} data-testid="input-cv-url" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">Masukkan link Google Drive, Dropbox, atau hosting lainnya (PDF, max 2MB)</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form3.control}
                      name="photoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Foto Profil (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} data-testid="input-photo-url" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">Masukkan link foto profil (JPG/PNG, max 1MB)</p>
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
                    <Button 
                      type="submit" 
                      className="w-full btn-cta-primary" 
                      disabled={isSubmitting}
                      data-testid="button-submit-registration"
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
                </form>
              </Form>
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
