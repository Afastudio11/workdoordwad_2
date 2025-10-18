import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Briefcase, MapPin, Calendar, Clock, Eye, CheckCircle, XCircle, Upload, FileText, Award, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
  reviewed: { label: "Ditinjau", color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400", icon: Eye },
  shortlisted: { label: "Diundang Interview", color: "bg-green-500/20 text-green-700 dark:text-green-400", icon: CheckCircle },
  rejected: { label: "Ditolak", color: "bg-destructive/20 text-destructive", icon: XCircle },
  accepted: { label: "Diterima", color: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400", icon: CheckCircle },
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const { data: applications, isLoading: isLoadingApplications } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/api/profile"],
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

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      const juta = (amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1);
      return `Rp ${juta} juta`;
    }
    if (amount >= 1000) {
      const ribu = (amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1);
      return `Rp ${ribu} ribu`;
    }
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

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
      <div className="min-h-screen bg-white">
        <DashboardPageHeader />
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
          Profile
        </h1>
        <p className="text-gray-600 mt-1">
          Kelola CV dan riwayat lamaran Anda
        </p>
      </div>

      <Tabs defaultValue="cv" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="cv" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900">
              <FileText className="w-4 h-4 mr-2" />
              CV
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900">
              <Award className="w-4 h-4 mr-2" />
              Keahlian
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-[#D4FF00] data-[state=active]:text-gray-900">
              <Briefcase className="w-4 h-4 mr-2" />
              Riwayat Lamaran
            </TabsTrigger>
          </TabsList>

          {/* CV Tab */}
          <TabsContent value="cv" className="space-y-6 mt-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">CV / Resume</CardTitle>
                <CardDescription className="text-gray-600">Unggah CV Anda dalam format PDF atau DOCX (maks 5MB)</CardDescription>
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
                    <CardDescription className="text-gray-600">Tambahkan keahlian dan kemampuan Anda</CardDescription>
                  </div>
                  {!isEditingSkills && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startEditingSkills}
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
                        <p className="text-sm text-gray-500 mt-1">Tambahkan keahlian untuk meningkatkan profil Anda</p>
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
                    Anda belum melamar ke lowongan manapun
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
