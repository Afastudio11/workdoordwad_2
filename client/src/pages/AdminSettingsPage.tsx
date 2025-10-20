import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});

  const { data: allSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    onSuccess: (data: any[]) => {
      const settingsObj: Record<string, string> = {};
      data.forEach((setting) => {
        settingsObj[setting.key] = setting.value;
      });
      setSettings(settingsObj);
    },
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
            Pengaturan Sistem
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Konfigurasi parameter sistem Pintu Kerja
          </p>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="bg-gray-100 dark:bg-gray-900">
            <TabsTrigger
              value="global"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
              data-testid="tab-global"
            >
              Pengaturan Global
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-black"
              data-testid="tab-integrations"
            >
              Status Integrasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  Pengaturan Umum
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

          <TabsContent value="integrations">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">
                  Status Integrasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-black dark:text-white">Instagram API</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Digunakan untuk scraping lowongan dari Instagram
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="button-test-instagram"
                    >
                      Uji Koneksi
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-black dark:text-white">OpenAI API</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Digunakan untuk ekstraksi NLP lowongan
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="button-test-openai"
                    >
                      Uji Koneksi
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-black dark:text-white">Database PostgreSQL</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Database utama sistem
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-primary text-black rounded-md text-sm font-medium">
                      Connected
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
