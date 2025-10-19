import { useQuery, useMutation } from "@tanstack/react-query";
import { Bell, BellOff, Check, CheckCheck, Trash2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Link } from "wouter";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "application_status":
      return "📋";
    case "new_message":
      return "💬";
    case "job_match":
      return "🎯";
    case "new_applicant":
      return "👤";
    default:
      return "🔔";
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "application_status":
      return "bg-blue-50 border-blue-200";
    case "new_message":
      return "bg-green-50 border-green-200";
    case "job_match":
      return "bg-purple-50 border-purple-200";
    case "new_applicant":
      return "bg-yellow-50 border-yellow-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

export default function NotificationsPage() {
  const { toast } = useToast();

  const { data: notifications = [], isLoading, isError, error, refetch } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const { data: unreadData, isError: isCountError, error: countError } = useQuery<{ count: number }>({
    queryKey: ["/api/notifications/unread-count"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await apiRequest(`/api/notifications/${notificationId}/read`, "PATCH");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menandai notifikasi sebagai dibaca",
        variant: "destructive",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("/api/notifications/read-all", "PATCH");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
      toast({
        title: "Berhasil",
        description: "Semua notifikasi ditandai sebagai dibaca",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menandai semua notifikasi sebagai dibaca",
        variant: "destructive",
      });
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
          Notifikasi
        </h1>
        
        <Card className="p-12">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-600">
              {(error as any)?.message || "Gagal memuat notifikasi. Silakan coba lagi."}
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-[#D4FF00] hover:bg-[#c4ef00] text-gray-900"
              data-testid="button-retry"
            >
              <Loader2 className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
            Notifikasi
          </h1>
          <p className="text-gray-600 mt-1">
            {unreadData?.count ? `${unreadData.count} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            data-testid="button-refresh"
          >
            <Loader2 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {unreadNotifications.length > 0 && (
            <Button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              data-testid="button-mark-all-read"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Tandai Semua Dibaca
            </Button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <BellOff className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              Belum ada notifikasi
            </h3>
            <p className="text-gray-600">
              Notifikasi kamu akan muncul di sini
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Belum Dibaca ({unreadNotifications.length})
              </h2>
              
              <div className="space-y-2">
                {unreadNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left p-4 cursor-pointer transition-all hover:shadow-md ${getNotificationColor(notification.type)} border-l-4 rounded-lg border`}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h3>
                          <Badge variant="default" className="bg-[#D4FF00] text-gray-900 flex-shrink-0">
                            Baru
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: idLocale,
                            })}
                          </span>
                          
                          {notification.linkUrl && (
                            <Link href={notification.linkUrl}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                data-testid={`button-view-${notification.id}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Lihat <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
                <Check className="h-5 w-5" />
                Sudah Dibaca ({readNotifications.length})
              </h2>
              
              <div className="space-y-2">
                {readNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="p-4 bg-gray-50 opacity-75 border border-gray-200"
                    data-testid={`notification-read-${notification.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl flex-shrink-0 opacity-50">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-700 text-sm mb-1">
                          {notification.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: idLocale,
                            })}
                          </span>
                          
                          {notification.linkUrl && (
                            <Link href={notification.linkUrl}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                              >
                                Lihat <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
