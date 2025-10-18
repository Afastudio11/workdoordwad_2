import { useQuery } from "@tanstack/react-query";
import { Briefcase, Users, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface EmployerStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
}

export default function OverviewPage() {
  const { data: stats, isLoading } = useQuery<EmployerStats>({
    queryKey: ["/api/employer/stats"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ringkasan Dashboard</h1>
        <Link href="/employer/dashboard#jobs">
          <Button className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900" data-testid="button-post-new-job">
            Pasang Lowongan Baru
          </Button>
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Lowongan Aktif</h3>
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-active-jobs">
            {isLoading ? "..." : stats?.activeJobs || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Lowongan yang dipublikasikan</p>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pelamar Baru</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-new-applicants">
            {isLoading ? "..." : stats?.newApplicationsThisWeek || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Minggu ini</p>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Pelamar</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-total-applicants">
            {isLoading ? "..." : stats?.totalApplications || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Dari semua lowongan</p>
        </Card>

        <Card className="p-6 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Lowongan</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900" data-testid="text-total-jobs">
            {isLoading ? "..." : stats?.totalJobs || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Aktif dan tidak aktif</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/employer/dashboard#jobs">
            <Button 
              className="w-full bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900" 
              data-testid="button-quick-post-job"
            >
              Pasang Iklan Baru
            </Button>
          </Link>
          <Link href="/employer/dashboard#applicants">
            <Button 
              variant="outline" 
              className="w-full border-gray-300" 
              data-testid="button-quick-manage-applicants"
            >
              Kelola Lamaran
            </Button>
          </Link>
          <Link href="/employer/dashboard#company">
            <Button 
              variant="outline" 
              className="w-full border-gray-300" 
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
            <span className="text-[#D4FF00] mt-1">●</span>
            <span>Perbarui lowongan secara berkala untuk meningkatkan visibilitas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4FF00] mt-1">●</span>
            <span>Tanggapi lamaran dalam 48 jam untuk mendapatkan kandidat terbaik</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#D4FF00] mt-1">●</span>
            <span>Gunakan deskripsi pekerjaan yang jelas dan detail untuk menarik kandidat yang tepat</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
