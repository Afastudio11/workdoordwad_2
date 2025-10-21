import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Briefcase, Search, Filter, Eye, MapPin, Building2, 
  Calendar, DollarSign, Trash2, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface Job {
  id: string;
  title: string;
  company: {
    name: string;
  };
  location: string;
  source: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  salaryMin: number | null;
  salaryMax: number | null;
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminJobsPage() {
  const { toast } = useToast();
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sourceFilter !== "all") queryParams.append("source", sourceFilter);
  if (statusFilter === "active") queryParams.append("isActive", "true");
  if (statusFilter === "inactive") queryParams.append("isActive", "false");
  if (searchKeyword) queryParams.append("keyword", searchKeyword);

  const { data, isLoading } = useQuery<JobsResponse>({
    queryKey: ["/api/admin/jobs", sourceFilter, statusFilter, searchKeyword, page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/jobs?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return apiRequest(`/api/admin/jobs/${id}`, "PATCH", { isActive: !isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobs"] });
      toast({ title: "Status loker berhasil diubah" });
    },
    onError: () => {
      toast({ title: "Gagal mengubah status", variant: "destructive" });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/jobs/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobs"] });
      toast({ title: "Loker berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Gagal menghapus loker", variant: "destructive" });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "-";
    if (min && max) return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)}jt`;
    if (min) return `${(min / 1000000).toFixed(0)}jt+`;
    return "Negosiasi";
  };

  const jobs = data?.jobs || [];
  const aiJobs = jobs.filter((j) => j.source === "ai").length;
  const directJobs = jobs.filter((j) => j.source === "direct").length;
  const activeJobs = jobs.filter((j) => j.isActive).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white" data-testid="heading-jobs">
            Kelola Lowongan Kerja
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Lihat dan kelola semua lowongan yang ada di platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white" data-testid="stat-total">
                    {data?.total || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Loker</div>
                </div>
                <Briefcase className="w-8 h-8 text-gray-300 dark:text-gray-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white" data-testid="stat-ai">
                    {aiJobs}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Dari AI</div>
                </div>
                <Building2 className="w-8 h-8 text-gray-300 dark:text-gray-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white" data-testid="stat-direct">
                    {directJobs}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Dari Perusahaan</div>
                </div>
                <Building2 className="w-8 h-8 text-gray-300 dark:text-gray-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-black dark:text-white" data-testid="stat-active">
                    {activeJobs}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Loker Aktif</div>
                </div>
                <ToggleRight className="w-8 h-8 text-gray-300 dark:text-gray-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-black dark:text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari berdasarkan judul atau perusahaan..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="bg-white dark:bg-black border-gray-300 dark:border-gray-700"
                  data-testid="input-search"
                />
              </div>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white dark:bg-black" data-testid="select-source">
                  <SelectValue placeholder="Sumber" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Sumber</SelectItem>
                  <SelectItem value="ai">Dari AI</SelectItem>
                  <SelectItem value="direct">Dari Perusahaan</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white dark:bg-black" data-testid="select-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" data-testid="button-search">
                <Search className="w-4 h-4 mr-2" />
                Cari
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-black dark:text-white">
                Daftar Lowongan ({data?.total || 0})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada lowongan ditemukan</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200 dark:border-gray-800">
                        <TableHead className="text-gray-600 dark:text-gray-400">Posisi & Perusahaan</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">Lokasi</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">Sumber</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">Gaji</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400 text-center">Views</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400 text-center">Status</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400">Tanggal</TableHead>
                        <TableHead className="text-gray-600 dark:text-gray-400 text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow 
                          key={job.id} 
                          className="border-gray-200 dark:border-gray-800"
                          data-testid={`job-row-${job.id}`}
                        >
                          <TableCell>
                            <div>
                              <Link href={`/jobs/${job.id}`}>
                                <p className="font-medium text-black dark:text-white hover:text-primary cursor-pointer">
                                  {job.title}
                                </p>
                              </Link>
                              <p className="text-sm text-gray-500">{job.company.name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={job.source === "ai" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {job.source === "ai" ? "AI" : "Perusahaan"}
                            </Badge>
                            {job.isFeatured && (
                              <Badge variant="outline" className="ml-1 text-xs">
                                Featured
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <DollarSign className="w-4 h-4" />
                              {formatSalary(job.salaryMin, job.salaryMax)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Eye className="w-4 h-4" />
                              {job.viewCount}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={job.isActive ? "default" : "secondary"}>
                              {job.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {new Date(job.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleActiveMutation.mutate({ id: job.id, isActive: job.isActive })}
                                data-testid={`button-toggle-${job.id}`}
                              >
                                {job.isActive ? (
                                  <ToggleRight className="w-4 h-4" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Yakin ingin menghapus loker ini?")) {
                                    deleteJobMutation.mutate(job.id);
                                  }
                                }}
                                data-testid={`button-delete-${job.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Halaman {data.page} dari {data.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        data-testid="button-prev"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Sebelumnya
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === data.totalPages}
                        data-testid="button-next"
                      >
                        Berikutnya
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
