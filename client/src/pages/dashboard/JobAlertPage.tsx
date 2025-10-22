/**
 * IMPORTANT: THIS IS A WORKER-ONLY PAGE
 * - MUST USE: DashboardHeader/DynamicHeader (NOT AdminLayout or EmployerDashboardHeader)
 * - ROLE REQUIRED: pekerja (worker/job seeker)
 * - ROUTE: /dashboard/job-alert
 * - DO NOT import admin or employer components
 */
import { useQuery } from "@tanstack/react-query";
import { Bell, Briefcase, MapPin, Coins, Clock, Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { formatSalary } from "@/lib/formatters";
import type { Notification } from "@shared/schema";

interface JobNotification extends Notification {
  job?: {
    id: string;
    title: string;
    location: string;
    salaryMin: number | null;
    salaryMax: number | null;
    company: {
      name: string;
    };
  };
}

export default function JobAlertPage() {
  const { data: notifications, isLoading } = useQuery<JobNotification[]>({
    queryKey: ["/api/notifications"],
  });

  // Filter only job-related notifications
  const jobAlerts = notifications?.filter(n => 
    n.type === "job_match" || n.type === "new_job_alert"
  ) || [];

  const unreadCount = jobAlerts.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
            Job Alert
          </h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} notifikasi baru` : "Semua notifikasi sudah dibaca"}
          </p>
        </div>
        <Link href="/user/dashboard#settings">
          <Button variant="outline" data-testid="button-manage-alerts">
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

      {/* Job Alerts List */}
      {jobAlerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum Ada Job Alert
            </h3>
            <p className="text-gray-600 mb-4">
              Atur preferensi pekerjaan Anda untuk mulai menerima notifikasi lowongan yang sesuai
            </p>
            <Link href="/user/dashboard#settings">
              <Button data-testid="button-setup-preferences">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Atur Preferensi
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobAlerts.map((notification, index) => (
            <Card 
              key={notification.id} 
              className={`${!notification.isRead ? 'border-[#D4FF00] bg-[#D4FF00]/5' : 'border-gray-200'}`}
              data-testid={`card-alert-${index}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    !notification.isRead ? 'bg-[#D4FF00]' : 'bg-gray-100'
                  }`}>
                    <Briefcase className={`w-5 h-5 ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900" data-testid={`text-title-${index}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <Badge className="bg-[#D4FF00] text-gray-900 hover:bg-[#D4FF00]" data-testid={`badge-new-${index}`}>
                            Baru
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: idLocale })}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3" data-testid={`text-message-${index}`}>
                      {notification.message}
                    </p>

                    {/* Job Details if available */}
                    {notification.job && (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {notification.job.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.job.company.name}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{notification.job.location}</span>
                          </div>
                          {notification.job.salaryMin && notification.job.salaryMax && (
                            <div className="flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              <span>
                                {formatSalary(notification.job.salaryMin)} - {formatSalary(notification.job.salaryMax)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Settings Reminder */}
      {jobAlerts.length > 0 && (
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <SettingsIcon className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Kelola Preferensi Alert</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Atur jenis pekerjaan, lokasi, dan kriteria lainnya untuk mendapatkan notifikasi yang lebih relevan.
                </p>
                <Link href="/user/dashboard#settings">
                  <Button variant="ghost" size="sm" className="mt-2 -ml-2" data-testid="button-go-to-settings">
                    Buka Pengaturan
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
