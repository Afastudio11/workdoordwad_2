import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Job, Company } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ManageJobsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "closed">("all");

  const { data: jobs = [], isLoading } = useQuery<(Job & { company: Company })[]>({
    queryKey: ["/api/employer/jobs"],
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await apiRequest(`/api/jobs/${jobId}`, "DELETE");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
    },
  });

  const toggleJobStatusMutation = useMutation({
    mutationFn: async ({ jobId, isActive }: { jobId: string; isActive: boolean }) => {
      const res = await apiRequest(`/api/jobs/${jobId}`, "PUT", { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
    },
  });

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchKeyword.toLowerCase());
    const status: "active" | "closed" = job.isActive ? "active" : "closed";
    const matchesTab = activeTab === "all" || status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800";
  };

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus lowongan "${jobTitle}"?`)) {
      deleteJobMutation.mutate(jobId);
    }
  };

  const handleToggleStatus = (jobId: string, currentStatus: boolean) => {
    toggleJobStatusMutation.mutate({ jobId, isActive: !currentStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Lowongan</h1>
        <Button className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900" data-testid="button-post-job">
          <Plus className="w-4 h-4 mr-2" />
          Pasang Lowongan Baru
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 border-gray-200">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari lowongan..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            data-testid="tab-all"
          >
            Semua Lowongan
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "active"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            data-testid="tab-active"
          >
            Aktif
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "closed"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            data-testid="tab-closed"
          >
            Ditutup
          </button>
        </div>
      </Card>

      {/* Jobs Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="p-12 text-center border-gray-200">
          <p className="text-gray-500">Tidak ada lowongan ditemukan</p>
        </Card>
      ) : (
        <Card className="border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul Lowongan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diposting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredJobs.map((job) => {
                  const postedDate = formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                    locale: idLocale,
                  });

                  return (
                    <tr key={job.id} className="hover:bg-gray-50" data-testid={`job-row-${job.id}`}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{job.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{job.jobType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.isActive)}`}
                        >
                          {job.isActive ? "Aktif" : "Ditutup"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{postedDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              data-testid={`button-actions-${job.id}`}
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem data-testid={`action-view-${job.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Pelamar
                            </DropdownMenuItem>
                            <DropdownMenuItem data-testid={`action-edit-${job.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Lowongan
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(job.id, job.isActive)}
                              data-testid={`action-toggle-${job.id}`}
                            >
                              {job.isActive ? "Nonaktifkan" : "Aktifkan"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteJob(job.id, job.title)}
                              className="text-red-600"
                              data-testid={`action-delete-${job.id}`}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
