/**
 * IMPORTANT: THIS IS AN ADMIN-ONLY PAGE
 * - MUST USE: AdminLayout (NOT DashboardHeader or DynamicHeader)
 * - ROLE REQUIRED: admin
 * - ROUTE: /admin/dashboard
 * - DO NOT import worker or employer components
 */
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, Users, Clock, DollarSign, TrendingUp, AlertCircle, 
  CheckCircle, ArrowRight, Eye, Shield, FileWarning 
} from "lucide-react";

interface AdminStats {
  totalActiveJobs: number;
  totalPendingReview: number;
  totalRevenue: number;
  totalUsers: number;
}

interface ActivityLog {
  id: string;
  details: string;
  adminName: string;
  createdAt: string;
  action?: string;
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  const { data: activityLogs, isLoading: logsLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/admin/activity-logs"],
  });

  const { data: moderationData } = useQuery<{ jobs?: any[] }>({
    queryKey: ["/api/admin/aggregated-jobs", { status: "pending" }],
  });

  const { data: transactionsData } = useQuery<{ transactions?: any[] }>({
    queryKey: ["/api/admin/transactions", { limit: 10 }],
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

  const pendingJobs = moderationData?.jobs || [];
  const recentTransactions = transactionsData?.transactions || [];

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri - Statistik Utama */}
        <div className="lg:col-span-8 space-y-6">
          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white" data-testid="heading-dashboard">
              Hello Admin, Selamat Pagi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Mari cek ringkasan sistem Anda.
            </p>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Pendapatan (Bulan Ini)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-black dark:text-white" data-testid="stat-revenue">
                      Rp {(stats?.totalRevenue || 0).toLocaleString('id-ID')}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100 font-medium">+13.54%</span>
                      <span className="text-gray-500">dari bulan lalu</span>
                    </div>
                  </div>
                  <DollarSign className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Lowongan Premium Aktif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-black dark:text-white" data-testid="stat-active-jobs">
                      {stats?.totalActiveJobs || 0}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <span className="text-gray-500">+156 bulan ini</span>
                    </div>
                  </div>
                  <Briefcase className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Antrean Moderasi AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-black dark:text-white" data-testid="stat-pending-review">
                      {stats?.totalPendingReview || 0}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <span className="text-gray-500">Menunggu persetujuan</span>
                    </div>
                  </div>
                  <Clock className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-black dark:text-white" data-testid="stat-users">
                      {stats?.totalUsers || 0}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <span className="text-gray-500">Perekrut & Pekerja</span>
                    </div>
                  </div>
                  <Users className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-black dark:text-white">0</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Users Diblokir</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <FileWarning className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-black dark:text-white">0</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Verifikasi Tertunda</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-black dark:text-white">0</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Error Log Backend</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-black dark:text-white">{stats?.totalUsers || 0}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Users</div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-black dark:text-white">Transaksi Keuangan</CardTitle>
                <Link href="/admin/financial">
                  <Button variant="ghost" size="sm" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
                    Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions && recentTransactions.length > 0 ? (
                  recentTransactions.slice(0, 5).map((transaction: any) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black dark:text-white">
                            {transaction.type === 'job_boost' ? 'Job Booster' : transaction.type === 'featured_slot' ? 'Featured Slot' : transaction.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-black dark:text-white">
                          Rp {(transaction.amount || 0).toLocaleString('id-ID')}
                        </p>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {transaction.status === 'completed' ? 'Success' : transaction.status === 'pending' ? 'Pending' : 'Failed'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Belum ada transaksi</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan - Aksi Wajib & Activity Log */}
        <div className="lg:col-span-4 space-y-6">
          {/* Aksi Wajib & Peringatan Sistem */}
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-black dark:text-white text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                Aksi Wajib & Peringatan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/moderation">
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold">
                        {stats?.totalPendingReview || 0}
                      </div>
                      <span className="text-sm font-medium text-black dark:text-white">
                        Lowongan Baru Review
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <Progress value={46} className="h-2 bg-gray-200 dark:bg-gray-700" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">46% progress</p>
                </div>
              </Link>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">
                      0
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Laporan Penipuan Baru
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tidak ada laporan tertunda</p>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">
                      0
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Permintaan Refund
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tidak ada refund tertunda</p>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">
                      0
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Verifikasi Perusahaan
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Semua terverifikasi</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-black dark:text-white text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3" data-testid="activity-log-list">
                {activityLogs && activityLogs.length > 0 ? (
                  activityLogs.slice(0, 10).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                      data-testid={`activity-log-${log.id}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black dark:text-white line-clamp-2">
                          {log.details}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{log.adminName}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleDateString('id-ID', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    Belum ada aktivitas
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
