/**
 * IMPORTANT: THIS IS AN ADMIN-ONLY PAGE
 * - MUST USE: AdminLayout (NOT DashboardHeader or DynamicHeader)
 * - ROLE REQUIRED: admin
 * - ROUTE: /admin/verifications
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
import { Check, X, FileWarning, Eye } from "lucide-react";
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

export default function AdminVerificationPage() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const { data: requestsData, isLoading } = useQuery({
    queryKey: [
      "/api/admin/verification-requests",
      {
        status: statusFilter !== "all" ? statusFilter : undefined,
        subjectType: typeFilter !== "all" ? typeFilter : undefined,
        limit: 100,
      },
    ],
  });

  const handleOpenActionDialog = (request: any, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
    setReviewNotes("");
    setActionDialogOpen(true);
  };

  const handleApproveReject = async () => {
    if (!selectedRequest) return;

    try {
      await apiRequest(`/api/admin/verification-requests/${selectedRequest.id}`, "PATCH", {
        status: actionType === "approve" ? "approved" : "rejected",
        reviewNotes,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/admin/verification-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });

      toast({
        title: actionType === "approve" ? "Permintaan Disetujui" : "Permintaan Ditolak",
        description: `Permintaan verifikasi telah ${actionType === "approve" ? "disetujui" : "ditolak"}`,
      });

      setActionDialogOpen(false);
      setSelectedRequest(null);
      setReviewNotes("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Memproses",
        description: error.message || "Terjadi kesalahan",
      });
    }
  };

  const requests = (requestsData as any)?.requests || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white" data-testid="heading-verifications">
            Permintaan Verifikasi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola permintaan verifikasi perusahaan dan user
          </p>
        </div>

        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-black dark:text-white flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-primary" />
                Daftar Permintaan Verifikasi
              </CardTitle>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px] bg-white dark:bg-black">
                    <SelectValue placeholder="Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="company">Perusahaan</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px] bg-white dark:bg-black">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
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
                        Waktu Pengajuan
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Tipe
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Subject ID
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Catatan
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
                    {requests.length > 0 ? (
                      requests.map((request: any) => (
                        <TableRow key={request.id} data-testid={`verification-row-${request.id}`}>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {new Date(request.createdAt).toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {request.subjectType === 'company' ? 'Perusahaan' : 'User'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-black dark:text-white font-mono text-sm">
                            {request.subjectId.substring(0, 8)}...
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                              {request.notes || 'Tidak ada catatan'}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.status === 'approved'
                                  ? "default"
                                  : request.status === 'rejected'
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                request.status === 'approved' ? "bg-primary text-black" : ""
                              }
                            >
                              {request.status === 'approved'
                                ? 'Disetujui'
                                : request.status === 'rejected'
                                ? 'Ditolak'
                                : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {request.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-primary text-black hover:bg-primary/90"
                                    onClick={() => handleOpenActionDialog(request, "approve")}
                                    data-testid={`button-approve-${request.id}`}
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Setujui
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleOpenActionDialog(request, "reject")}
                                    data-testid={`button-reject-${request.id}`}
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Tolak
                                  </Button>
                                </>
                              )}
                              {request.status !== 'pending' && (
                                <Badge variant="outline" className="text-gray-500">
                                  {request.status === 'approved' ? 'Sudah Disetujui' : 'Sudah Ditolak'}
                                </Badge>
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
                          Tidak ada permintaan verifikasi
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

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">
              {actionType === "approve" ? "Setujui Permintaan Verifikasi" : "Tolak Permintaan Verifikasi"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {actionType === "approve"
                ? "Apakah Anda yakin ingin menyetujui permintaan verifikasi ini?"
                : "Apakah Anda yakin ingin menolak permintaan verifikasi ini?"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black dark:text-white">
                Catatan Review (Opsional)
              </label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Tambahkan catatan untuk keputusan ini..."
                className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                rows={3}
                data-testid="input-review-notes"
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
              onClick={handleApproveReject}
              className={
                actionType === "approve"
                  ? "bg-primary text-black hover:bg-primary/90"
                  : "bg-destructive text-white hover:bg-destructive/90"
              }
              data-testid="button-confirm-action"
            >
              {actionType === "approve" ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Setujui
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Tolak
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
