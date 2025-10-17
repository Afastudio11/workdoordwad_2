import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Briefcase, MapPin, Calendar, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      logo: string | null;
    };
  };
}

const statusConfig = {
  submitted: { label: "Terkirim", color: "bg-blue-100 text-blue-700", icon: Clock },
  reviewed: { label: "Ditinjau", color: "bg-yellow-100 text-yellow-700", icon: Eye },
  shortlisted: { label: "Diundang Wawancara", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-700", icon: XCircle },
  accepted: { label: "Diterima", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
};

export default function ApplicationsPage() {
  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} jt`;
    }
    return `Rp ${(amount / 1000).toFixed(0)} rb`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Belum Ada Lamaran
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Anda belum melamar ke lowongan manapun
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
          Riwayat Lamaran
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Pantau status lamaran pekerjaan Anda
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((application, index) => {
          const status = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.submitted;
          const StatusIcon = status.icon;

          return (
            <Card key={application.id} data-testid={`card-application-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid={`text-job-title-${index}`}>
                          {application.job.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400" data-testid={`text-company-${index}`}>
                          {application.job.company.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                          Dilamar {format(new Date(application.createdAt), 'd MMM yyyy', { locale: idLocale })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
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
