import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, X, Eye, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminModerationPage() {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data, isLoading } = useQuery<{ jobs?: any[] }>({
    queryKey: ["/api/admin/aggregated-jobs", { status: "pending" }],
  });

  const handleApprove = async (jobId: string) => {
    try {
      await apiRequest(`/api/admin/aggregated-jobs/${jobId}/approve`, "POST");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/aggregated-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({
        title: "Lowongan Disetujui",
        description: "Lowongan berhasil disetujui dan akan dipublikasikan",
      });
      setIsPreviewOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Menyetujui",
        description: error.message || "Terjadi kesalahan saat menyetujui lowongan",
      });
    }
  };

  const handleReject = async (jobId: string) => {
    try {
      await apiRequest(`/api/admin/aggregated-jobs/${jobId}/reject`, "POST");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/aggregated-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({
        title: "Lowongan Ditolak",
        description: "Lowongan telah ditolak",
      });
      setIsPreviewOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Menolak",
        description: error.message || "Terjadi kesalahan saat menolak lowongan",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const jobs = data?.jobs || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white" data-testid="heading-moderation">
            Moderasi Konten
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Antrean lowongan dari AI yang menunggu review ({jobs.length})
          </p>
        </div>

        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">
              Lowongan Mentah (AI Review Queue)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-gray-200 dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-900">
                    <TableHead className="text-black dark:text-white font-semibold">
                      Judul (NLP)
                    </TableHead>
                    <TableHead className="text-black dark:text-white font-semibold">
                      Perusahaan
                    </TableHead>
                    <TableHead className="text-black dark:text-white font-semibold">
                      Lokasi
                    </TableHead>
                    <TableHead className="text-black dark:text-white font-semibold">
                      Akurasi NLP
                    </TableHead>
                    <TableHead className="text-black dark:text-white font-semibold">
                      Sumber
                    </TableHead>
                    <TableHead className="text-black dark:text-white font-semibold">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.length > 0 ? (
                    jobs.map((job: any) => (
                      <TableRow key={job.id} data-testid={`job-row-${job.id}`}>
                        <TableCell className="font-medium text-black dark:text-white">
                          {job.extractedTitle || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {job.extractedCompany || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {job.extractedLocation || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              job.aiConfidence >= 80
                                ? "default"
                                : job.aiConfidence >= 60
                                ? "secondary"
                                : "outline"
                            }
                            className={
                              job.aiConfidence >= 80
                                ? "bg-primary text-black"
                                : ""
                            }
                          >
                            {job.aiConfidence || 0}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <a
                            href={job.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {job.sourcePlatform}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedJob(job);
                                setIsPreviewOpen(true);
                              }}
                              data-testid={`button-preview-${job.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-primary text-black hover:bg-primary/90"
                              onClick={() => handleApprove(job.id)}
                              data-testid={`button-approve-${job.id}`}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(job.id)}
                              data-testid={`button-reject-${job.id}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500 dark:text-gray-500 py-8"
                      >
                        Tidak ada lowongan yang menunggu review
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">
              Pratinjau Lowongan
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Review detail lowongan dari AI
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                  Teks Asli (Sumber)
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedJob.rawText}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
                    Judul
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedJob.extractedTitle || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
                    Perusahaan
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedJob.extractedCompany || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
                    Lokasi
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedJob.extractedLocation || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-black dark:text-white mb-1">
                    Gaji
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedJob.extractedSalary || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-primary text-black hover:bg-primary/90"
                  onClick={() => handleApprove(selectedJob.id)}
                  data-testid="button-approve-modal"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Setujui & Publikasikan
                </Button>
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() => handleReject(selectedJob.id)}
                  data-testid="button-reject-modal"
                >
                  <X className="w-4 h-4 mr-2" />
                  Tolak & Hapus
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
