import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Filter, User, Loader2, FileText, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Application, User as UserType, Job, Company } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ApplicationWithDetails = Application & {
  user: UserType;
  job: Job & { company: Company };
};

export default function ManageApplicantsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicationWithDetails | null>(null);

  const { data: applications = [], isLoading } = useQuery<ApplicationWithDetails[]>({
    queryKey: ["/api/employer/applications"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      const res = await apiRequest(`/api/applications/${applicationId}/status`, "PUT", {
        status,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/applications"] });
    },
  });

  // Get unique jobs for filter
  const uniqueJobs = Array.from(
    new Map(applications.map((app) => [app.job.id, app.job])).values()
  );

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.user.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.jobId === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200";
      case "reviewed":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200";
      case "shortlisted":
        return "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200";
      case "accepted":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "submitted":
        return "Baru";
      case "reviewed":
        return "Ditinjau";
      case "shortlisted":
        return "Shortlist";
      case "rejected":
        return "Ditolak";
      case "accepted":
        return "Diterima";
      default:
        return status;
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateStatusMutation.mutate({ applicationId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Pelamar</h1>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: <span className="font-semibold">{applications.length}</span> lamaran
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pelamar atau lowongan..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-300"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              data-testid="input-search-applicants"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="select-status-filter">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="submitted">Baru</SelectItem>
              <SelectItem value="reviewed">Ditinjau</SelectItem>
              <SelectItem value="shortlisted">Shortlist</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="accepted">Diterima</SelectItem>
            </SelectContent>
          </Select>

          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger data-testid="select-job-filter">
              <SelectValue placeholder="Filter lowongan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Lowongan</SelectItem>
              {uniqueJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Applicants List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-12 text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">Tidak ada lamaran ditemukan</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const appliedDate = formatDistanceToNow(new Date(application.createdAt), {
              addSuffix: true,
              locale: idLocale,
            });

            return (
              <Card key={application.id} className="p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800" data-testid={`applicant-card-${application.id}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-[#D4FF00] flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100" data-testid={`text-applicant-name-${application.id}`}>
                        {application.user.fullName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Melamar: {application.job.title}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                        {application.user.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {application.user.email}
                          </span>
                        )}
                        {application.user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {application.user.phone}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Dilamar {appliedDate}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                      {getStatusLabel(application.status)}
                    </span>

                    <Select
                      value={application.status}
                      onValueChange={(value) => handleStatusChange(application.id, value)}
                    >
                      <SelectTrigger className="w-[140px]" data-testid={`select-status-${application.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Baru</SelectItem>
                        <SelectItem value="reviewed">Ditinjau</SelectItem>
                        <SelectItem value="shortlisted">Shortlist</SelectItem>
                        <SelectItem value="rejected">Ditolak</SelectItem>
                        <SelectItem value="accepted">Diterima</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplicant(application)}
                      data-testid={`button-view-profile-${application.id}`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Lihat Profil
                    </Button>

                    {application.cvUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        data-testid={`button-view-cv-${application.id}`}
                      >
                        <a href={application.cvUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-4 h-4 mr-2" />
                          Lihat CV
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Surat Lamaran:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{application.coverLetter}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Applicant Profile Dialog */}
      <Dialog open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          {selectedApplicant && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">Profil Pelamar</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                {/* Header Section */}
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-[#D4FF00] flex items-center justify-center flex-shrink-0">
                    <User className="w-12 h-12 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {selectedApplicant.user.fullName}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Melamar: {selectedApplicant.job.title}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedApplicant.status)}`}>
                        {getStatusLabel(selectedApplicant.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Informasi Kontak
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplicant.user.email && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="text-base text-gray-900 dark:text-gray-100">{selectedApplicant.user.email}</p>
                      </div>
                    )}
                    {selectedApplicant.user.phone && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Telepon</p>
                        <p className="text-base text-gray-900 dark:text-gray-100">{selectedApplicant.user.phone}</p>
                      </div>
                    )}
                    {selectedApplicant.user.city && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Kota</p>
                        <p className="text-base text-gray-900 dark:text-gray-100">{selectedApplicant.user.city}</p>
                      </div>
                    )}
                    {selectedApplicant.user.province && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Provinsi</p>
                        <p className="text-base text-gray-900 dark:text-gray-100">{selectedApplicant.user.province}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {selectedApplicant.user.bio && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Tentang
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedApplicant.user.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {selectedApplicant.user.skills && selectedApplicant.user.skills.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Keterampilan
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.user.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {selectedApplicant.user.education && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Pendidikan
                    </h3>
                    <div className="space-y-4">
                      {(() => {
                        try {
                          const education = JSON.parse(selectedApplicant.user.education);
                          return Array.isArray(education) ? education.map((edu: any, index: number) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{edu.degree || edu.institution}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution || edu.degree}</p>
                              {edu.year && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{edu.year}</p>}
                            </div>
                          )) : <p className="text-sm text-gray-600 dark:text-gray-400">{selectedApplicant.user.education}</p>;
                        } catch {
                          return <p className="text-sm text-gray-600 dark:text-gray-400">{selectedApplicant.user.education}</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {selectedApplicant.user.experience && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Pengalaman Kerja
                    </h3>
                    <div className="space-y-4">
                      {(() => {
                        try {
                          const experience = JSON.parse(selectedApplicant.user.experience);
                          return Array.isArray(experience) ? experience.map((exp: any, index: number) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">{exp.position || exp.company}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company || exp.position}</p>
                              {exp.duration && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{exp.duration}</p>}
                              {exp.description && <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{exp.description}</p>}
                            </div>
                          )) : <p className="text-sm text-gray-600 dark:text-gray-400">{selectedApplicant.user.experience}</p>;
                        } catch {
                          return <p className="text-sm text-gray-600 dark:text-gray-400">{selectedApplicant.user.experience}</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {selectedApplicant.coverLetter && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Surat Lamaran
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedApplicant.coverLetter}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex gap-3">
                  {selectedApplicant.cvUrl && (
                    <Button
                      variant="outline"
                      asChild
                      className="flex-1"
                      data-testid="button-view-cv-dialog"
                    >
                      <a href={selectedApplicant.cvUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        Lihat CV
                      </a>
                    </Button>
                  )}
                  <Select
                    value={selectedApplicant.status}
                    onValueChange={(value) => {
                      handleStatusChange(selectedApplicant.id, value);
                      setSelectedApplicant({ ...selectedApplicant, status: value as any });
                    }}
                  >
                    <SelectTrigger className="flex-1" data-testid="select-status-dialog">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Baru</SelectItem>
                      <SelectItem value="reviewed">Ditinjau</SelectItem>
                      <SelectItem value="shortlisted">Shortlist</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                      <SelectItem value="accepted">Diterima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
