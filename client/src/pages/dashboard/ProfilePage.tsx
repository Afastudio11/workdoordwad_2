import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Upload, Plus, Trash2, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const profileSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
});

const educationItemSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startYear: z.string(),
  endYear: z.string(),
});

const experienceItemSchema = z.object({
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [educationList, setEducationList] = useState<z.infer<typeof educationItemSchema>[]>([]);
  const [experienceList, setExperienceList] = useState<z.infer<typeof experienceItemSchema>[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      bio: "",
      dateOfBirth: "",
      gender: undefined,
      address: "",
      city: "",
      province: "",
    },
  });

  // Hydrate form and state when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || undefined,
        address: profile.address || "",
        city: profile.city || "",
        province: profile.province || "",
      });

      // Hydrate skills
      if (profile.skills && Array.isArray(profile.skills)) {
        setSkills(profile.skills);
      }

      // Hydrate education
      if (profile.education) {
        try {
          const parsedEducation = JSON.parse(profile.education);
          if (Array.isArray(parsedEducation)) {
            setEducationList(parsedEducation);
          }
        } catch (e) {
          console.error("Failed to parse education:", e);
        }
      }

      // Hydrate experience
      if (profile.experience) {
        try {
          const parsedExperience = JSON.parse(profile.experience);
          if (Array.isArray(parsedExperience)) {
            setExperienceList(parsedExperience);
          }
        } catch (e) {
          console.error("Failed to parse experience:", e);
        }
      }
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      return await apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Profil berhasil diperbarui" });
      setIsEditingProfile(false);
    },
    onError: () => {
      toast({ title: "Gagal memperbarui profil", variant: "destructive" });
    },
  });

  const updateSkillsMutation = useMutation({
    mutationFn: async (skills: string[]) => {
      return await apiRequest("/api/profile/skills", {
        method: "PUT",
        body: JSON.stringify({ skills }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Skills berhasil diperbarui" });
    },
  });

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      updateSkillsMutation.mutate(updatedSkills);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = skills.filter(s => s !== skill);
    setSkills(updatedSkills);
    updateSkillsMutation.mutate(updatedSkills);
  };

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-muted rounded-lg"></div>
      <div className="h-64 bg-muted rounded-lg"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
          Profil & CV
        </h1>
        <p className="text-muted-foreground mt-1">
          Kelola informasi profil dan CV Anda
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>Data diri dan kontak Anda</CardDescription>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} data-testid="textarea-bio" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingProfile(false)}
                    data-testid="button-cancel-profile"
                  >
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
                  <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  <p className="font-medium text-foreground" data-testid="text-fullname-display">{profile?.fullName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground" data-testid="text-email-display">{profile?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                  <p className="font-medium text-foreground" data-testid="text-phone-display">{profile?.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                  <p className="font-medium text-foreground" data-testid="text-gender-display">
                    {profile?.gender === 'male' ? 'Laki-laki' : profile?.gender === 'female' ? 'Perempuan' : '-'}
                  </p>
                </div>
              </div>
              {profile?.bio && (
                <div>
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="font-medium text-foreground" data-testid="text-bio-display">{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CV</CardTitle>
          <CardDescription>Unggah CV Anda dalam format PDF atau DOCX (maks 5MB)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {profile?.cvUrl ? (
              <div className="flex-1 flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground" data-testid="text-cv-filename">
                    {profile.cvFileName || 'CV.pdf'}
                  </p>
                  <p className="text-sm text-muted-foreground">CV terupload</p>
                </div>
                <Button variant="outline" size="sm" data-testid="button-download-cv">
                  Download
                </Button>
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Belum ada CV terupload</p>
                <Button data-testid="button-upload-cv">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CV
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Keahlian</CardTitle>
          <CardDescription>Tambahkan keahlian yang Anda miliki</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Ketik keahlian..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              data-testid="input-skill"
            />
            <Button onClick={handleAddSkill} data-testid="button-add-skill">
              <Plus className="w-4 h-4 mr-2" />
              Tambah
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(profile?.skills || skills).map((skill: string, index: number) => (
              <div
                key={index}
                className="px-3 py-1.5 bg-primary/20 text-primary rounded-full flex items-center gap-2"
                data-testid={`badge-skill-${index}`}
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:opacity-80"
                  data-testid={`button-remove-skill-${index}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
