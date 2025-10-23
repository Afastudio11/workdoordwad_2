import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Briefcase, Star, Zap, Download, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface QuotaInfo {
  jobPosts: {
    used: number;
    limit: number | null;
    unlimited: boolean;
  };
  featuredJobs: {
    used: number;
    limit: number | null;
    unlimited: boolean;
    available: boolean;
  };
  urgentJobs: {
    used: number;
    limit: number | null;
    unlimited: boolean;
    available: boolean;
  };
  cvDownloads: {
    used: number;
    limit: number | null;
    unlimited: boolean;
    available: boolean;
  };
  analytics: {
    available: boolean;
    level: "none" | "basic" | "advanced";
  };
  plan: string;
}

interface QuotaIndicatorProps {
  quotaInfo: QuotaInfo;
  compact?: boolean;
}

function QuotaItem({ 
  icon: Icon, 
  label, 
  used, 
  limit, 
  unlimited,
  available = true,
  color = "blue"
}: { 
  icon: any; 
  label: string; 
  used: number; 
  limit: number | null; 
  unlimited: boolean;
  available?: boolean;
  color?: string;
}) {
  if (!available) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-60">
        <div className="flex items-center gap-2">
          <Icon className="text-gray-400" size={18} />
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        </div>
        <Badge variant="outline" className="text-xs">Not Available</Badge>
      </div>
    );
  }

  const percentage = unlimited ? 0 : limit ? (used / limit) * 100 : 0;
  const isNearLimit = percentage >= 80;
  const isFull = percentage >= 100;

  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    orange: "text-orange-600 dark:text-orange-400",
    green: "text-green-600 dark:text-green-400",
  };

  return (
    <div className="space-y-2" data-testid={`quota-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={colorClasses[color as keyof typeof colorClasses]} size={18} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        {unlimited ? (
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            Unlimited
          </Badge>
        ) : (
          <span className={`text-sm font-semibold ${isFull ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-gray-700 dark:text-gray-300'}`}>
            {used} / {limit}
          </span>
        )}
      </div>
      {!unlimited && limit && (
        <Progress 
          value={percentage} 
          className={`h-2 ${isFull ? 'bg-red-200' : isNearLimit ? 'bg-orange-200' : 'bg-gray-200'}`}
        />
      )}
    </div>
  );
}

export function QuotaIndicator({ quotaInfo, compact = false }: QuotaIndicatorProps) {
  const hasLowQuota = 
    (!quotaInfo.jobPosts.unlimited && quotaInfo.jobPosts.limit && quotaInfo.jobPosts.used >= quotaInfo.jobPosts.limit) ||
    (!quotaInfo.featuredJobs.unlimited && quotaInfo.featuredJobs.limit && quotaInfo.featuredJobs.used >= quotaInfo.featuredJobs.limit) ||
    (!quotaInfo.urgentJobs.unlimited && quotaInfo.urgentJobs.limit && quotaInfo.urgentJobs.used >= quotaInfo.urgentJobs.limit);

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp size={18} />
            Quota Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <QuotaItem
            icon={Briefcase}
            label="Job Posts"
            used={quotaInfo.jobPosts.used}
            limit={quotaInfo.jobPosts.limit}
            unlimited={quotaInfo.jobPosts.unlimited}
            color="blue"
          />
          {hasLowQuota && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Quota limit reached. <Link href="/employer/plans" className="underline font-semibold">Upgrade now</Link>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="quota-indicator">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp size={20} />
            Quota Usage
          </span>
          <Badge variant="outline" className="capitalize">
            {quotaInfo.plan} Plan
          </Badge>
        </CardTitle>
        <CardDescription>
          Monitor your subscription quota and usage limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <QuotaItem
          icon={Briefcase}
          label="Job Posts"
          used={quotaInfo.jobPosts.used}
          limit={quotaInfo.jobPosts.limit}
          unlimited={quotaInfo.jobPosts.unlimited}
          color="blue"
        />
        
        <QuotaItem
          icon={Star}
          label="Featured Jobs"
          used={quotaInfo.featuredJobs.used}
          limit={quotaInfo.featuredJobs.limit}
          unlimited={quotaInfo.featuredJobs.unlimited}
          available={quotaInfo.featuredJobs.available}
          color="purple"
        />
        
        <QuotaItem
          icon={Zap}
          label="Urgent Jobs"
          used={quotaInfo.urgentJobs.used}
          limit={quotaInfo.urgentJobs.limit}
          unlimited={quotaInfo.urgentJobs.unlimited}
          available={quotaInfo.urgentJobs.available}
          color="orange"
        />
        
        <QuotaItem
          icon={Download}
          label="CV Downloads"
          used={quotaInfo.cvDownloads.used}
          limit={quotaInfo.cvDownloads.limit}
          unlimited={quotaInfo.cvDownloads.unlimited}
          available={quotaInfo.cvDownloads.available}
          color="green"
        />

        {hasLowQuota && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've reached your quota limit for some features. 
              <Link href="/employer/plans">
                <Button variant="ghost" className="h-auto p-0 ml-1 text-red-600 dark:text-red-400 underline font-semibold" data-testid="button-upgrade">
                  Upgrade your plan
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {!hasLowQuota && quotaInfo.plan === "free" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Unlock more features with a paid plan. 
              <Link href="/employer/plans">
                <Button variant="ghost" className="h-auto p-0 ml-1 underline font-semibold" data-testid="button-view-plans">
                  View plans
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
