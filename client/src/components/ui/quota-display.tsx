import { TrendingUp, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface QuotaDisplayProps {
  plan: "free" | "starter" | "professional" | "enterprise";
  quotas: {
    jobPosting: { current: number; limit: number | "unlimited" };
    featured?: { current: number; limit: number | "unlimited" };
    urgent?: { current: number; limit: number | "unlimited" };
    cvDownload?: { current: number; limit: number | "unlimited" };
  };
  className?: string;
  variant?: "compact" | "detailed";
}

export function QuotaDisplay({ 
  plan, 
  quotas, 
  className,
  variant = "compact" 
}: QuotaDisplayProps) {
  const formatQuota = (current: number, limit: number | "unlimited") => {
    if (limit === "unlimited") {
      return `${current} / ∞`;
    }
    return `${current} / ${limit}`;
  };

  const getQuotaColor = (current: number, limit: number | "unlimited") => {
    if (limit === "unlimited") return "text-green-600";
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-orange-600";
    return "text-green-600";
  };

  const planColors = {
    free: "bg-gray-100 text-gray-700",
    starter: "bg-lime-100 text-lime-700",
    professional: "bg-blue-100 text-blue-700",
    enterprise: "bg-purple-100 text-purple-700",
  };

  const planLabels = {
    free: "GRATIS",
    starter: "STARTER",
    professional: "PROFESSIONAL",
    enterprise: "ENTERPRISE",
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2 flex-wrap", className)} data-testid="quota-display">
        <Badge className={planColors[plan]} data-testid="badge-plan">
          {planLabels[plan]}
        </Badge>
        <span className={cn("text-sm font-medium", getQuotaColor(quotas.jobPosting.current, quotas.jobPosting.limit))} data-testid="text-job-quota">
          Job: {formatQuota(quotas.jobPosting.current, quotas.jobPosting.limit)}
        </span>
        {quotas.featured && quotas.featured.limit !== 0 && (
          <span className={cn("text-sm font-medium", getQuotaColor(quotas.featured.current, quotas.featured.limit))} data-testid="text-featured-quota">
            Featured: {formatQuota(quotas.featured.current, quotas.featured.limit)}
          </span>
        )}
        {quotas.urgent && quotas.urgent.limit !== 0 && (
          <span className={cn("text-sm font-medium", getQuotaColor(quotas.urgent.current, quotas.urgent.limit))} data-testid="text-urgent-quota">
            Urgent: {formatQuota(quotas.urgent.current, quotas.urgent.limit)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3", className)} data-testid="quota-display-detailed">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Job Posting</span>
        </div>
        <span className={cn("text-sm font-bold", getQuotaColor(quotas.jobPosting.current, quotas.jobPosting.limit))} data-testid="text-job-quota-detailed">
          {formatQuota(quotas.jobPosting.current, quotas.jobPosting.limit)}
        </span>
      </div>

      {quotas.featured && quotas.featured.limit !== 0 && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Featured Jobs</span>
          </div>
          <span className={cn("text-sm font-bold", getQuotaColor(quotas.featured.current, quotas.featured.limit))} data-testid="text-featured-quota-detailed">
            {formatQuota(quotas.featured.current, quotas.featured.limit)}
          </span>
        </div>
      )}

      {quotas.urgent && quotas.urgent.limit !== 0 && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Urgent Jobs</span>
          </div>
          <span className={cn("text-sm font-bold", getQuotaColor(quotas.urgent.current, quotas.urgent.limit))} data-testid="text-urgent-quota-detailed">
            {formatQuota(quotas.urgent.current, quotas.urgent.limit)}
          </span>
        </div>
      )}

      {quotas.cvDownload && quotas.cvDownload.limit !== 0 && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">CV Downloads</span>
          </div>
          <span className={cn("text-sm font-bold", getQuotaColor(quotas.cvDownload.current, quotas.cvDownload.limit))} data-testid="text-cv-quota-detailed">
            {formatQuota(quotas.cvDownload.current, quotas.cvDownload.limit)}
          </span>
        </div>
      )}
    </div>
  );
}
