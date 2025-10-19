import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Briefcase, MapPin, Calendar, Clock, Eye, CheckCircle, XCircle, Upload, FileText, Award, Plus, Trash2, Edit2, Save, X, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatSalary } from "@/lib/formatters";

interface Application {
  id: string;
  jobId: string;
  status: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    salaryMin: number | null;
    salaryMax: number | null;
    company: {
      name: string;
    };
  };
}

const statusConfig = {
  submitted: { label: "Terkirim", color: "bg-primary/20 text-primary", icon: Clock },
  reviewed: { label: "Ditinjau", color: "bg-yellow-500/20 text-yellow-700", icon: Eye },
  shortlisted: { label: "Diundang Interview", color: "bg-green-500/20 text-green-700", icon: CheckCircle },
  rejected: { label: "Ditolak", color: "bg-destructive/20 text-destructive", icon: XCircle },
  accepted: { label: "Diterima", color: "bg-emerald-500/20 text-emerald-700", icon: CheckCircle },
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isUploadingCV, setIsUploadingCV] = useState(false);

  const { data: applications, isLoading: isLoadingApplications, isError: isErrorApplications, error: errorApplications } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const { data: profile, isLoading: isLoadingProfile, isError: isErrorProfile, error: errorProfile } = useQuery({
    queryKey: ["/api/profile"],
  });

  const uploadCVMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("cv", file);
      
      const response = await fetch("/api/profile/upload-cv", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload CV");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({ title: "CV berhasil diunggah" });
      setIsUploadingCV(false);
    },
    onError: (error: Error) => {
      toast({ title: "Gagal mengunggah CV", description: error.message, variant: "destructive" });
      setIsUploadingCV(false);
    },
  });

  const updateSkillsMutation = useMutation({
    mutationFn: async (data: { skills: string[] }) => {
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

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const saveSkills = () => {
    updateSkillsMutation.mutate({ skills });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingCV(true);
      uploadCVMutation.mutate(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('cv-upload-input')?.click();
  };

  const startEditingSkills = () => {
    setSkills((profile as any)?.skills || []);
    setIsEditingSkills(true);
  };

  const cancelEditingSkills = () => {
    setSkills([]);
    setIsEditingSkills(false);
  };

  if (isLoadingApplications || isLoadingProfile) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (isErrorProfile || isErrorApplications) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-page-title">
            Profil
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Kelola CV dan riwayat lamaran kamu
          </p>
        </div>

        <Alert variant="destructive" data-testid="error-alert">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            <p>
              {isErrorProfile 
                ? ((errorProfile as any)?.message || "Gagal memuat profil. Silakan coba lagi.")
                : ((errorApplications as any)?.message || "Gagal memuat data lamaran. Silakan coba lagi.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
                  queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
                }}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                data-testid="button-retry"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-page-title">
          Profil
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Kelola CV dan riwayat lamaran kamu
        </p>
      </div>

      <Tabs defaultValue="cv" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 h-auto">
            <TabsTrigger value="cv" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900 text-xs sm:text-sm py-2 sm:py-3">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">CV</span>
              <span className="xs:hidden">CV</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900 text-xs sm:text-sm py-2 sm:py-3">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Keahlian</span>
              <span className="xs:hidden">Skill</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900 text-xs sm:text-sm py-2 sm:py-3">
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Riwayat Lamaran</span>
              <span className="sm:hidden">Lamaran</span>
            </TabsTrigger>
          </TabsList>

          {/* CV Tab */}
          <TabsContent value="cv" className="space-y-6 mt-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">CV / Resume</CardTitle>
                <CardDescription className="text-gray-600">Unggah CV kamu dalam format PDF atau DOCX (maks 5MB)</CardDescription>
              </CardHeader>
              <CardContent>
                {(profile as any)?.cvUrl ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#D4FF00]/10 rounded-lg border border-[#D4FF00]/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#D4FF00] rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-900" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" data-testid="text-cv-filename">
                            {(profile as any)?.cvFileName || 'CV.pdf'}
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
                      💡 CV kamu akan otomatis dilampirkan saat menggunakan fitur Lamar Cepat
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Belum ada CV terupload</p>
                    <p className="text-sm text-gray-600 mb-6">
                      Unggah CV kamu untuk menggunakan fitur Lamar Cepat dan meningkatkan peluang diterima
                    </p>
                    <input
                      type="file"
                      id="cv-upload-input"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Button onClick={triggerFileInput} disabled={isUploadingCV} data-testid="button-upload-cv">
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploadingCV ? "Mengunggah..." : "Unggah CV"}
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
                    <CardDescription className="text-gray-600">Tambahkan keahlian dan kemampuan kamu</CardDescription>
                  </div>
                  {!isEditingSkills && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startEditingSkills}
                      data-testid="button-edit-skills"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Ubah
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditingSkills ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Masukkan keahlian (contoh: JavaScript, Project Management)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        data-testid="input-new-skill"
                      />
                      <Button onClick={addSkill} type="button" data-testid="button-add-skill">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-2 bg-[#D4FF00]/20 text-gray-900 border border-[#D4FF00]/30"
                            data-testid={`badge-skill-${index}`}
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(index)}
                              className="ml-2 hover:text-red-600"
                              data-testid={`button-remove-skill-${index}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Belum ada keahlian ditambahkan</p>
                    )}

                    <div className="flex gap-2 justify-end pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditingSkills}
                        data-testid="button-cancel-skills"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Batal
                      </Button>
                      <Button onClick={saveSkills} data-testid="button-save-skills">
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {(profile as any)?.skills && (profile as any).skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {(profile as any).skills.map((skill: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-2 bg-[#D4FF00]/20 text-gray-900 border border-[#D4FF00]/30"
                            data-testid={`badge-skill-display-${index}`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Belum ada keahlian ditambahkan</p>
                        <p className="text-sm text-gray-500 mt-1">Tambahkan keahlian untuk meningkatkan profil kamu</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6 mt-6">
            {!applications || applications.length === 0 ? (
              <Card className="bg-white border-gray-200">
                <CardContent className="text-center py-16">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Belum Ada Lamaran
                  </h3>
                  <p className="text-gray-600 mb-6">
                    kamu belum melamar ke lowongan manapun
                  </p>
                  <Button asChild>
                    <a href="/jobs">Cari Lowongan</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    {applications.length} lamaran aktif
                  </p>
                </div>

                <div className="space-y-4">
                  {applications.map((application, index) => {
                    const status = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.submitted;
                    const StatusIcon = status.icon;

                    return (
                      <Card key={application.id} data-testid={`card-application-${index}`}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-4 mb-3">
                                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1" data-testid={`text-job-title-${index}`}>
                                    {application.job.title}
                                  </h3>
                                  <p className="text-gray-600" data-testid={`text-company-${index}`}>
                                    {application.job.company.name}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-16">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span data-testid={`text-location-${index}`}>{application.job.location}</span>
                                </div>
                                {application.job.salaryMin && application.job.salaryMax && (
                                  <div className="flex items-center gap-1">
                                    <span data-testid={`text-salary-${index}`}>
                                      {formatSalary(application.job.salaryMin)} - {formatSalary(application.job.salaryMax)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span data-testid={`text-date-${index}`}>
                                    {format(new Date(application.createdAt), 'd MMM yyyy', { locale: idLocale })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end gap-3 ml-16 md:ml-0">
                              <Badge className={`${status.color} border-0`} data-testid={`badge-status-${index}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                              <Button variant="outline" size="sm" data-testid={`button-view-${index}`}>
                                Lihat Detail
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
    </div>
  );
}
