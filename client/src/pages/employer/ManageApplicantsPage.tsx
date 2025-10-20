/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/manage-applicants
 * - DO NOT import admin or worker components
 */
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Filter, User, Loader2, FileText, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, X, MessageSquare, Plus, Trash2, Send, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { Application, User as UserType, Job, Company, ApplicantNote } from "@shared/schema";
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

type NoteWithUser = ApplicantNote & { createdByUser: Pick<UserType, 'id' | 'fullName'> };

export default function ManageApplicantsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [skillsFilter, setSkillsFilter] = useState<string>("");
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicationWithDetails | null>(null);
  const [newNote, setNewNote] = useState("");

  const queryParams = new URLSearchParams();
  if (statusFilter !== "all") queryParams.append("status", statusFilter);
  if (jobFilter !== "all") queryParams.append("jobId", jobFilter);
  if (dateFrom) queryParams.append("dateFrom", dateFrom);
  if (dateTo) queryParams.append("dateTo", dateTo);
  if (skillsFilter) queryParams.append("skills", skillsFilter);

  const { data: applications = [], isLoading } = useQuery<ApplicationWithDetails[]>({
    queryKey: ["/api/employer/applications", queryParams.toString()],
    queryFn: async () => {
      const url = `/api/employer/applications${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
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

  const { data: notes = [], isLoading: notesLoading } = useQuery<NoteWithUser[]>({
    queryKey: ["/api/applications", selectedApplicant?.id, "notes"],
    enabled: !!selectedApplicant,
  });

  const createNoteMutation = useMutation({
    mutationFn: async ({ applicationId, note }: { applicationId: string; note: string }) => {
      const res = await apiRequest(`/api/applications/${applicationId}/notes`, "POST", { note });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications", selectedApplicant?.id, "notes"] });
      setNewNote("");
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const res = await apiRequest(`/api/notes/${noteId}`, "DELETE");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications", selectedApplicant?.id, "notes"] });
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
        return "bg-blue-100 text-blue-800";
      case "reviewed":
        return "bg-yellow-100 text-yellow-800";
      case "shortlisted":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const handleExport = () => {
    window.open('/api/employer/applications/export', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Pelamar</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{applications.length}</span> lamaran
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            disabled={applications.length === 0}
            data-testid="button-export-applicants"
          >
            <Download className="w-4 h-4 mr-2" />
            Export ke CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border-gray-200 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pelamar atau lowongan..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              data-testid="input-date-from"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              data-testid="input-date-to"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Keahlian
            </label>
            <input
              type="text"
              placeholder="Contoh: JavaScript, React"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
              data-testid="input-skills-filter"
            />
          </div>
        </div>
      </Card>

      {/* Applicants List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-12 text-center border-gray-200 bg-white">
          <p className="text-gray-500">Tidak ada lamaran ditemukan</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const appliedDate = formatDistanceToNow(new Date(application.createdAt), {
              addSuffix: true,
              locale: idLocale,
            });

            return (
              <Card key={application.id} className="p-6 border-gray-200 bg-white" data-testid={`applicant-card-${application.id}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-[#D4FF00] flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-applicant-name-${application.id}`}>
                        {application.user.fullName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">Melamar: {application.job.title}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
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
                      <p className="text-xs text-gray-400 mt-2">Dilamar {appliedDate}</p>
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
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Surat Lamaran:</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{application.coverLetter}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Applicant Profile Dialog */}
      <Dialog open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedApplicant && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900">Profil Pelamar</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                {/* Header Section */}
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-[#D4FF00] flex items-center justify-center flex-shrink-0">
                    <User className="w-12 h-12 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedApplicant.user.fullName}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
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
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Informasi Kontak
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplicant.user.email && (
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-base text-gray-900">{selectedApplicant.user.email}</p>
                      </div>
                    )}
                    {selectedApplicant.user.phone && (
                      <div>
                        <p className="text-sm text-gray-600">Telepon</p>
                        <p className="text-base text-gray-900">{selectedApplicant.user.phone}</p>
                      </div>
                    )}
                    {selectedApplicant.user.city && (
                      <div>
                        <p className="text-sm text-gray-600">Kota</p>
                        <p className="text-base text-gray-900">{selectedApplicant.user.city}</p>
                      </div>
                    )}
                    {selectedApplicant.user.province && (
                      <div>
                        <p className="text-sm text-gray-600">Provinsi</p>
                        <p className="text-base text-gray-900">{selectedApplicant.user.province}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {selectedApplicant.user.bio && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Tentang
                    </h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedApplicant.user.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {selectedApplicant.user.skills && selectedApplicant.user.skills.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Keterampilan
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.user.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-900">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {selectedApplicant.user.education && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Pendidikan
                    </h3>
                    <div className="space-y-4">
                      {(() => {
                        try {
                          const education = JSON.parse(selectedApplicant.user.education);
                          return Array.isArray(education) ? education.map((edu: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <p className="font-semibold text-gray-900">{edu.degree || edu.institution}</p>
                              <p className="text-sm text-gray-600">{edu.institution || edu.degree}</p>
                              {edu.year && <p className="text-xs text-gray-500 mt-1">{edu.year}</p>}
                            </div>
                          )) : <p className="text-sm text-gray-600">{selectedApplicant.user.education}</p>;
                        } catch {
                          return <p className="text-sm text-gray-600">{selectedApplicant.user.education}</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {selectedApplicant.user.experience && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Pengalaman Kerja
                    </h3>
                    <div className="space-y-4">
                      {(() => {
                        try {
                          const experience = JSON.parse(selectedApplicant.user.experience);
                          return Array.isArray(experience) ? experience.map((exp: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <p className="font-semibold text-gray-900">{exp.position || exp.company}</p>
                              <p className="text-sm text-gray-600">{exp.company || exp.position}</p>
                              {exp.duration && <p className="text-xs text-gray-500 mt-1">{exp.duration}</p>}
                              {exp.description && <p className="text-sm text-gray-700 mt-2">{exp.description}</p>}
                            </div>
                          )) : <p className="text-sm text-gray-600">{selectedApplicant.user.experience}</p>;
                        } catch {
                          return <p className="text-sm text-gray-600">{selectedApplicant.user.experience}</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {selectedApplicant.coverLetter && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Surat Lamaran
                    </h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedApplicant.coverLetter}
                    </p>
                  </div>
                )}

                {/* Internal Notes */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Catatan Internal
                  </h3>
                  
                  {/* Add Note Form */}
                  <div className="mb-4">
                    <Textarea
                      placeholder="Tambahkan catatan internal tentang pelamar ini..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mb-2 bg-white text-gray-900 border-gray-300"
                      rows={3}
                      data-testid="textarea-add-note"
                    />
                    <Button
                      onClick={() => {
                        if (newNote.trim() && selectedApplicant) {
                          createNoteMutation.mutate({ applicationId: selectedApplicant.id, note: newNote });
                        }
                      }}
                      disabled={!newNote.trim() || createNoteMutation.isPending}
                      className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900"
                      size="sm"
                      data-testid="button-add-note"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {createNoteMutation.isPending ? "Menyimpan..." : "Tambah Catatan"}
                    </Button>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {notesLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    ) : notes.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Belum ada catatan. Tambahkan catatan pertama untuk pelamar ini.
                      </p>
                    ) : (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-gray-50 p-4 rounded-lg"
                          data-testid={`note-${note.id}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {note.createdByUser.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(note.createdAt), {
                                  addSuffix: true,
                                  locale: idLocale,
                                })}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNoteMutation.mutate(note.id)}
                              disabled={deleteNoteMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              data-testid={`button-delete-note-${note.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {note.note}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-6 flex gap-3">
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
