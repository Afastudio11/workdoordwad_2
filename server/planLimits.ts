import type { Company } from "@shared/schema";

export type SubscriptionPlan = "free" | "starter" | "professional" | "enterprise";

export interface PlanLimits {
  jobPostingLimit: number | "unlimited";
  featuredJobLimit: number | "unlimited";
  urgentJobLimit: number | "unlimited";
  cvDownloadLimit: number | "unlimited";
  hasAnalytics: boolean;
  analyticsLevel: "none" | "basic" | "advanced";
  hasCVDatabase: boolean;
  hasVerifiedBadge: boolean;
  jobDuration: number; // days
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    jobPostingLimit: 3,
    featuredJobLimit: 0,
    urgentJobLimit: 0,
    cvDownloadLimit: 0,
    hasAnalytics: false,
    analyticsLevel: "none",
    hasCVDatabase: false,
    hasVerifiedBadge: false,
    jobDuration: 30,
  },
  starter: {
    jobPostingLimit: 10,
    featuredJobLimit: 3,
    urgentJobLimit: 0,
    cvDownloadLimit: 0,
    hasAnalytics: true,
    analyticsLevel: "basic",
    hasCVDatabase: false,
    hasVerifiedBadge: true,
    jobDuration: 30,
  },
  professional: {
    jobPostingLimit: 30,
    featuredJobLimit: "unlimited",
    urgentJobLimit: "unlimited",
    cvDownloadLimit: 100,
    hasAnalytics: true,
    analyticsLevel: "advanced",
    hasCVDatabase: true,
    hasVerifiedBadge: true,
    jobDuration: 30,
  },
  enterprise: {
    jobPostingLimit: "unlimited",
    featuredJobLimit: "unlimited",
    urgentJobLimit: "unlimited",
    cvDownloadLimit: "unlimited",
    hasAnalytics: true,
    analyticsLevel: "advanced",
    hasCVDatabase: true,
    hasVerifiedBadge: true,
    jobDuration: 30,
  },
};

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  current?: number;
  limit?: number | "unlimited";
}

export function checkJobPostingQuota(company: Company): QuotaCheckResult {
  const plan = company.subscriptionPlan as SubscriptionPlan;
  const limits = PLAN_LIMITS[plan];
  const current = company.jobPostingCount || 0;

  if (limits.jobPostingLimit === "unlimited") {
    return { allowed: true };
  }

  if (current >= limits.jobPostingLimit) {
    return {
      allowed: false,
      reason: `Quota posting pekerjaan Anda sudah habis (${current}/${limits.jobPostingLimit}). Upgrade paket untuk posting lebih banyak.`,
      current,
      limit: limits.jobPostingLimit,
    };
  }

  return { allowed: true, current, limit: limits.jobPostingLimit };
}

export function checkFeaturedJobQuota(company: Company): QuotaCheckResult {
  const plan = company.subscriptionPlan as SubscriptionPlan;
  const limits = PLAN_LIMITS[plan];
  const current = company.featuredJobCount || 0;

  if (limits.featuredJobLimit === 0) {
    return {
      allowed: false,
      reason: "Fitur Featured Job tidak tersedia di paket Free. Upgrade ke Starter atau lebih tinggi.",
      current: 0,
      limit: 0,
    };
  }

  if (limits.featuredJobLimit === "unlimited") {
    return { allowed: true };
  }

  if (current >= limits.featuredJobLimit) {
    return {
      allowed: false,
      reason: `Quota Featured Job Anda sudah habis (${current}/${limits.featuredJobLimit}). Upgrade ke Professional untuk unlimited featured jobs.`,
      current,
      limit: limits.featuredJobLimit,
    };
  }

  return { allowed: true, current, limit: limits.featuredJobLimit };
}

export function checkUrgentJobQuota(company: Company): QuotaCheckResult {
  const plan = company.subscriptionPlan as SubscriptionPlan;
  const limits = PLAN_LIMITS[plan];
  const current = company.urgentJobCount || 0;

  if (limits.urgentJobLimit === 0) {
    return {
      allowed: false,
      reason: "Fitur Urgent Job hanya tersedia di paket Professional dan Enterprise.",
      current: 0,
      limit: 0,
    };
  }

  if (limits.urgentJobLimit === "unlimited") {
    return { allowed: true };
  }

  if (current >= limits.urgentJobLimit) {
    return {
      allowed: false,
      reason: `Quota Urgent Job Anda sudah habis (${current}/${limits.urgentJobLimit}).`,
      current,
      limit: limits.urgentJobLimit,
    };
  }

  return { allowed: true, current, limit: limits.urgentJobLimit };
}

export function checkCVDownloadQuota(company: Company): QuotaCheckResult {
  const plan = company.subscriptionPlan as SubscriptionPlan;
  const limits = PLAN_LIMITS[plan];
  const current = company.cvDownloadCount || 0;

  if (limits.cvDownloadLimit === 0) {
    return {
      allowed: false,
      reason: "Akses CV Database hanya tersedia di paket Professional dan Enterprise.",
      current: 0,
      limit: 0,
    };
  }

  if (limits.cvDownloadLimit === "unlimited") {
    return { allowed: true };
  }

  if (current >= limits.cvDownloadLimit) {
    return {
      allowed: false,
      reason: `Quota download CV Anda sudah habis (${current}/${limits.cvDownloadLimit}). Upgrade ke Enterprise untuk unlimited downloads.`,
      current,
      limit: limits.cvDownloadLimit,
    };
  }

  return { allowed: true, current, limit: limits.cvDownloadLimit };
}

export function checkAnalyticsAccess(company: Company): QuotaCheckResult {
  const plan = company.subscriptionPlan as SubscriptionPlan;
  const limits = PLAN_LIMITS[plan];

  if (!limits.hasAnalytics) {
    return {
      allowed: false,
      reason: "Fitur Analytics hanya tersedia di paket Starter, Professional, dan Enterprise.",
    };
  }

  return { allowed: true };
}

export function checkCVDatabaseAccess(company: Company): QuotaCheckResult {
  const plan = company.subscriptionPlan as SubscriptionPlan;
  const limits = PLAN_LIMITS[plan];

  if (!limits.hasCVDatabase) {
    return {
      allowed: false,
      reason: "Fitur CV Database hanya tersedia di paket Professional dan Enterprise.",
    };
  }

  return { allowed: true };
}

export function getPlanLimits(plan: SubscriptionPlan): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function getQuotaInfo(company: Company) {
  const plan = company.subscriptionPlan as SubscriptionPlan;
  const limits = PLAN_LIMITS[plan];

  return {
    plan,
    jobPosting: {
      current: company.jobPostingCount || 0,
      limit: limits.jobPostingLimit,
      percentage: limits.jobPostingLimit === "unlimited" 
        ? 0 
        : Math.round(((company.jobPostingCount || 0) / limits.jobPostingLimit) * 100),
    },
    featuredJobs: {
      current: company.featuredJobCount || 0,
      limit: limits.featuredJobLimit,
      percentage: limits.featuredJobLimit === "unlimited" 
        ? 0 
        : limits.featuredJobLimit === 0 
          ? 0 
          : Math.round(((company.featuredJobCount || 0) / limits.featuredJobLimit) * 100),
    },
    urgentJobs: {
      current: company.urgentJobCount || 0,
      limit: limits.urgentJobLimit,
      percentage: limits.urgentJobLimit === "unlimited" 
        ? 0 
        : limits.urgentJobLimit === 0 
          ? 0 
          : Math.round(((company.urgentJobCount || 0) / limits.urgentJobLimit) * 100),
    },
    cvDownloads: {
      current: company.cvDownloadCount || 0,
      limit: limits.cvDownloadLimit,
      percentage: limits.cvDownloadLimit === "unlimited" 
        ? 0 
        : limits.cvDownloadLimit === 0 
          ? 0 
          : Math.round(((company.cvDownloadCount || 0) / limits.cvDownloadLimit) * 100),
    },
    quotaResetDate: company.quotaResetDate,
    features: {
      hasAnalytics: limits.hasAnalytics,
      analyticsLevel: limits.analyticsLevel,
      hasCVDatabase: limits.hasCVDatabase,
      hasVerifiedBadge: limits.hasVerifiedBadge,
    },
  };
}
