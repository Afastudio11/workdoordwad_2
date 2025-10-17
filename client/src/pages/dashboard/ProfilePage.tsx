import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit2, Save, X, Plus, Trash2, Upload } from "lucide-react";
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
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      return await apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "Profil berhasil diperbarui" });
      setIsEditing(false);
    },
    onError: () => {
      toast({ title: "Gagal memperbarui profil", variant: "destructive" });
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Profil Saya
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola informasi profil Anda
          </p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            data-testid="button-edit-profile"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profil
          </Button>
        )}
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>Data diri dan kontak Anda</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
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

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
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
                  <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  <p className="font-medium text-foreground mt-1" data-testid="text-fullname-display">
                    {profile?.fullName || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground mt-1" data-testid="text-email-display">
                    {profile?.email || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                  <p className="font-medium text-foreground mt-1" data-testid="text-phone-display">
                    {profile?.phone || '-'}
                  </p>
                </div>
              </div>
              {profile?.bio && (
                <div>
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="font-medium text-foreground mt-1" data-testid="text-bio-display">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Upload */}
      <Card>
        <CardHeader>
          <CardTitle>CV / Resume</CardTitle>
          <CardDescription>Unggah CV Anda dalam format PDF (maks 5MB)</CardDescription>
        </CardHeader>
        <CardContent>
          {profile?.cvUrl ? (
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground" data-testid="text-cv-filename">
                    {profile.cvFileName || 'CV.pdf'}
                  </p>
                  <p className="text-sm text-muted-foreground">CV terupload</p>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid="button-download-cv">
                Download
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Belum ada CV terupload</p>
              <Button data-testid="button-upload-cv">
                <Upload className="w-4 h-4 mr-2" />
                Upload CV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
