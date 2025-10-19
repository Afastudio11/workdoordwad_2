import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Bell, Briefcase, Heart, MessageCircle, CheckCircle, Trash2, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/DashboardHeader";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface Notification {
  id: string;
  type: 'application' | 'message' | 'system' | 'job_match';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

const notificationIcons = {
  application: Briefcase,
  message: MessageCircle,
  system: Bell,
  job_match: Heart,
};

const notificationColors = {
  application: "bg-gray-100 text-gray-700",
  message: "bg-blue-50 text-blue-600",
  system: "bg-purple-50 text-purple-600",
  job_match: "bg-green-50 text-green-600",
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data: notifications, isLoading, isError, error } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiRequest(`/api/notifications/${notificationId}/read`, "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/notifications/read-all", "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({ title: "Semua notifikasi telah ditandai sebagai dibaca" });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await apiRequest(`/api/notifications/${notificationId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({ title: "Notifikasi dihapus" });
    },
  });

  const filteredNotifications = notifications?.filter(n => 
    filter === 'all' ? true : !n.read
  ) || [];

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3" data-testid="text-page-title">
              <Bell className="h-8 w-8" />
              Notifikasi
            </h1>
          </div>

          <Alert variant="destructive" data-testid="error-alert">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Terjadi Kesalahan</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p>{(error as any)?.message || "Gagal memuat notifikasi. Silakan coba lagi."}</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/notifications"] })}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  data-testid="button-retry"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3" data-testid="text-page-title">
              <Bell className="h-8 w-8" />
              Notifikasi
            </h1>
            <p className="text-muted-foreground mt-1">
              {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              data-testid="button-mark-all-read"
            >
              <Check className="h-4 w-4 mr-2" />
              Tandai Semua Dibaca
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground border border-border hover:bg-secondary'
            }`}
            data-testid="button-filter-all"
          >
            Semua ({notifications?.length || 0})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground border border-border hover:bg-secondary'
            }`}
            data-testid="button-filter-unread"
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {filter === 'unread' ? 'Tidak Ada Notifikasi Belum Dibaca' : 'Tidak Ada Notifikasi'}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'unread' 
                ? 'Semua notifikasi kamu sudah dibaca'
                : 'kamu belum memiliki notifikasi apapun'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const Icon = notificationIcons[notification.type] || Bell;
              const colorClass = notificationColors[notification.type] || notificationColors.system;

              return (
                <Card 
                  key={notification.id} 
                  className={`${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                  data-testid={`notification-${index}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-base font-semibold text-foreground" data-testid={`notification-title-${index}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-gray-200 text-gray-900 border-0 flex-shrink-0 font-semibold">
                              Baru
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2" data-testid={`notification-message-${index}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(notification.createdAt), 'd MMM yyyy, HH:mm', { locale: idLocale })}
                          </p>
                          
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                disabled={markAsReadMutation.isPending}
                                data-testid={`button-mark-read-${index}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Tandai Dibaca
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotificationMutation.mutate(notification.id)}
                              disabled={deleteNotificationMutation.isPending}
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-${index}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
