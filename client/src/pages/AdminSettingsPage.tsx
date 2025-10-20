/**
 * IMPORTANT: THIS IS AN ADMIN-ONLY PAGE
 * - MUST USE: AdminLayout (NOT DashboardHeader or DynamicHeader)
 * - ROLE REQUIRED: admin
 * - ROUTE: /admin/settings
 * - DO NOT import worker or employer components
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Save, Database, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [healthStatus, setHealthStatus] = useState<Record<string, boolean>>({});

  const { data: allSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    onSuccess: (data: any[]) => {
      const settingsObj: Record<string, string> = {};
      data?.forEach((setting) => {
        settingsObj[setting.key] = setting.value;
      });
      setSettings(settingsObj);
    },
  });

  const { data: activityLogs } = useQuery({
    queryKey: ["/api/admin/activity-logs"],
  });

  const handleUpdateSetting = async (key: string) => {
    try {
      await apiRequest(`/api/admin/settings/${key}`, "PUT", {
        value: settings[key],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Pengaturan Disimpan",
        description: `${key} berhasil diperbarui`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: error.message || "Terjadi kesalahan saat menyimpan pengaturan",
      });
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const testDatabaseConnection = async () => {
    try {
      const response = await apiRequest("/api/admin/health-check", "GET") as { database: boolean; server: boolean };
      setHealthStatus({ database: response.database, server: response.server });
      
      if (response.database) {
        toast({
          title: "Health Check Success",
          description: "✅ Database PostgreSQL dan Server berjalan dengan baik",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Health Check Failed",
          description: "❌ Database tidak terhubung",
        });
      }
    } catch (error: any) {
      setHealthStatus({ database: false, server: true });
      toast({
        variant: "destructive",
        title: "Health Check Error",
        description: error.message || "Gagal melakukan health check",
      });
    }
  };

  const logs = (activityLogs as any)?.logs || [];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white" data-testid="heading-settings">
            Sistem & Infrastruktur
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Konfigurasi, monitoring, dan log aktivitas admin
          </p>
        </div>

        <Tabs defaultValue="config" className="w-full">
          <TabsList className="bg-gray-100 dark:bg-gray-900">
            <TabsTrigger
              value="config"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
              data-testid="tab-config"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Konfigurasi
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
              data-testid="tab-health"
            >
              <Activity className="w-4 h-4 mr-2" />
              System Health
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
              data-testid="tab-logs"
            >
              <Database className="w-4 h-4 mr-2" />
              Admin Activity Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  Pengaturan Sistem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="boosterPrice" className="text-black dark:text-white">
                    Harga Booster (Rp)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="boosterPrice"
                      type="number"
                      value={settings['booster_price'] || '50000'}
                      onChange={(e) => handleChange('booster_price', e.target.value)}
                      className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                      data-testid="input-booster-price"
                    />
                    <Button
                      onClick={() => handleUpdateSetting('booster_price')}
                      className="bg-primary text-black hover:bg-primary/90"
                      data-testid="button-save-booster-price"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Harga untuk meningkatkan visibilitas lowongan
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freeJobQuota" className="text-black dark:text-white">
                    Kuota Lowongan Gratis per Perekrut
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="freeJobQuota"
                      type="number"
                      value={settings['free_job_quota'] || '3'}
                      onChange={(e) => handleChange('free_job_quota', e.target.value)}
                      className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                      data-testid="input-free-job-quota"
                    />
                    <Button
                      onClick={() => handleUpdateSetting('free_job_quota')}
                      className="bg-primary text-black hover:bg-primary/90"
                      data-testid="button-save-free-job-quota"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Jumlah lowongan yang dapat diposting gratis
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adExpireDays" className="text-black dark:text-white">
                    Durasi Expire Iklan (Hari)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="adExpireDays"
                      type="number"
                      value={settings['ad_expire_days'] || '30'}
                      onChange={(e) => handleChange('ad_expire_days', e.target.value)}
                      className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                      data-testid="input-ad-expire-days"
                    />
                    <Button
                      onClick={() => handleUpdateSetting('ad_expire_days')}
                      className="bg-primary text-black hover:bg-primary/90"
                      data-testid="button-save-ad-expire-days"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Jumlah hari sebelum lowongan otomatis dinonaktifkan
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  System Health Checks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <Database className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium text-black dark:text-white">PostgreSQL Database</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Koneksi ke database utama
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {healthStatus.database === true && (
                      <Badge className="bg-primary text-black">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Connected
                      </Badge>
                    )}
                    {healthStatus.database === false && (
                      <Badge variant="destructive">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Failed
                      </Badge>
                    )}
                    <Button
                      onClick={testDatabaseConnection}
                      className="bg-primary text-black hover:bg-primary/90"
                      data-testid="button-test-database"
                    >
                      Uji Koneksi
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-black dark:text-white">Server Status</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Express.js & Vite Dev Server
                      </p>
                    </div>
                    <Badge className="bg-primary text-black">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Running
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Node.js Version:</p>
                      <p className="font-medium text-black dark:text-white">v20.x</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Environment:</p>
                      <p className="font-medium text-black dark:text-white">Development</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">
                  Admin Activity Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-gray-200 dark:border-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="text-black dark:text-white font-semibold">
                          Waktu
                        </TableHead>
                        <TableHead className="text-black dark:text-white font-semibold">
                          Admin
                        </TableHead>
                        <TableHead className="text-black dark:text-white font-semibold">
                          Aksi
                        </TableHead>
                        <TableHead className="text-black dark:text-white font-semibold">
                          Detail
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.length > 0 ? (
                        logs.map((log: any) => (
                          <TableRow key={log.id} data-testid={`log-row-${log.id}`}>
                            <TableCell className="text-gray-600 dark:text-gray-400">
                              {new Date(log.createdAt).toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="text-black dark:text-white font-medium">
                              {log.adminName || 'System'}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  log.action.includes('blocked') || log.action.includes('refund')
                                    ? "destructive"
                                    : "default"
                                }
                                className={
                                  !log.action.includes('blocked') && !log.action.includes('refund')
                                    ? "bg-primary text-black"
                                    : ""
                                }
                              >
                                {log.action}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400 max-w-md truncate">
                              {log.details}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-gray-500 dark:text-gray-500 py-8"
                          >
                            Tidak ada log aktivitas
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
