import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Clock, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  const { data: activityLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["/api/admin/activity-logs"],
  });

  if (statsLoading || logsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const statsCards = [
    {
      title: "Total Lowongan Aktif",
      value: stats?.totalActiveJobs || 0,
      icon: Briefcase,
      color: "text-primary",
      testId: "stat-active-jobs"
    },
    {
      title: "Lowongan Menunggu Review",
      value: stats?.totalPendingReview || 0,
      icon: Clock,
      color: "text-yellow-600",
      testId: "stat-pending-review"
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${(stats?.totalRevenue || 0).toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: "text-primary",
      testId: "stat-revenue"
    },
    {
      title: "Total User",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      testId: "stat-users"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white" data-testid="heading-dashboard">
            Dashboard Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ringkasan sistem Pintu Kerja
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${stat.color}`} data-testid={stat.testId}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-black dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Log Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" data-testid="activity-log-list">
              {activityLogs && activityLogs.length > 0 ? (
                activityLogs.slice(0, 10).map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                    data-testid={`activity-log-${log.id}`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black dark:text-white">
                        {log.details}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-500">
                        <span>{log.adminName}</span>
                        <span>•</span>
                        <span>
                          {new Date(log.createdAt).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-500 text-center py-8">
                  Belum ada aktivitas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
