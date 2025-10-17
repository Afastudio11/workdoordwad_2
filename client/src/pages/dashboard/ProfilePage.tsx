import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit2, Save, X, Plus, Trash2, Upload, FileText, User, Briefcase, Award, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import DashboardPageHeader from "@/components/DashboardPageHeader";

const profileSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
});

const skillsSchema = z.object({
  skills: z.array(z.string()),
});

const preferencesSchema = z.object({
  preferredIndustries: z.array(z.string()).optional(),
  preferredLocations: z.array(z.string().min(1)).optional(),
  preferredJobTypes: z.array(z.string()).optional(),
  expectedSalaryMin: z.number().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;
type SkillsForm = z.infer<typeof skillsSchema>;
type PreferencesForm = z.infer<typeof preferencesSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newJobType, setNewJobType] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      bio: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      city: "",
      province: "",
    },
  });

  const skillsForm = useForm<SkillsForm>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [],
    },
  });

  const preferencesForm = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredIndustries: [],
      preferredLocations: [],
      preferredJobTypes: [],
      expectedSalaryMin: undefined,
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "",
        address: profile.address || "",
        city: profile.city || "",
        province: profile.province || "",
      });

      skillsForm.reset({
        skills: profile.skills || [],
      });

      preferencesForm.reset({
        preferredIndustries: profile.preferredIndustries || [],
        preferredLocations: profile.preferredLocations || [],
        preferredJobTypes: profile.preferredJobTypes || [],
        expectedSalaryMin: profile.expectedSalaryMin || undefined,
      });
    }
  }, [profile, profileForm, skillsForm, preferencesForm]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const res = await apiRequest("/api/profile", "PUT", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Profil berhasil diperbarui" });
      setIsEditingProfile(false);
    },
    onError: () => {
      toast({ title: "Gagal memperbarui profil", variant: "destructive" });
    },
  });

  const updateSkillsMutation = useMutation({
    mutationFn: async (data: SkillsForm) => {
      const res = await apiRequest("/api/profile/skills", "PUT", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Keahlian berhasil diperbarui" });
      setIsEditingSkills(false);
    },
    onError: () => {
      toast({ title: "Gagal memperbarui keahlian", variant: "destructive" });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: PreferencesForm) => {
      const res = await apiRequest("/api/profile/preferences", "PUT", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Preferensi berhasil diperbarui" });
      setIsEditingPreferences(false);
    },
    onError: () => {
      toast({ title: "Gagal memperbarui preferensi", variant: "destructive" });
    },
  });

  const onSubmitProfile = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const onSubmitSkills = (data: SkillsForm) => {
    updateSkillsMutation.mutate(data);
  };

  const onSubmitPreferences = (data: PreferencesForm) => {
    updatePreferencesMutation.mutate(data);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = skillsForm.getValues("skills");
      skillsForm.setValue("skills", [...currentSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = skillsForm.getValues("skills");
    skillsForm.setValue("skills", currentSkills.filter((_, i) => i !== index));
  };

  const addIndustry = () => {
    if (newIndustry.trim()) {
      const current = preferencesForm.getValues("preferredIndustries") || [];
      preferencesForm.setValue("preferredIndustries", [...current, newIndustry.trim()]);
      setNewIndustry("");
    }
  };

  const removeIndustry = (index: number) => {
    const current = preferencesForm.getValues("preferredIndustries") || [];
    preferencesForm.setValue("preferredIndustries", current.filter((_, i) => i !== index));
  };

  const addLocation = () => {
    if (newLocation.trim()) {
      const current = preferencesForm.getValues("preferredLocations") || [];
      preferencesForm.setValue("preferredLocations", [...current, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const removeLocation = (index: number) => {
    const current = preferencesForm.getValues("preferredLocations") || [];
    preferencesForm.setValue("preferredLocations", current.filter((_, i) => i !== index));
  };

  const addJobType = () => {
    if (newJobType) {
      const current = preferencesForm.getValues("preferredJobTypes") || [];
      if (!current.includes(newJobType)) {
        preferencesForm.setValue("preferredJobTypes", [...current, newJobType]);
      }
      setNewJobType("");
    }
  };

  const removeJobType = (index: number) => {
    const current = preferencesForm.getValues("preferredJobTypes") || [];
    preferencesForm.setValue("preferredJobTypes", current.filter((_, i) => i !== index));
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
    <div className="min-h-screen bg-white">
      <DashboardPageHeader />
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
              Profil Saya
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola informasi profil dan preferensi Anda
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="cv" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900">
              <FileText className="w-4 h-4 mr-2" />
              CV
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900">
              <Award className="w-4 h-4 mr-2" />
              Keahlian
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900">
              <Settings className="w-4 h-4 mr-2" />
              Preferensi
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Informasi Pribadi</CardTitle>
                  <CardDescription className="text-gray-600">Data diri dan kontak Anda</CardDescription>
                </div>
                {!isEditingProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                    data-testid="button-edit-profile"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingProfile ? (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
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
                        control={profileForm.control}
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
                        control={profileForm.control}
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
                        control={profileForm.control}
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
                        control={profileForm.control}
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
                        control={profileForm.control}
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
                        control={profileForm.control}
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
                      control={profileForm.control}
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

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} data-testid="textarea-bio" placeholder="Ceritakan tentang diri Anda..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                        data-testid="button-cancel-profile"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button type="submit" data-testid="button-save-profile">
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nama Lengkap</p>
                      <p className="font-medium text-gray-900 mt-1" data-testid="text-fullname-display">
                        {profile?.fullName || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900 mt-1" data-testid="text-email-display">
                        {profile?.email || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nomor Telepon</p>
                      <p className="font-medium text-gray-900 mt-1" data-testid="text-phone-display">
                        {profile?.phone || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Lahir</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {profile?.dateOfBirth || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jenis Kelamin</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {profile?.gender === 'male' ? 'Laki-laki' : profile?.gender === 'female' ? 'Perempuan' : profile?.gender === 'other' ? 'Lainnya' : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kota</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {profile?.city || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Provinsi</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {profile?.province || '-'}
                      </p>
                    </div>
                  </div>
                  {profile?.address && (
                    <div>
                      <p className="text-sm text-gray-600">Alamat</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {profile.address}
                      </p>
                    </div>
                  )}
                  {profile?.bio && (
                    <div>
                      <p className="text-sm text-gray-600">Bio</p>
                      <p className="font-medium text-gray-900 mt-1" data-testid="text-bio-display">
                        {profile.bio}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CV Tab */}
        <TabsContent value="cv" className="space-y-6 mt-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">CV / Resume</CardTitle>
              <CardDescription className="text-gray-600">Unggah CV Anda dalam format PDF atau DOCX (maks 5MB)</CardDescription>
            </CardHeader>
            <CardContent>
              {profile?.cvUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#D4FF00]/10 rounded-lg border border-[#D4FF00]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#D4FF00] rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-900" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900" data-testid="text-cv-filename">
                          {profile.cvFileName || 'CV.pdf'}
                        </p>
                        <p className="text-sm text-gray-600">CV terupload</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-download-cv">
                        Download
                      </Button>
                      <Button variant="outline" size="sm" data-testid="button-replace-cv">
                        Ganti CV
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    💡 CV Anda akan otomatis dilampirkan saat menggunakan fitur Quick Apply
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Belum ada CV terupload</p>
                  <p className="text-sm text-gray-600 mb-6">
                    Upload CV Anda untuk menggunakan fitur Quick Apply dan meningkatkan peluang diterima
                  </p>
                  <Button data-testid="button-upload-cv">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CV
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6 mt-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Keahlian</CardTitle>
                  <CardDescription className="text-gray-600">Tambahkan keahlian yang Anda kuasai</CardDescription>
                </div>
                {!isEditingSkills && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingSkills(true)}
                    data-testid="button-edit-skills"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingSkills ? (
                <Form {...skillsForm}>
                  <form onSubmit={skillsForm.handleSubmit(onSubmitSkills)} className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tambah keahlian baru (e.g., JavaScript, Design Thinking)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        data-testid="input-new-skill"
                      />
                      <Button type="button" onClick={addSkill} data-testid="button-add-skill">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skillsForm.watch("skills")?.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="pl-3 pr-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="ml-2 hover:text-destructive"
                            data-testid={`button-remove-skill-${index}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingSkills(false)}
                        data-testid="button-cancel-skills"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button type="submit" data-testid="button-save-skills">
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div>
                  {profile?.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">
                      Belum ada keahlian ditambahkan
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Preferensi Pekerjaan</CardTitle>
                  <CardDescription className="text-gray-600">Atur preferensi untuk mendapatkan rekomendasi yang lebih sesuai</CardDescription>
                </div>
                {!isEditingPreferences && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingPreferences(true)}
                    data-testid="button-edit-preferences"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingPreferences ? (
                <Form {...preferencesForm}>
                  <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)} className="space-y-6">
                    {/* Industries */}
                    <div>
                      <FormLabel>Industri yang Diminati</FormLabel>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Tambah industri (e.g., Teknologi, Kesehatan)"
                          value={newIndustry}
                          onChange={(e) => setNewIndustry(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
                          data-testid="input-new-industry"
                        />
                        <Button type="button" onClick={addIndustry} data-testid="button-add-industry">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {preferencesForm.watch("preferredIndustries")?.map((industry, index) => (
                          <Badge key={index} variant="secondary" className="pl-3 pr-1">
                            {industry}
                            <button
                              type="button"
                              onClick={() => removeIndustry(index)}
                              className="ml-2 hover:text-destructive"
                              data-testid={`button-remove-industry-${index}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Locations */}
                    <div>
                      <FormLabel>Lokasi yang Diminati</FormLabel>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Tambah lokasi (e.g., Jakarta, Bandung)"
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                          data-testid="input-new-location"
                        />
                        <Button type="button" onClick={addLocation} data-testid="button-add-location">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {preferencesForm.watch("preferredLocations")?.map((location, index) => (
                          <Badge key={index} variant="secondary" className="pl-3 pr-1">
                            {location}
                            <button
                              type="button"
                              onClick={() => removeLocation(index)}
                              className="ml-2 hover:text-destructive"
                              data-testid={`button-remove-location-${index}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Job Types */}
                    <div>
                      <FormLabel>Jenis Pekerjaan</FormLabel>
                      <div className="flex gap-2 mt-2">
                        <Select value={newJobType} onValueChange={setNewJobType}>
                          <SelectTrigger data-testid="select-job-type">
                            <SelectValue placeholder="Pilih jenis pekerjaan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-time">Full Time</SelectItem>
                            <SelectItem value="part-time">Part Time</SelectItem>
                            <SelectItem value="contract">Kontrak</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button type="button" onClick={addJobType} data-testid="button-add-job-type">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {preferencesForm.watch("preferredJobTypes")?.map((jobType, index) => (
                          <Badge key={index} variant="secondary" className="pl-3 pr-1">
                            {jobType === 'full-time' ? 'Full Time' : jobType === 'part-time' ? 'Part Time' : jobType === 'contract' ? 'Kontrak' : 'Freelance'}
                            <button
                              type="button"
                              onClick={() => removeJobType(index)}
                              className="ml-2 hover:text-destructive"
                              data-testid={`button-remove-job-type-${index}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Expected Salary */}
                    <FormField
                      control={preferencesForm.control}
                      name="expectedSalaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ekspektasi Gaji Minimal (Rp)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="e.g., 8000000"
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              value={field.value || ''}
                              data-testid="input-salary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingPreferences(false)}
                        data-testid="button-cancel-preferences"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button type="submit" data-testid="button-save-preferences">
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Industri yang Diminati</p>
                    {profile?.preferredIndustries && profile.preferredIndustries.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredIndustries.map((industry, index) => (
                          <Badge key={index} variant="secondary">{industry}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Belum ada industri dipilih</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Lokasi yang Diminati</p>
                    {profile?.preferredLocations && profile.preferredLocations.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredLocations.map((location, index) => (
                          <Badge key={index} variant="secondary">{location}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Belum ada lokasi dipilih</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Jenis Pekerjaan</p>
                    {profile?.preferredJobTypes && profile.preferredJobTypes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredJobTypes.map((jobType, index) => (
                          <Badge key={index} variant="secondary">
                            {jobType === 'full-time' ? 'Full Time' : jobType === 'part-time' ? 'Part Time' : jobType === 'contract' ? 'Kontrak' : 'Freelance'}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Belum ada jenis pekerjaan dipilih</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Ekspektasi Gaji Minimal</p>
                    <p className="text-gray-900 font-medium">
                      {profile?.expectedSalaryMin ? `Rp ${profile.expectedSalaryMin.toLocaleString('id-ID')}` : 'Belum diatur'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
