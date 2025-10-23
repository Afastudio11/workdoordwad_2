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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type BlockCategory = 
  | "DOCUMENT_INCOMPLETE" 
  | "DOCUMENT_INVALID" 
  | "COMPANY_INFO_MISMATCH" 
  | "SUSPICIOUS_ACTIVITY" 
  | "TERMS_VIOLATION" 
  | "FRAUD_REPORT" 
  | "OTHER";

const BLOCK_CATEGORIES = [
  { value: "DOCUMENT_INCOMPLETE", label: "Dokumen Tidak Lengkap" },
  { value: "DOCUMENT_INVALID", label: "Dokumen Tidak Valid/Palsu" },
  { value: "COMPANY_INFO_MISMATCH", label: "Informasi Perusahaan Tidak Sesuai" },
  { value: "SUSPICIOUS_ACTIVITY", label: "Aktivitas Mencurigakan/Spam" },
  { value: "TERMS_VIOLATION", label: "Pelanggaran Ketentuan Layanan" },
  { value: "FRAUD_REPORT", label: "Laporan Penipuan" },
  { value: "OTHER", label: "Lainnya" },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recruiter");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<"block" | "unblock" | "verify" | "reject">("block");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [blockCategory, setBlockCategory] = useState<BlockCategory>("DOCUMENT_INCOMPLETE");

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
    setBlockCategory("DOCUMENT_INCOMPLETE");
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
            category: blockCategory,
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
      setBlockCategory("DOCUMENT_INCOMPLETE");
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
                            Status Verifikasi
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Status Akun
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Tanggal Bergabung
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
                                  variant={
                                    user.verificationStatus === "verified"
                                      ? "default"
                                      : user.verificationStatus === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className={
                                    user.verificationStatus === "verified"
                                      ? "bg-primary text-black"
                                      : ""
                                  }
                                >
                                  {user.verificationStatus === "verified" && "Terverifikasi"}
                                  {user.verificationStatus === "rejected" && "Ditolak"}
                                  {user.verificationStatus === "pending" && "Menunggu"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={user.isBlocked ? "destructive" : "default"}
                                  className={!user.isBlocked ? "bg-primary text-black" : ""}
                                >
                                  {user.isBlocked ? "Diblokir" : "Aktif"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-600 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString('id-ID')}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 flex-wrap">
                                  {user.verificationStatus === "pending" && (
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
                                        variant="destructive"
                                        onClick={() => handleOpenActionDialog(user, "reject")}
                                        data-testid={`button-reject-${user.id}`}
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Tolak
                                      </Button>
                                    </>
                                  )}
                                  {!user.isBlocked ? (
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
                            Status
                          </TableHead>
                          <TableHead className="text-black dark:text-white font-semibold">
                            Tanggal Bergabung
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
                                  variant={user.isBlocked ? "destructive" : "default"}
                                  className={!user.isBlocked ? "bg-primary text-black" : ""}
                                >
                                  {user.isBlocked ? "Diblokir" : "Aktif"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-600 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString('id-ID')}
                              </TableCell>
                              <TableCell>
                                {!user.isBlocked ? (
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
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 max-w-2xl">
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
                    `Pilih kategori alasan pemblokiran untuk ${selectedUser.fullName}`}
                  {actionType === "unblock" &&
                    `Apakah Anda yakin ingin membuka blokir ${selectedUser.fullName}?`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {actionType === "block" && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-black dark:text-white">
                    Kategori Alasan <span className="text-red-500">*</span>
                  </label>
                  <RadioGroup
                    value={blockCategory}
                    onValueChange={(value) => setBlockCategory(value as BlockCategory)}
                    className="space-y-2"
                  >
                    {BLOCK_CATEGORIES.map((category) => (
                      <div key={category.value} className="flex items-start space-x-3">
                        <RadioGroupItem
                          value={category.value}
                          id={category.value}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={category.value}
                          className="text-sm font-normal text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed"
                        >
                          {category.label}
                          {(category.value === "DOCUMENT_INCOMPLETE" || category.value === "DOCUMENT_INVALID") && (
                            <span className="block text-xs text-green-600 dark:text-green-400 mt-0.5">
                              ✓ User dapat upload ulang dokumen
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Jika alasan terkait dokumen, user akan mendapat opsi untuk upload ulang
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black dark:text-white">
                    Detail Alasan (Opsional)
                  </label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tambahkan detail spesifik tentang alasan pemblokiran..."
                    className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                    rows={3}
                    data-testid="input-action-reason"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Detail ini akan ditampilkan kepada user
                  </p>
                </div>
              </>
            )}
            {actionType === "reject" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-black dark:text-white">
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
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
                  Blokir User
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
