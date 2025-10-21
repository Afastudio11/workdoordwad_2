/**
 * IMPORTANT: THIS IS AN ADMIN-ONLY PAGE
 * - MUST USE: AdminLayout (NOT DashboardHeader or DynamicHeader)
 * - ROLE REQUIRED: admin
 * - ROUTE: /admin/fraud-reports
 * - DO NOT import worker or employer components
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Check, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminFraudReportsPage() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState<string>("resolved");

  const { data: reportsData, isLoading } = useQuery({
    queryKey: [
      "/api/admin/fraud-reports",
      {
        status: statusFilter !== "all" ? statusFilter : undefined,
        targetType: typeFilter !== "all" ? typeFilter : undefined,
        limit: 100,
      },
    ],
  });

  const handleOpenActionDialog = (report: any, status: string) => {
    setSelectedReport(report);
    setActionStatus(status);
    setResolutionNotes("");
    setActionDialogOpen(true);
  };

  const handleOpenViewDialog = (report: any) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedReport) return;

    try {
      await apiRequest(`/api/admin/fraud-reports/${selectedReport.id}`, "PATCH", {
        status: actionStatus,
        resolutionNotes,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/admin/fraud-reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });

      toast({
        title: "Laporan Diperbarui",
        description: `Status laporan telah diperbarui menjadi ${actionStatus}`,
      });

      setActionDialogOpen(false);
      setSelectedReport(null);
      setResolutionNotes("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Memproses",
        description: error.message || "Terjadi kesalahan",
      });
    }
  };

  const reports = (reportsData as any)?.reports || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'in_review':
        return <Badge className="bg-blue-500 text-white">Sedang Ditinjau</Badge>;
      case 'resolved':
        return <Badge className="bg-primary text-black">Selesai</Badge>;
      case 'dismissed':
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white" data-testid="heading-fraud-reports">
            Laporan Penipuan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola laporan penipuan dari user
          </p>
        </div>

        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-black dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Daftar Laporan Penipuan
              </CardTitle>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px] bg-white dark:bg-black">
                    <SelectValue placeholder="Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="job">Lowongan</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="company">Perusahaan</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-white dark:bg-black">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_review">Sedang Ditinjau</SelectItem>
                    <SelectItem value="resolved">Selesai</SelectItem>
                    <SelectItem value="dismissed">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border border-gray-200 dark:border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-900">
                      <TableHead className="text-black dark:text-white font-semibold">
                        Waktu Laporan
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Tipe Target
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Alasan
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Deskripsi
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.map((report: any) => (
                        <TableRow key={report.id} data-testid={`fraud-report-${report.id}`}>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {new Date(report.createdAt).toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {report.targetType === 'job'
                                ? 'Lowongan'
                                : report.targetType === 'company'
                                ? 'Perusahaan'
                                : 'User'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-black dark:text-white font-medium">
                            {report.reason}
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                              {report.description}
                            </p>
                          </TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenViewDialog(report)}
                                data-testid={`button-view-${report.id}`}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Lihat
                              </Button>
                              {report.status === 'pending' && (
                                <Button
                                  size="sm"
                                  className="bg-primary text-black hover:bg-primary/90"
                                  onClick={() => handleOpenActionDialog(report, "in_review")}
                                  data-testid={`button-review-${report.id}`}
                                >
                                  Tinjau
                                </Button>
                              )}
                              {report.status === 'in_review' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-primary text-black hover:bg-primary/90"
                                    onClick={() => handleOpenActionDialog(report, "resolved")}
                                    data-testid={`button-resolve-${report.id}`}
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Selesaikan
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleOpenActionDialog(report, "dismissed")}
                                    data-testid={`button-dismiss-${report.id}`}
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Tolak
                                  </Button>
                                </>
                              )}
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
                          Tidak ada laporan penipuan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">
              Detail Laporan Penipuan
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tipe Target
                </label>
                <p className="text-black dark:text-white mt-1">
                  {selectedReport.targetType === 'job'
                    ? 'Lowongan'
                    : selectedReport.targetType === 'company'
                    ? 'Perusahaan'
                    : 'User'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ID Target
                </label>
                <p className="text-black dark:text-white mt-1 font-mono text-sm">
                  {selectedReport.targetId}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Alasan
                </label>
                <p className="text-black dark:text-white mt-1">{selectedReport.reason}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Deskripsi Lengkap
                </label>
                <p className="text-black dark:text-white mt-1">{selectedReport.description}</p>
              </div>
              {selectedReport.evidenceUrls && selectedReport.evidenceUrls.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Bukti
                  </label>
                  <ul className="list-disc list-inside text-black dark:text-white mt-1">
                    {selectedReport.evidenceUrls.map((url: string, index: number) => (
                      <li key={index}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Bukti {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedReport.resolutionNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Catatan Resolusi
                  </label>
                  <p className="text-black dark:text-white mt-1">
                    {selectedReport.resolutionNotes}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </label>
                <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
              className="border-gray-200 dark:border-gray-800"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">
              Update Status Laporan
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Ubah status laporan menjadi:{" "}
              <strong>
                {actionStatus === "in_review"
                  ? "Sedang Ditinjau"
                  : actionStatus === "resolved"
                  ? "Selesai"
                  : "Ditolak"}
              </strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black dark:text-white">
                Catatan Resolusi (Opsional)
              </label>
              <Textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Tambahkan catatan untuk keputusan ini..."
                className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                rows={3}
                data-testid="input-resolution-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialogOpen(false)}
              className="border-gray-200 dark:border-gray-800"
              data-testid="button-cancel-action"
            >
              Batal
            </Button>
            <Button
              onClick={handleUpdateStatus}
              className="bg-primary text-black hover:bg-primary/90"
              data-testid="button-confirm-action"
            >
              Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
