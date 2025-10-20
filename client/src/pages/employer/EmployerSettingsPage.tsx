/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/settings
 * - DO NOT import admin or worker components
 */
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Settings as SettingsIcon, Bell, Lock, Mail } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function EmployerSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    emailNewApplicant: true,
    emailMessages: true,
    emailJobExpiry: true,
    pushNotifications: false,
  });

  const [changePassword, setChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/auth/change-password", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      setChangePassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword: changePassword.currentPassword,
      newPassword: changePassword.newPassword,
    });
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNewApplicant">New Applicant Email</Label>
              <p className="text-sm text-gray-600">
                Receive email when someone applies to your job
              </p>
            </div>
            <Switch
              id="emailNewApplicant"
              checked={notifications.emailNewApplicant}
              onCheckedChange={() => handleNotificationToggle("emailNewApplicant")}
              data-testid="switch-email-new-applicant"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailMessages">Message Email</Label>
              <p className="text-sm text-gray-600">
                Receive email when you get a new message
              </p>
            </div>
            <Switch
              id="emailMessages"
              checked={notifications.emailMessages}
              onCheckedChange={() => handleNotificationToggle("emailMessages")}
              data-testid="switch-email-messages"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailJobExpiry">Job Expiry Reminder</Label>
              <p className="text-sm text-gray-600">
                Receive email before your job posting expires
              </p>
            </div>
            <Switch
              id="emailJobExpiry"
              checked={notifications.emailJobExpiry}
              onCheckedChange={() => handleNotificationToggle("emailJobExpiry")}
              data-testid="switch-email-job-expiry"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <p className="text-sm text-gray-600">
                Receive push notifications on your device
              </p>
            </div>
            <Switch
              id="pushNotifications"
              checked={notifications.pushNotifications}
              onCheckedChange={() => handleNotificationToggle("pushNotifications")}
              data-testid="switch-push-notifications"
            />
          </div>

          <Button className="mt-4" data-testid="button-save-notifications">
            Save Notification Preferences
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={changePassword.currentPassword}
                onChange={(e) =>
                  setChangePassword({ ...changePassword, currentPassword: e.target.value })
                }
                data-testid="input-current-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={changePassword.newPassword}
                onChange={(e) =>
                  setChangePassword({ ...changePassword, newPassword: e.target.value })
                }
                data-testid="input-new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={changePassword.confirmPassword}
                onChange={(e) =>
                  setChangePassword({ ...changePassword, confirmPassword: e.target.value })
                }
                data-testid="input-confirm-password"
              />
            </div>

            <Button
              type="submit"
              disabled={updatePasswordMutation.isPending}
              data-testid="button-change-password"
            >
              {updatePasswordMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-gray-600">Email Address</Label>
            <p className="text-gray-900 font-medium">{user?.email}</p>
          </div>
          <div>
            <Label className="text-gray-600">Account Type</Label>
            <p className="text-gray-900 font-medium">Employer Account</p>
          </div>
          <div>
            <Label className="text-gray-600">Member Since</Label>
            <p className="text-gray-900 font-medium">
              {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
