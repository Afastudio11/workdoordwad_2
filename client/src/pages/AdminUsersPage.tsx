import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("recruiter");

  const { data: recruiters, isLoading: loadingRecruiters } = useQuery({
    queryKey: ["/api/admin/users", { role: "pemberi_kerja" }],
    enabled: activeTab === "recruiter",
  });

  const { data: workers, isLoading: loadingWorkers } = useQuery({
    queryKey: ["/api/admin/users", { role: "pekerja" }],
    enabled: activeTab === "worker",
  });

  const handleVerify = async (userId: string) => {
    try {
      await apiRequest(`/api/admin/users/${userId}/verify`, "POST");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Perekrut Diverifikasi",
        description: "Akun perekrut berhasil diverifikasi",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Verifikasi",
        description: error.message || "Terjadi kesalahan saat verifikasi",
      });
    }
  };

  const handleBlock = async (userId: string, userName: string) => {
    try {
      await apiRequest(`/api/admin/users/${userId}/block`, "POST");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User Diblokir",
        description: `${userName} telah diblokir`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Memblokir",
        description: error.message || "Terjadi kesalahan saat memblokir user",
      });
    }
  };

  const isLoading = activeTab === "recruiter" ? loadingRecruiters : loadingWorkers;
  const users = activeTab === "recruiter" ? recruiters?.users || [] : workers?.users || [];

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
                                <div className="flex items-center gap-2">
                                  {!user.isVerified && (
                                    <Button
                                      size="sm"
                                      className="bg-primary text-black hover:bg-primary/90"
                                      onClick={() => handleVerify(user.id)}
                                      data-testid={`button-verify-${user.id}`}
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Verifikasi
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleBlock(user.id, user.fullName)}
                                    data-testid={`button-block-${user.id}`}
                                  >
                                    <Ban className="w-4 h-4 mr-1" />
                                    Blokir
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
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
                              <TableCell className="text-gray-600 dark:text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString('id-ID')}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleBlock(user.id, user.fullName)}
                                  data-testid={`button-block-${user.id}`}
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  Blokir
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={4}
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
    </AdminLayout>
  );
}
