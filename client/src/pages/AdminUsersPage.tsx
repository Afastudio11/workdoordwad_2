/**
 * IMPORTANT: THIS IS AN ADMIN-ONLY PAGE
 * - MUST USE: AdminLayout (NOT DashboardHeader or DynamicHeader)
 * - ROLE REQUIRED: admin
 * - ROUTE: /admin/users
 * - DO NOT import worker or employer components
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Ban, LockOpen, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recruiter");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<"block" | "unblock" | "verify" | "reject">("block");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  const { data: recruiters, isLoading: loadingRecruiters } = useQuery({
    queryKey: ["/api/admin/users", { role: "pemberi_kerja" }],
    enabled: activeTab === "recruiter",
  });

  const { data: workers, isLoading: loadingWorkers } = useQuery({
    queryKey: ["/api/admin/users", { role: "pekerja" }],
    enabled: activeTab === "worker",
  });

  const handleOpenActionDialog = (user: any, action: "block" | "unblock" | "verify" | "reject") => {
    setSelectedUser(user);
    setActionType(action);
    setReason("");
    setActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    try {
      switch (actionType) {
        case "verify":
          await apiRequest(`/api/admin/users/${selectedUser.id}/verify`, "POST");
          toast({
            title: "User Diverifikasi",
            description: `${selectedUser.fullName} berhasil diverifikasi`,
          });
          break;
        case "reject":
          if (!reason.trim()) {
            toast({
              variant: "destructive",
              title: "Alasan Diperlukan",
              description: "Harap masukkan alasan penolakan",
            });
            return;
          }
          await apiRequest(`/api/admin/users/${selectedUser.id}/reject`, "POST", {
            rejectionReason: reason.trim(),
          });
          toast({
            title: "Verifikasi Ditolak",
            description: `Verifikasi ${selectedUser.fullName} telah ditolak`,
          });
          break;
        case "block":
          if (!reason.trim()) {
            toast({
              variant: "destructive",
              title: "Alasan Diperlukan",
              description: "Harap masukkan alasan pemblokiran",
            });
            return;
          }
          await apiRequest(`/api/admin/users/${selectedUser.id}/block`, "POST", {
            reason: reason.trim(),
          });
          toast({
            title: "User Diblokir",
            description: `${selectedUser.fullName} telah diblokir`,
          });
          break;
        case "unblock":
          await apiRequest(`/api/admin/users/${selectedUser.id}/unblock`, "POST");
          toast({
            title: "User Dibuka Blokirnya",
            description: `${selectedUser.fullName} telah dibuka blokirnya`,
          });
          break;
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setActionDialogOpen(false);
      setSelectedUser(null);
      setReason("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Memproses",
        description: error.message || "Terjadi kesalahan",
      });
    }
  };

  const isLoading = activeTab === "recruiter" ? loadingRecruiters : loadingWorkers;
  const users = activeTab === "recruiter" ? (recruiters as any)?.users || [] : (workers as any)?.users || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white" data-testid="heading-users">
            Manajemen User
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola akun perekrut dan pekerja
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 dark:bg-gray-900">
            <TabsTrigger
              value="recruiter"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
              data-testid="tab-recruiter"
            >
              Akun Perekrut
            </TabsTrigger>
            <TabsTrigger
              value="worker"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
              data-testid="tab-worker"
            >
              Akun Pekerja
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recruiter">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">
                  Daftar Perekrut
                </CardTitle>
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
                            Nama Lengkap
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Email
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Status Akun
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Status Verifikasi
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Tanggal Registrasi
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Aksi
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length > 0 ? (
                          users.map((user: any) => (
                            <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                              <TableCell className="font-medium text-black dark:text-white">
                                {user.fullName}
                              </TableCell>
                              <TableCell className="text-gray-600 dark:text-gray-400">
                                {user.email}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={user.isActive ? "default" : "destructive"}
                                  className={
                                    user.isActive ? "bg-primary text-black" : ""
                                  }
                                >
                                  {user.isActive ? "Aktif" : "Diblokir"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={user.isVerified ? "default" : "secondary"}
                                  className={
                                    user.isVerified ? "bg-primary text-black" : ""
                                  }
                                >
                                  {user.isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-600 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString('id-ID')}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {!user.isVerified && user.isActive && (
                                    <>
                                      <Button
                                        size="sm"
                                        className="bg-primary text-black hover:bg-primary/90"
                                        onClick={() => handleOpenActionDialog(user, "verify")}
                                        data-testid={`button-verify-${user.id}`}
                                      >
                                        <Check className="w-4 h-4 mr-1" />
                                        Verifikasi
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-600 text-red-600 hover:bg-red-50"
                                        onClick={() => handleOpenActionDialog(user, "reject")}
                                        data-testid={`button-reject-${user.id}`}
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Tolak
                                      </Button>
                                    </>
                                  )}
                                  {user.isActive ? (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleOpenActionDialog(user, "block")}
                                      data-testid={`button-block-${user.id}`}
                                    >
                                      <Ban className="w-4 h-4 mr-1" />
                                      Blokir
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="bg-primary text-black hover:bg-primary/90"
                                      onClick={() => handleOpenActionDialog(user, "unblock")}
                                      data-testid={`button-unblock-${user.id}`}
                                    >
                                      <LockOpen className="w-4 h-4 mr-1" />
                                      Buka Blokir
                                    </Button>
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
                              Tidak ada data perekrut
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="worker">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">
                  Daftar Pekerja
                </CardTitle>
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
                            Nama Lengkap
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Email
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Status Akun
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Tanggal Registrasi
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Aksi
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length > 0 ? (
                          users.map((user: any) => (
                            <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                              <TableCell className="font-medium text-black dark:text-white">
                                {user.fullName}
                              </TableCell>
                              <TableCell className="text-gray-600 dark:text-gray-400">
                                {user.email}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={user.isActive ? "default" : "destructive"}
                                  className={
                                    user.isActive ? "bg-primary text-black" : ""
                                  }
                                >
                                  {user.isActive ? "Aktif" : "Diblokir"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-600 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString('id-ID')}
                              </TableCell>
                              <TableCell>
                                {user.isActive ? (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleOpenActionDialog(user, "block")}
                                    data-testid={`button-block-${user.id}`}
                                  >
                                    <Ban className="w-4 h-4 mr-1" />
                                    Blokir
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="bg-primary text-black hover:bg-primary/90"
                                    onClick={() => handleOpenActionDialog(user, "unblock")}
                                    data-testid={`button-unblock-${user.id}`}
                                  >
                                    <LockOpen className="w-4 h-4 mr-1" />
                                    Buka Blokir
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-gray-500 dark:text-gray-500 py-8"
                            >
                              Tidak ada data pekerja
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">
              {actionType === "verify" && "Verifikasi User"}
              {actionType === "reject" && "Tolak Verifikasi User"}
              {actionType === "block" && "Blokir User"}
              {actionType === "unblock" && "Buka Blokir User"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {selectedUser && (
                <>
                  {actionType === "verify" &&
                    `Apakah Anda yakin ingin memverifikasi ${selectedUser.fullName}?`}
                  {actionType === "reject" &&
                    `Apakah Anda yakin ingin menolak verifikasi ${selectedUser.fullName}?`}
                  {actionType === "block" &&
                    `Apakah Anda yakin ingin memblokir ${selectedUser.fullName}?`}
                  {actionType === "unblock" &&
                    `Apakah Anda yakin ingin membuka blokir ${selectedUser.fullName}?`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {(actionType === "block" || actionType === "reject") && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-black dark:text-white">
                  Alasan {actionType === "block" ? "Pemblokiran" : "Penolakan"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`Masukkan alasan ${
                    actionType === "block" ? "pemblokiran" : "penolakan"
                  }...`}
                  className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                  rows={3}
                  data-testid="input-action-reason"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Alasan ini akan ditampilkan kepada user
                </p>
              </div>
            )}
            {actionType === "unblock" && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                User akan dapat mengakses platform kembali setelah dibuka blokirnya.
              </p>
            )}
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
              onClick={handleConfirmAction}
              className={
                actionType === "verify" || actionType === "unblock"
                  ? "bg-primary text-black hover:bg-primary/90"
                  : "bg-destructive text-white hover:bg-destructive/90"
              }
              data-testid="button-confirm-action"
            >
              {actionType === "verify" && (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Verifikasi
                </>
              )}
              {actionType === "reject" && (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Tolak
                </>
              )}
              {actionType === "block" && (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Blokir
                </>
              )}
              {actionType === "unblock" && (
                <>
                  <LockOpen className="w-4 h-4 mr-2" />
                  Buka Blokir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
