import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Briefcase, MapPin, Calendar, Clock, Eye, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function ApplicationsPage() {
  const { data: applications, isLoading, isError, error } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    const errorMessage = (error as any)?.message || "";
    const isAuthError = errorMessage.includes("401") || errorMessage.includes("authenticated");
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
            Lamaran Saya
          </h1>
          <p className="text-gray-900 mt-1">
            Riwayat lamaran pekerjaan kamu
          </p>
        </div>

        <Alert variant="destructive" data-testid="error-alert">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            <p>{isAuthError ? "Sesi kamu sudah habis. Silakan login kembali." : "Gagal memuat daftar lamaran. Silakan coba lagi."}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                onClick={() => isAuthError ? window.location.href = '/login' : queryClient.invalidateQueries({ queryKey: ["/api/applications"] })}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                data-testid="button-retry"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isAuthError ? "Login" : "Coba Lagi"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-16">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Belum Ada Lamaran
        </h3>
        <p className="text-gray-900 mb-6">
          kamu belum melamar ke lowongan manapun
        </p>
        <Button asChild>
          <a href="/jobs">Cari Lowongan</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
          Lamaran Saya
        </h1>
        <p className="text-gray-900 mt-1">
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
                        <p className="text-gray-900" data-testid={`text-company-${index}`}>
                          {application.job.company.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-900 ml-16">
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
    </div>
  );
}
