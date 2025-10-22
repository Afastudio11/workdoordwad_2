/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/overview
 * - DO NOT import admin or worker components
 */
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Users, TrendingUp, Clock, Calendar, FileText, UserCheck, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface EmployerStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
}

interface AnalyticsData {
  applicationsOverTime: Array<{ date: string; count: number }>;
  jobsByType: Array<{ type: string; count: number }>;
}

interface Activity {
  id: string;
  type: "new_application" | "status_change" | "new_job";
  message: string;
  timestamp: string;
  jobTitle?: string;
  applicantName?: string;
}

export default function OverviewPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<EmployerStats>({
    queryKey: ["/api/employer/stats"],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/employer/analytics"],
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/employer/activities"],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_application":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "status_change":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "new_job":
        return <Briefcase className="h-5 w-5 text-black" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ringkasan Dashboard</h1>
        <Link href="/employer/dashboard#post-job">
          <Button className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900" data-testid="button-post-new-job">
            Pasang Lowongan Baru
          </Button>
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Lowongan Aktif</h3>
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-active-jobs">
            {statsLoading ? "..." : stats?.activeJobs || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Lowongan yang dipublikasikan</p>
        </Card>

        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pelamar Baru</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-new-applicants">
            {statsLoading ? "..." : stats?.newApplicationsThisWeek || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Minggu ini</p>
        </Card>

        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Pelamar</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-total-applicants">
            {statsLoading ? "..." : stats?.totalApplications || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Dari semua lowongan</p>
        </Card>

        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Lowongan</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-total-jobs">
            {statsLoading ? "..." : stats?.totalJobs || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Aktif dan tidak aktif</p>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Tren Lamaran</h2>
          </div>
          {analyticsLoading || !analytics?.applicationsOverTime ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Loading...
            </div>
          ) : analytics.applicationsOverTime.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Belum ada data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis 
                  dataKey="date" 
                  className="text-gray-600"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-gray-600"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#D4FF00" 
                  strokeWidth={2}
                  name="Jumlah Lamaran"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Jobs by Type */}
        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Lowongan per Tipe</h2>
          </div>
          {analyticsLoading || !analytics?.jobsByType ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Loading...
            </div>
          ) : analytics.jobsByType.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Belum ada data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.jobsByType}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis 
                  dataKey="type" 
                  className="text-gray-600"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-gray-600"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#D4FF00" 
                  name="Jumlah Lowongan"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="p-6 border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
        </div>
        {activitiesLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Belum ada aktivitas</div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 10).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                data-testid={`activity-${activity.id}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  {activity.jobTitle && (
                    <p className="text-xs text-gray-600 mt-1">
                      Lowongan: {activity.jobTitle}
                    </p>
                  )}
                  {activity.applicantName && (
                    <p className="text-xs text-gray-600 mt-1">
                      Pelamar: {activity.applicantName}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/employer/dashboard#post-job">
            <Button 
              className="w-full bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900" 
              data-testid="button-quick-post-job"
            >
              Pasang Iklan Baru
            </Button>
          </Link>
          <Link href="/employer/dashboard#my-jobs">
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700" 
              data-testid="button-quick-manage-applicants"
            >
              Kelola Lamaran
            </Button>
          </Link>
          <Link href="/employer/dashboard#profile">
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700" 
              data-testid="button-quick-edit-profile"
            >
              Edit Profil Perusahaan
            </Button>
          </Link>
        </div>
      </Card>

      {/* Tips Section */}
      <Card className="p-6 border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Tips Rekrutmen</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-black mt-1">●</span>
            <span>Perbarui lowongan secara berkala untuk meningkatkan visibilitas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-black mt-1">●</span>
            <span>Tanggapi lamaran dalam 48 jam untuk mendapatkan kandidat terbaik</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-black mt-1">●</span>
            <span>Gunakan deskripsi pekerjaan yang jelas dan detail untuk menarik kandidat yang tepat</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
