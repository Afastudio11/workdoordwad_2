import { useState } from "react";
import { Plus, Search, MoreVertical, Users, Eye, FileText, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import type { Job, Company } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { queryClient } from "@/lib/queryClient";
import EmployerDashboardHeader from "@/components/EmployerDashboardHeader";

export default function HiringPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "closed">("all");

  const { data: jobs = [], isLoading, isError, error } = useQuery<(Job & { company: Company })[]>({
    queryKey: ["/api/employer/jobs"],
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchKeyword.toLowerCase());
    
    // Map isActive to status
    let status: "active" | "closed" = job.isActive ? "active" : "closed";
    const matchesTab = activeTab === "all" || status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: "active" | "closed") => {
    switch (status) {
      case "active":
        return "bg-foreground text-background";
      case "closed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Calculate metrics from real data
  const activeJobsCount = jobs.filter(j => j.isActive).length;

  return (
    <div className="min-h-screen bg-background">
      <EmployerDashboardHeader />

      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="heading-2 text-heading">Dashboard Rekrutmen</h1>
          <Button className="flex items-center gap-2" data-testid="button-post-job">
            <Plus className="h-4 w-4" />
            Posting Lowongan Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-base card-padding">
            <div className="flex items-center justify-between mb-2">
              <h3 className="caption">Lowongan Aktif</h3>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="heading-2 text-heading" data-testid="text-active-jobs">
              {isLoading ? "..." : activeJobsCount}
            </p>
            <p className="body-small text-muted-foreground mt-1">Total lowongan yang dipublikasikan</p>
          </div>

          <div className="card-base card-padding">
            <div className="flex items-center justify-between mb-2">
              <h3 className="caption">Total Pelamar</h3>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="heading-2 text-heading" data-testid="text-total-applicants">
              {isLoading ? "..." : "0"}
            </p>
            <p className="body-small text-muted-foreground mt-1">Dari semua lowongan</p>
          </div>

          <div className="card-base card-padding">
            <div className="flex items-center justify-between mb-2">
              <h3 className="caption">Total Lowongan</h3>
              <Eye className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="heading-2 text-heading" data-testid="text-total-jobs">
              {isLoading ? "..." : jobs.length}
            </p>
            <p className="body-small text-muted-foreground mt-1">Aktif dan tidak aktif</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari lowongan..."
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              data-testid="input-search-jobs"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground border border-border hover:bg-muted"
              }`}
              data-testid="tab-all"
            >
              Semua Lowongan
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground border border-border hover:bg-muted"
              }`}
              data-testid="tab-active"
            >
              Aktif
            </button>
            <button
              onClick={() => setActiveTab("closed")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "closed"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground border border-border hover:bg-muted"
              }`}
              data-testid="tab-closed"
            >
              Ditutup
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <Alert variant="destructive" data-testid="error-alert">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Terjadi Kesalahan</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p>{(error as any)?.message || "Gagal memuat daftar lowongan. Silakan coba lagi."}</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] })}
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
        ) : (
          <div className="card-base overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left caption uppercase tracking-wider">
                      Judul Lowongan
                    </th>
                    <th className="px-6 py-3 text-left caption uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left caption uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left caption uppercase tracking-wider">
                      Industri
                    </th>
                    <th className="px-6 py-3 text-left caption uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left caption uppercase tracking-wider">
                      Diposting
                    </th>
                    <th className="px-6 py-3 text-left caption uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredJobs.map((job) => {
                    const status: "active" | "closed" = job.isActive ? "active" : "closed";
                    const postedDate = formatDistanceToNow(new Date(job.createdAt), { 
                      addSuffix: true, 
                      locale: idLocale 
                    });
                    
                    return (
                      <tr key={job.id} className="hover:bg-muted/50" data-testid={`job-row-${job.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="body-small font-medium text-heading">{job.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="body-small text-muted-foreground">{job.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="body-small text-muted-foreground">{job.jobType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="body-small text-muted-foreground">{job.industry || "-"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                            {status === "active" ? "Aktif" : "Ditutup"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="body-small text-muted-foreground">{postedDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-muted-foreground hover:text-foreground" data-testid={`button-actions-${job.id}`}>
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && filteredJobs.length === 0 && (
          <div className="text-center py-12 card-base">
            <p className="text-muted-foreground">Tidak ada lowongan ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
