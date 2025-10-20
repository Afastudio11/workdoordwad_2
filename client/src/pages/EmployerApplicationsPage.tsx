import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, User, FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import EmployerDashboardHeader from "@/components/EmployerDashboardHeader";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Application, User as UserType, Job } from "@shared/schema";

type ApplicationWithDetails = Application & {
  applicant: UserType;
  job: Job;
};

export default function EmployerApplicationsPage() {
  const { toast } = useToast();
  
  const { data: applications, isLoading } = useQuery<ApplicationWithDetails[]>({
    queryKey: ["/api/applications/employer"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest(`/api/applications/${id}/status`, "PATCH", { status });
    },
    onSuccess: () => {
      toast({
        title: "Status Diperbarui",
        description: "Status lamaran berhasil diperbarui.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications/employer"] });
    },
    onError: () => {
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal memperbarui status. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive", label: string }> = {
      submitted: { variant: "secondary", label: "Terkirim" },
      reviewed: { variant: "default", label: "Ditinjau" },
      shortlisted: { variant: "default", label: "Diundang Interview" },
      rejected: { variant: "destructive", label: "Ditolak" },
      accepted: { variant: "default", label: "Diterima" },
    };
    
    const config = statusConfig[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filterByStatus = (status: string | null) => {
    if (!applications) return [];
    if (!status) return applications;
    return applications.filter((app) => app.status === status);
  };

  const ApplicationCard = ({ application }: { application: ApplicationWithDetails }) => (
    <Card data-testid={`card-application-${application.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-[#D4FF00] flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-gray-900">
                {application.applicant.fullName?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">
                {application.applicant.fullName}
              </CardTitle>
              <p className="text-sm text-gray-600 truncate">
                Melamar untuk: {application.job.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            {getStatusBadge(application.status)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {application.coverLetter && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Surat Lamaran:</p>
            <p className="text-sm text-gray-700 line-clamp-3">
              {application.coverLetter}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {application.status === "submitted" && (
            <>
              <Button
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: application.id, status: "reviewed" })}
                disabled={updateStatusMutation.isPending}
                data-testid={`button-review-${application.id}`}
              >
                <Eye className="w-4 h-4 mr-1" />
                Tandai Sudah Ditinjau
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatusMutation.mutate({ id: application.id, status: "shortlisted" })}
                disabled={updateStatusMutation.isPending}
                data-testid={`button-shortlist-${application.id}`}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Undang Interview
              </Button>
            </>
          )}
          
          {application.status === "reviewed" && (
            <>
              <Button
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: application.id, status: "shortlisted" })}
                disabled={updateStatusMutation.isPending}
                data-testid={`button-shortlist-${application.id}`}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Undang Interview
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatusMutation.mutate({ id: application.id, status: "rejected" })}
                disabled={updateStatusMutation.isPending}
                data-testid={`button-reject-${application.id}`}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Tolak
              </Button>
            </>
          )}

          {application.status === "shortlisted" && (
            <>
              <Button
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: application.id, status: "accepted" })}
                disabled={updateStatusMutation.isPending}
                data-testid={`button-accept-${application.id}`}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Terima
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatusMutation.mutate({ id: application.id, status: "rejected" })}
                disabled={updateStatusMutation.isPending}
                data-testid={`button-reject-${application.id}`}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Tolak
              </Button>
            </>
          )}

          {application.cvUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(application.cvUrl!, "_blank")}
              data-testid={`button-view-cv-${application.id}`}
            >
              <FileText className="w-4 h-4 mr-1" />
              Lihat CV
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <EmployerDashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
            Lamaran
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola semua lamaran pekerjaan yang diterima untuk lowongan Anda
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Memuat lamaran...</div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">
                Semua ({applications?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="submitted" data-testid="tab-submitted">
                <Clock className="w-4 h-4 mr-1" />
                Terkirim ({filterByStatus("submitted").length})
              </TabsTrigger>
              <TabsTrigger value="reviewed" data-testid="tab-reviewed">
                <Eye className="w-4 h-4 mr-1" />
                Ditinjau ({filterByStatus("reviewed").length})
              </TabsTrigger>
              <TabsTrigger value="shortlisted" data-testid="tab-shortlisted">
                <CheckCircle className="w-4 h-4 mr-1" />
                Interview ({filterByStatus("shortlisted").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {!applications || applications.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Belum ada lamaran
                    </h3>
                    <p className="text-gray-600">
                      Lamaran akan muncul di sini ketika kandidat melamar ke lowongan Anda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                applications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            <TabsContent value="submitted" className="space-y-4">
              {filterByStatus("submitted").length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Tidak ada lamaran baru
                    </h3>
                    <p className="text-gray-600">
                      Lamaran baru akan muncul di sini
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filterByStatus("submitted").map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            <TabsContent value="reviewed" className="space-y-4">
              {filterByStatus("reviewed").length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Belum ada lamaran yang ditinjau
                    </h3>
                    <p className="text-gray-600">
                      Lamaran yang sudah Anda tinjau akan muncul di sini
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filterByStatus("reviewed").map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>

            <TabsContent value="shortlisted" className="space-y-4">
              {filterByStatus("shortlisted").length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Belum ada kandidat yang diundang interview
                    </h3>
                    <p className="text-gray-600">
                      Kandidat yang Anda undang interview akan muncul di sini
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filterByStatus("shortlisted").map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
