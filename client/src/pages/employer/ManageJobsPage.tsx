import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Loader2, X, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { Job, Company } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const jobFormSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  requirements: z.string().optional(),
  location: z.string().min(1, "Lokasi harus diisi"),
  jobType: z.enum(["full-time", "part-time", "contract", "freelance"]),
  industry: z.string().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
});

type JobFormData = z.infer<typeof jobFormSchema>;

export default function ManageJobsPage() {
  const { toast } = useToast();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "closed">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<(Job & { company: Company }) | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<"delete" | "activate" | "deactivate" | null>(null);

  const { data: jobs = [], isLoading } = useQuery<(Job & { company: Company })[]>({
    queryKey: ["/api/employer/jobs"],
  });

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      location: "",
      jobType: "full-time",
      industry: "",
      salaryMin: "",
      salaryMax: "",
      education: "",
      experience: "",
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const res = await apiRequest("/api/jobs", "POST", {
        ...data,
        salaryMin: data.salaryMin ? parseInt(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? parseInt(data.salaryMax) : undefined,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employer/stats"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Berhasil",
        description: "Lowongan berhasil dibuat",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal membuat lowongan",
        variant: "destructive",
      });
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JobFormData }) => {
      const res = await apiRequest(`/api/jobs/${id}`, "PUT", {
        ...data,
        salaryMin: data.salaryMin ? parseInt(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? parseInt(data.salaryMax) : undefined,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
      setIsDialogOpen(false);
      setEditingJob(null);
      form.reset();
      toast({
        title: "Berhasil",
        description: "Lowongan berhasil diperbarui",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal memperbarui lowongan",
        variant: "destructive",
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await apiRequest(`/api/jobs/${jobId}`, "DELETE");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employer/stats"] });
      toast({
        title: "Berhasil",
        description: "Lowongan berhasil dihapus",
      });
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

  const bulkDeleteMutation = useMutation({
    mutationFn: async (jobIds: string[]) => {
      const res = await apiRequest("/api/jobs/bulk-delete", "POST", { jobIds });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employer/stats"] });
      setSelectedJobs(new Set());
      setIsBulkActionDialogOpen(false);
      toast({
        title: "Berhasil",
        description: `${data.deletedCount} lowongan berhasil dihapus`,
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal menghapus lowongan",
        variant: "destructive",
      });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ jobIds, updates }: { jobIds: string[]; updates: any }) => {
      const res = await apiRequest("/api/jobs/bulk-update", "POST", { jobIds, updates });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
      setSelectedJobs(new Set());
      setIsBulkActionDialogOpen(false);
      toast({
        title: "Berhasil",
        description: `${data.updatedCount} lowongan berhasil diperbarui`,
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal memperbarui lowongan",
        variant: "destructive",
      });
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

  const handleCreateNew = () => {
    setEditingJob(null);
    form.reset({
      title: "",
      description: "",
      requirements: "",
      location: "",
      jobType: "full-time",
      industry: "",
      salaryMin: "",
      salaryMax: "",
      education: "",
      experience: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (job: Job & { company: Company }) => {
    setEditingJob(job);
    form.reset({
      title: job.title,
      description: job.description,
      requirements: job.requirements || "",
      location: job.location,
      jobType: job.jobType as any,
      industry: job.industry || "",
      salaryMin: job.salaryMin?.toString() || "",
      salaryMax: job.salaryMax?.toString() || "",
      education: job.education || "",
      experience: job.experience || "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: JobFormData) => {
    if (editingJob) {
      updateJobMutation.mutate({ id: editingJob.id, data });
    } else {
      createJobMutation.mutate(data);
    }
  };

  const handleSelectJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedJobs.size === filteredJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredJobs.map(job => job.id)));
    }
  };

  const handleBulkAction = (action: "delete" | "activate" | "deactivate") => {
    setBulkActionType(action);
    setIsBulkActionDialogOpen(true);
  };

  const confirmBulkAction = () => {
    const jobIds = Array.from(selectedJobs);
    
    // Prevent empty action
    if (jobIds.length === 0) {
      toast({
        title: "Tidak ada lowongan dipilih",
        description: "Pilih setidaknya satu lowongan untuk melakukan aksi",
        variant: "destructive",
      });
      setIsBulkActionDialogOpen(false);
      return;
    }
    
    if (bulkActionType === "delete") {
      bulkDeleteMutation.mutate(jobIds);
    } else if (bulkActionType === "activate") {
      bulkUpdateMutation.mutate({ jobIds, updates: { isActive: true } });
    } else if (bulkActionType === "deactivate") {
      bulkUpdateMutation.mutate({ jobIds, updates: { isActive: false } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Lowongan</h1>
        <Button 
          onClick={handleCreateNew}
          className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900" 
          data-testid="button-post-job"
        >
          <Plus className="w-4 h-4 mr-2" />
          Pasang Lowongan Baru
        </Button>
      </div>

      <Card className="p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari lowongan..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-300"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            data-testid="input-search-jobs"
          />
        </div>

        {selectedJobs.size > 0 && !isLoading && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {selectedJobs.size} lowongan dipilih
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("activate")}
                disabled={bulkUpdateMutation.isPending || bulkDeleteMutation.isPending}
                data-testid="button-bulk-activate"
                className="bg-white dark:bg-gray-800"
              >
                {bulkUpdateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Aktifkan
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("deactivate")}
                disabled={bulkUpdateMutation.isPending || bulkDeleteMutation.isPending}
                data-testid="button-bulk-deactivate"
                className="bg-white dark:bg-gray-800"
              >
                {bulkUpdateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Nonaktifkan
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction("delete")}
                disabled={bulkUpdateMutation.isPending || bulkDeleteMutation.isPending}
                data-testid="button-bulk-delete"
              >
                {bulkDeleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Hapus
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "all"
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
            data-testid="tab-all"
          >
            Semua Lowongan
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "active"
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
            data-testid="tab-active"
          >
            Aktif
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "closed"
                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
            data-testid="tab-closed"
          >
            Ditutup
          </button>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="p-12 text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">Tidak ada lowongan ditemukan</p>
        </Card>
      ) : (
        <Card className="border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left w-12">
                    <Checkbox
                      checked={selectedJobs.size === filteredJobs.length && filteredJobs.length > 0}
                      onCheckedChange={handleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Judul Lowongan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Diposting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {filteredJobs.map((job) => {
                  const postedDate = formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                    locale: idLocale,
                  });

                  return (
                    <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700" data-testid={`job-row-${job.id}`}>
                      <td className="px-6 py-4">
                        <Checkbox
                          checked={selectedJobs.has(job.id)}
                          onCheckedChange={() => handleSelectJob(job.id)}
                          data-testid={`checkbox-job-${job.id}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{job.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{job.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{job.jobType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.isActive)}`}
                        >
                          {job.isActive ? "Aktif" : "Ditutup"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{postedDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
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
                            <DropdownMenuItem 
                              onClick={() => handleEdit(job)}
                              data-testid={`action-edit-${job.id}`}
                            >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              {editingJob ? "Edit Lowongan" : "Buat Lowongan Baru"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100">Judul Lowongan *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Senior Software Engineer" 
                        data-testid="input-job-title"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100">Deskripsi Pekerjaan *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={5}
                        placeholder="Jelaskan deskripsi pekerjaan secara detail..." 
                        data-testid="textarea-job-description"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100">Persyaratan</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4}
                        placeholder="Jelaskan persyaratan yang dibutuhkan..." 
                        data-testid="textarea-job-requirements"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100">Lokasi *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. Jakarta" 
                          data-testid="input-job-location"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100">Tipe Pekerjaan *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-job-type" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100">Industri</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="e.g. Teknologi, Keuangan" 
                        data-testid="input-job-industry"
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salaryMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100">Gaji Minimum (Rp)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="5000000" 
                          data-testid="input-salary-min"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100">Gaji Maximum (Rp)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="10000000" 
                          data-testid="input-salary-max"
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100">Pendidikan</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-education" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                            <SelectValue placeholder="Pilih pendidikan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SMA">SMA</SelectItem>
                          <SelectItem value="D3">D3</SelectItem>
                          <SelectItem value="S1">S1</SelectItem>
                          <SelectItem value="S2">S2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100">Pengalaman</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-experience" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                            <SelectValue placeholder="Pilih pengalaman" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-1 tahun">0-1 tahun</SelectItem>
                          <SelectItem value="1-3 tahun">1-3 tahun</SelectItem>
                          <SelectItem value="3-5 tahun">3-5 tahun</SelectItem>
                          <SelectItem value="5+ tahun">5+ tahun</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingJob(null);
                    form.reset();
                  }}
                  data-testid="button-cancel"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900"
                  disabled={createJobMutation.isPending || updateJobMutation.isPending}
                  data-testid="button-submit-job"
                >
                  {(createJobMutation.isPending || updateJobMutation.isPending) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    editingJob ? "Perbarui Lowongan" : "Buat Lowongan"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkActionDialogOpen} onOpenChange={setIsBulkActionDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Konfirmasi Aksi Massal
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 dark:text-gray-300">
              {bulkActionType === "delete" && (
                <>Apakah Anda yakin ingin menghapus <strong>{selectedJobs.size} lowongan</strong> yang dipilih? Tindakan ini tidak dapat dibatalkan.</>
              )}
              {bulkActionType === "activate" && (
                <>Apakah Anda yakin ingin mengaktifkan <strong>{selectedJobs.size} lowongan</strong> yang dipilih?</>
              )}
              {bulkActionType === "deactivate" && (
                <>Apakah Anda yakin ingin menonaktifkan <strong>{selectedJobs.size} lowongan</strong> yang dipilih?</>
              )}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsBulkActionDialogOpen(false)}
              data-testid="button-cancel-bulk-action"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              Batal
            </Button>
            <Button
              variant={bulkActionType === "delete" ? "destructive" : "default"}
              onClick={confirmBulkAction}
              disabled={bulkDeleteMutation.isPending || bulkUpdateMutation.isPending}
              data-testid="button-confirm-bulk-action"
              className={bulkActionType === "delete" ? "" : "bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900"}
            >
              {(bulkDeleteMutation.isPending || bulkUpdateMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Konfirmasi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
