import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Filter, User, Loader2, FileText, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Pelamar</h1>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{applications.length}</span> lamaran
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </Card>

      {/* Applicants List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-12 text-center border-gray-200">
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
              <Card key={application.id} className="p-6 border-gray-200" data-testid={`applicant-card-${application.id}`}>
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
    </div>
  );
}
