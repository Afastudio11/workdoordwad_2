import { useQuery } from "@tanstack/react-query";
import { Briefcase, Heart, Clock, CheckCircle, Users, TrendingUp, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { formatSalary } from "@/lib/formatters";

interface CandidateStats {
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  savedJobs: number;
}

interface RecentActivity {
  id: string;
  type: "application" | "shortlist" | "saved";
  message: string;
  timestamp: string;
  jobTitle?: string;
}

interface RecommendedJob {
  id: string;
  title: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  company: {
    name: string;
  };
  createdAt: string;
}

export default function OverviewPage() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery<CandidateStats>({
    queryKey: ["/api/candidate/stats"],
  });

  const { data: activities = [], isLoading: activitiesLoading, isError: activitiesError } = useQuery<RecentActivity[]>({
    queryKey: ["/api/candidate/activities"],
  });

  const { data: recommendations = [], isLoading: recommendationsLoading, isError: recommendationsError } = useQuery<RecommendedJob[]>({
    queryKey: ["/api/recommendations"],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application":
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case "shortlist":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "saved":
        return <Heart className="h-5 w-5 text-[#D4FF00]" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
            Overview
          </h1>
          <p className="text-gray-600 mt-1">Ringkasan aktivitas pencarian kerja Anda</p>
        </div>
        <Link href="/jobs">
          <Button className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900" data-testid="button-browse-jobs">
            Cari Lowongan
          </Button>
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Lamaran</h3>
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-total-applications">
            {statsLoading ? "..." : statsError ? "-" : stats?.totalApplications || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Semua lamaran yang dikirim</p>
        </Card>

        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Sedang Diproses</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-pending-applications">
            {statsLoading ? "..." : statsError ? "-" : stats?.pendingApplications || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Menunggu review</p>
        </Card>

        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Diundang Interview</h3>
            <CheckCircle className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-shortlisted-applications">
            {statsLoading ? "..." : statsError ? "-" : stats?.shortlistedApplications || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Lamaran di-shortlist</p>
        </Card>

        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pekerjaan Favorit</h3>
            <Heart className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-saved-jobs">
            {statsLoading ? "..." : statsError ? "-" : stats?.savedJobs || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Lowongan yang disimpan</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terkini</h2>
            <Link href="/user/dashboard#applications">
              <Button variant="ghost" size="sm" className="text-gray-600" data-testid="button-view-all-activities">
                Lihat Semua
              </Button>
            </Link>
          </div>
          {activitiesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : activitiesError ? (
            <div className="py-8 text-center text-gray-500">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>Gagal memuat aktivitas</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>Belum ada aktivitas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50" data-testid={`activity-${activity.id}`}>
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    {activity.jobTitle && (
                      <p className="text-xs text-gray-600 mt-1">{activity.jobTitle}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: idLocale })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recommended Jobs */}
        <Card className="p-6 border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Rekomendasi Pekerjaan</h2>
            <Link href="/user/dashboard#recommendations">
              <Button variant="ghost" size="sm" className="text-gray-600" data-testid="button-view-all-recommendations">
                Lihat Semua
              </Button>
            </Link>
          </div>
          {recommendationsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : recommendationsError ? (
            <div className="py-8 text-center text-gray-500">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>Gagal memuat rekomendasi</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>Belum ada rekomendasi</p>
              <Link href="/user/dashboard#settings">
                <Button variant="ghost" size="sm" className="mt-2">
                  Atur Preferensi
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((job, index) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="p-3 rounded-lg border border-gray-200 hover:border-[#D4FF00] hover:bg-gray-50 transition-colors cursor-pointer" data-testid={`recommendation-${index}`}>
                    <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{job.company.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                      </div>
                      {job.salaryMin && job.salaryMax && (
                        <span>
                          {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/jobs">
            <Button variant="outline" className="w-full justify-start" data-testid="button-find-jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              Cari Lowongan Baru
            </Button>
          </Link>
          <Link href="/user/dashboard#applications">
            <Button variant="outline" className="w-full justify-start" data-testid="button-view-applications">
              <Clock className="w-4 h-4 mr-2" />
              Lihat Status Lamaran
            </Button>
          </Link>
          <Link href="/user/dashboard#settings">
            <Button variant="outline" className="w-full justify-start" data-testid="button-update-profile">
              <Users className="w-4 h-4 mr-2" />
              Update Profil
            </Button>
          </Link>
        </div>
      </Card>

      {/* Tips Section */}
      <Card className="p-6 border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tips Pencarian Kerja</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#D4FF00] mt-1">●</span>
            <span>Perbarui profil dan CV Anda secara berkala untuk menarik perhatian recruiter</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4FF00] mt-1">●</span>
            <span>Kirim lamaran yang disesuaikan dengan setiap posisi untuk meningkatkan peluang</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4FF00] mt-1">●</span>
            <span>Aktifkan notifikasi job alert untuk mendapat informasi lowongan terbaru</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
