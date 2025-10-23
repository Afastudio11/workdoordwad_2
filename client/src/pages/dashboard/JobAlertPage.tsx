/**
 * IMPORTANT: THIS IS A WORKER-ONLY PAGE
 * - MUST USE: DashboardHeader/DynamicHeader (NOT AdminLayout or EmployerDashboardHeader)
 * - ROLE REQUIRED: pekerja (worker/job seeker)
 * - ROUTE: /dashboard/job-alert
 * - DO NOT import admin or employer components
 */
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bell, Briefcase, MapPin, Coins, Settings as SettingsIcon, Heart, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { formatSalary } from "@/lib/formatters";
import { QuickApplyModal } from "@/components/QuickApplyModal";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  isFeatured: boolean;
  isUrgent: boolean;
  company: {
    id: string;
    name: string;
    logo: string | null;
    verificationStatus: string;
  };
}

interface JobAlertData {
  notificationCount: number;
  recommendations: Job[];
}

export default function JobAlertPage() {
  const [, setLocation] = useLocation();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: jobAlertData, isLoading } = useQuery<JobAlertData>({
    queryKey: ["/api/job-alert"],
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiRequest("/api/wishlists", "POST", { jobId });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Lowongan ditambahkan ke wishlist",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlists"] });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menambahkan ke wishlist",
        variant: "destructive",
      });
    },
  });

  const handleCardClick = (jobId: string) => {
    setLocation(`/jobs/${jobId}`);
  };

  const handleQuickApply = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJobId(job.id);
    setSelectedJobTitle(job.title);
    setSelectedCompany(job.company.name);
    setIsApplyModalOpen(true);
  };

  const handleWishlist = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToWishlistMutation.mutate(jobId);
  };

  const handleViewAll = () => {
    setLocation("/find-job");
  };

  if (isLoading) {
    return (
      <div className="space-y-4 pb-20 md:pb-20">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  const recommendations = jobAlertData?.recommendations || [];
  const notificationCount = jobAlertData?.notificationCount || 0;

  return (
    <div className="space-y-6 pb-20 md:pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
            Job Alert
          </h1>
          <p className="text-gray-600 mt-1">
            {notificationCount > 0 ? `${notificationCount} notifikasi baru` : "Tidak ada notifikasi baru"}
          </p>
        </div>
        <Link href="/user/dashboard#settings">
          <Button 
            className="bg-primary text-black hover:bg-primary/90 font-bold" 
            data-testid="button-manage-alerts"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Atur Preferensi
          </Button>
        </Link>
      </div>

      {/* Alert Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">Tentang Job Alert</h3>
              <p className="text-sm text-blue-700 mt-1">
                Kami akan mengirimkan notifikasi lowongan baru yang sesuai dengan preferensi Anda. 
                Atur preferensi pekerjaan di halaman Pengaturan untuk mendapatkan rekomendasi yang lebih akurat.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Rekomendasi Lowongan ({recommendations.length})
          </h2>
          {recommendations.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleViewAll}
              data-testid="button-view-all"
              className="text-primary hover:text-primary/80"
            >
              Lihat Semua →
            </Button>
          )}
        </div>

        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Rekomendasi
              </h3>
              <p className="text-gray-600 mb-4">
                Atur preferensi pekerjaan Anda untuk mulai menerima rekomendasi lowongan yang sesuai
              </p>
              <Link href="/user/dashboard#settings">
                <Button 
                  className="bg-primary text-black hover:bg-primary/90 font-bold"
                  data-testid="button-setup-preferences"
                >
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Atur Preferensi
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recommendations.map((job, index) => (
              <Card
                key={job.id}
                className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
                onClick={() => handleCardClick(job.id)}
                data-testid={`card-job-${index}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {job.company.logo ? (
                        <img 
                          src={job.company.logo} 
                          alt={job.company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1" data-testid={`text-job-title-${index}`}>
                          {job.title}
                        </h3>
                        <div className="flex gap-1">
                          {job.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs">
                              Featured
                            </Badge>
                          )}
                          {job.isUrgent && (
                            <Badge className="bg-red-100 text-red-800 border-0 text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        <p className="text-gray-700 font-medium" data-testid={`text-company-${index}`}>
                          {job.company.name}
                        </p>
                        {job.company.verificationStatus === "verified" && (
                          <Badge className="bg-blue-100 text-blue-800 border-0 text-xs px-1 py-0">
                            ✓
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span data-testid={`text-location-${index}`}>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.jobType}</span>
                        </div>
                        {job.salaryMin && job.salaryMax && (
                          <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4" />
                            <span data-testid={`text-salary-${index}`}>
                              {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => handleQuickApply(job, e)}
                          className="bg-primary text-black hover:bg-primary/90 font-bold"
                          data-testid={`button-quick-apply-${index}`}
                        >
                          Lamar Cepat
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => handleWishlist(job.id, e)}
                          data-testid={`button-wishlist-${index}`}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="text-center pt-4">
            <Button
              onClick={handleViewAll}
              className="bg-primary text-black hover:bg-primary/90 font-bold"
              data-testid="button-view-all-bottom"
            >
              Lihat Semua Rekomendasi →
            </Button>
          </div>
        )}
      </div>

      {/* Quick Apply Modal */}
      {selectedJobId && (
        <QuickApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setSelectedJobId(null);
            setSelectedJobTitle("");
            setSelectedCompany("");
            queryClient.invalidateQueries({ queryKey: ["/api/job-alert"] });
          }}
          jobId={selectedJobId}
          jobTitle={selectedJobTitle}
          companyName={selectedCompany}
        />
      )}
    </div>
  );
}
