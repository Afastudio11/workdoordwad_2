import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit2, Save, X, Shield, Lock, Bell, User, Mail, Phone, MapPin, Calendar, Briefcase, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const accountSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Password minimal 8 karakter"),
  newPassword: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string().min(8, "Password minimal 8 karakter"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

const preferencesSchema = z.object({
  preferredIndustries: z.array(z.string()).optional(),
  preferredLocations: z.array(z.string()).optional(),
  preferredJobTypes: z.array(z.string()).optional(),
  expectedSalaryMin: z.number().optional(),
});

type AccountForm = z.infer<typeof accountSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
type PreferencesForm = z.infer<typeof preferencesSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState<number>(0);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  const accountForm = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      city: "",
      province: "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile) {
      const p = profile as any;
      accountForm.reset({
        fullName: p.fullName || "",
        email: p.email || "",
        phone: p.phone || "",
        dateOfBirth: p.dateOfBirth || "",
        gender: p.gender || "",
        address: p.address || "",
        city: p.city || "",
        province: p.province || "",
      });
    }
  }, [profile, accountForm]);

  const updateAccountMutation = useMutation({
    mutationFn: async (data: AccountForm) => {
      const res = await apiRequest("/api/profile", "PUT", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Informasi akun berhasil diperbarui" });
      setIsEditingAccount(false);
    },
    onError: () => {
      toast({ title: "Gagal memperbarui informasi akun", variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordForm) => {
      const res = await apiRequest("/api/auth/change-password", "POST", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Password berhasil diubah" });
      setIsChangingPassword(false);
      passwordForm.reset();
    },
    onError: () => {
      toast({ title: "Gagal mengubah password", variant: "destructive" });
    },
  });

  const onSubmitAccount = (data: AccountForm) => {
    updateAccountMutation.mutate(data);
  };

  const onSubmitPassword = (data: PasswordForm) => {
    changePasswordMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
          Pengaturan Akun
        </h1>
        <p className="text-gray-600 mt-1">
          Kelola informasi akun dan preferensi keamanan Anda
        </p>
      </div>

      <div className="space-y-6">
          {/* Account Information */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informasi Akun
                  </CardTitle>
                  <CardDescription className="text-gray-600">Data pribadi dan kontak Anda</CardDescription>
                </div>
                {!isEditingAccount && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingAccount(true)}
                    data-testid="button-edit-account"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Ubah
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingAccount ? (
                <Form {...accountForm}>
                  <form onSubmit={accountForm.handleSubmit(onSubmitAccount)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={accountForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-fullname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tanggal Lahir</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" data-testid="input-dob" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jenis Kelamin</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-gender">
                                  <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Laki-laki</SelectItem>
                                <SelectItem value="female">Perempuan</SelectItem>
                                <SelectItem value="other">Lainnya</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kota</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={accountForm.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provinsi</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-province" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={accountForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat Lengkap</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={2} data-testid="textarea-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingAccount(false)}
                        data-testid="button-cancel-account"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button type="submit" data-testid="button-save-account">
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Nama Lengkap</p>
                        <p className="font-medium text-gray-900 mt-1" data-testid="text-fullname-display">
                          {(profile as any)?.fullName || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900 mt-1" data-testid="text-email-display">
                          {(profile as any)?.email || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Nomor Telepon</p>
                        <p className="font-medium text-gray-900 mt-1" data-testid="text-phone-display">
                          {(profile as any)?.phone || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Lahir</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {(profile as any)?.dateOfBirth || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Jenis Kelamin</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {(profile as any)?.gender === 'male' ? 'Laki-laki' : (profile as any)?.gender === 'female' ? 'Perempuan' : (profile as any)?.gender === 'other' ? 'Lainnya' : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Kota / Provinsi</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {(profile as any)?.city && (profile as any)?.province ? `${(profile as any).city}, ${(profile as any).province}` : (profile as any)?.city || (profile as any)?.province || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {(profile as any)?.address && (
                    <div className="flex items-start gap-3 pt-2">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Alamat Lengkap</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {(profile as any).address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password & Security */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Keamanan & Password
                  </CardTitle>
                  <CardDescription className="text-gray-600">Ubah password dan kelola keamanan akun</CardDescription>
                </div>
                {!isChangingPassword && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangingPassword(true)}
                    data-testid="button-change-password"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Ubah Password
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isChangingPassword ? (
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Saat Ini</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" data-testid="input-current-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Baru</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" data-testid="input-new-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Konfirmasi Password Baru</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" data-testid="input-confirm-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          passwordForm.reset();
                        }}
                        data-testid="button-cancel-password"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button type="submit" data-testid="button-save-password">
                        <Save className="w-4 h-4 mr-2" />
                        Ubah Password
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="flex items-center gap-3">
                  <Shield className="w-12 h-12 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Password Anda aman</p>
                    <p className="text-sm text-gray-600">Terakhir diubah 30 hari yang lalu</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifikasi
              </CardTitle>
              <CardDescription className="text-gray-600">Kelola preferensi notifikasi email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Notifikasi Email</p>
                  <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  data-testid="switch-email-notifications"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Alert Lowongan Baru</p>
                  <p className="text-sm text-gray-600">Dapatkan notifikasi lowongan yang sesuai preferensi</p>
                </div>
                <Switch
                  checked={jobAlerts}
                  onCheckedChange={setJobAlerts}
                  data-testid="switch-job-alerts"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Update Status Lamaran</p>
                  <p className="text-sm text-gray-600">Dapatkan update saat status lamaran berubah</p>
                </div>
                <Switch
                  checked={applicationUpdates}
                  onCheckedChange={setApplicationUpdates}
                  data-testid="switch-application-updates"
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Preferences */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Preferensi Pekerjaan
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Atur preferensi untuk mendapatkan rekomendasi lowongan yang sesuai
                  </CardDescription>
                </div>
                {!isEditingPreferences && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingPreferences(true);
                      const p = profile as any;
                      setSelectedIndustries(p?.preferredIndustries || []);
                      setSelectedLocations(p?.preferredLocations || []);
                      setSelectedJobTypes(p?.preferredJobTypes || []);
                      setMinSalary(p?.expectedSalaryMin || 0);
                    }}
                    data-testid="button-edit-preferences"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Ubah
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingPreferences ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Industri yang Diminati
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['Teknologi', 'Keuangan', 'Kesehatan', 'Pendidikan', 'Retail', 'Manufaktur', 'Pariwisata', 'Media'].map((industry) => (
                        <button
                          key={industry}
                          type="button"
                          onClick={() => {
                            if (selectedIndustries.includes(industry)) {
                              setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
                            } else {
                              setSelectedIndustries([...selectedIndustries, industry]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedIndustries.includes(industry)
                              ? 'bg-[#D4FF00] text-gray-900 border-2 border-[#D4FF00]'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                          }`}
                          data-testid={`button-industry-${industry.toLowerCase()}`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Lokasi yang Diminati
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali', 'Semarang', 'Medan', 'Remote'].map((location) => (
                        <button
                          key={location}
                          type="button"
                          onClick={() => {
                            if (selectedLocations.includes(location)) {
                              setSelectedLocations(selectedLocations.filter(l => l !== location));
                            } else {
                              setSelectedLocations([...selectedLocations, location]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedLocations.includes(location)
                              ? 'bg-[#D4FF00] text-gray-900 border-2 border-[#D4FF00]'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                          }`}
                          data-testid={`button-location-${location.toLowerCase()}`}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Tipe Pekerjaan
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['Full Time', 'Part Time', 'Contract', 'Freelance'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            if (selectedJobTypes.includes(type)) {
                              setSelectedJobTypes(selectedJobTypes.filter(t => t !== type));
                            } else {
                              setSelectedJobTypes([...selectedJobTypes, type]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedJobTypes.includes(type)
                              ? 'bg-[#D4FF00] text-gray-900 border-2 border-[#D4FF00]'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                          }`}
                          data-testid={`button-jobtype-${type.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="min-salary" className="block text-sm font-medium text-gray-900 mb-2">
                      Gaji Minimum yang Diharapkan (Rp)
                    </label>
                    <Input
                      id="min-salary"
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(Number(e.target.value))}
                      placeholder="Contoh: 5000000"
                      min="0"
                      step="500000"
                      data-testid="input-min-salary"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingPreferences(false);
                        setSelectedIndustries([]);
                        setSelectedLocations([]);
                        setSelectedJobTypes([]);
                        setMinSalary(0);
                      }}
                      data-testid="button-cancel-preferences"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Batal
                    </Button>
                    <Button
                      onClick={async () => {
                        try {
                          const res = await apiRequest("/api/profile/preferences", "PUT", {
                            preferredIndustries: selectedIndustries,
                            preferredLocations: selectedLocations,
                            preferredJobTypes: selectedJobTypes,
                            expectedSalaryMin: minSalary,
                          });
                          await res.json();
                          queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
                          queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
                          toast({ title: "Preferensi pekerjaan berhasil diperbarui" });
                          setIsEditingPreferences(false);
                        } catch (error) {
                          toast({ title: "Gagal memperbarui preferensi", variant: "destructive" });
                        }
                      }}
                      data-testid="button-save-preferences"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Preferensi
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Industri yang Diminati</p>
                    {(profile as any)?.preferredIndustries && (profile as any).preferredIndustries.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(profile as any).preferredIndustries.map((industry: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#D4FF00]/20 text-gray-900 rounded-full text-sm border border-[#D4FF00]/30"
                            data-testid={`text-industry-${index}`}
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Belum diatur</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Lokasi yang Diminati</p>
                    {(profile as any)?.preferredLocations && (profile as any).preferredLocations.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(profile as any).preferredLocations.map((location: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#D4FF00]/20 text-gray-900 rounded-full text-sm border border-[#D4FF00]/30"
                            data-testid={`text-location-pref-${index}`}
                          >
                            {location}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Belum diatur</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tipe Pekerjaan</p>
                    {(profile as any)?.preferredJobTypes && (profile as any).preferredJobTypes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(profile as any).preferredJobTypes.map((type: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#D4FF00]/20 text-gray-900 rounded-full text-sm border border-[#D4FF00]/30"
                            data-testid={`text-jobtype-${index}`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Belum diatur</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Gaji Minimum yang Diharapkan</p>
                    <p className="font-medium text-gray-900" data-testid="text-min-salary-display">
                      {(profile as any)?.expectedSalaryMin
                        ? `Rp ${((profile as any).expectedSalaryMin / 1000000).toFixed(1)} juta`
                        : 'Belum diatur'}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      💡 <strong>Tips:</strong> Lengkapi preferensi Anda untuk mendapatkan rekomendasi lowongan yang lebih sesuai dengan keinginan Anda.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
