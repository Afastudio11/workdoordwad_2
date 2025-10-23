export type SubscriptionPlan = "free" | "starter" | "professional" | "enterprise";

export interface PlanFeatures {
  name: string;
  displayName: string;
  tagline: string;
  badge: {
    color: string;
    icon: string;
  };
  tags?: string[];
  
  // Job posting quotas
  jobPostingQuota: number | "unlimited";
  featuredQuota: number | "unlimited";
  urgentQuota: number | "unlimited";
  
  // Job duration
  jobDuration: number; // days
  
  // Features
  hasVerifiedBadge: boolean;
  hasBasicAnalytics: boolean;
  hasAdvancedAnalytics: boolean;
  hasCVDatabase: boolean;
  cvDownloadQuota: number | "unlimited";
  
  // Support
  supportLevel: "basic" | "standard" | "priority" | "dedicated";
}

export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanFeatures> = {
  free: {
    name: "free",
    displayName: "GRATIS",
    tagline: "Untuk Memulai",
    badge: {
      color: "text-gray-600 bg-gray-100",
      icon: "⚡",
    },
    jobPostingQuota: 3,
    featuredQuota: 0,
    urgentQuota: 0,
    jobDuration: 30,
    hasVerifiedBadge: false,
    hasBasicAnalytics: false,
    hasAdvancedAnalytics: false,
    hasCVDatabase: false,
    cvDownloadQuota: 0,
    supportLevel: "basic",
  },
  
  starter: {
    name: "starter",
    displayName: "STARTER",
    tagline: "Untuk Berkembang",
    badge: {
      color: "text-lime-600 bg-lime-100",
      icon: "✓",
    },
    tags: ["Populer"],
    jobPostingQuota: 10,
    featuredQuota: 3,
    urgentQuota: 0,
    jobDuration: 30,
    hasVerifiedBadge: true,
    hasBasicAnalytics: true,
    hasAdvancedAnalytics: false,
    hasCVDatabase: false,
    cvDownloadQuota: 0,
    supportLevel: "standard",
  },
  
  professional: {
    name: "professional",
    displayName: "PROFESSIONAL",
    tagline: "Solusi Lengkap",
    badge: {
      color: "text-blue-600 bg-blue-100",
      icon: "✓",
    },
    tags: ["Recommended"],
    jobPostingQuota: 30,
    featuredQuota: "unlimited",
    urgentQuota: "unlimited",
    jobDuration: 30,
    hasVerifiedBadge: true,
    hasBasicAnalytics: true,
    hasAdvancedAnalytics: true,
    hasCVDatabase: true,
    cvDownloadQuota: 100,
    supportLevel: "priority",
  },
  
  enterprise: {
    name: "enterprise",
    displayName: "ENTERPRISE",
    tagline: "Custom Solution",
    badge: {
      color: "text-purple-600 bg-purple-100",
      icon: "✓",
    },
    tags: ["Best Value"],
    jobPostingQuota: "unlimited",
    featuredQuota: "unlimited",
    urgentQuota: "unlimited",
    jobDuration: 30,
    hasVerifiedBadge: true,
    hasBasicAnalytics: true,
    hasAdvancedAnalytics: true,
    hasCVDatabase: true,
    cvDownloadQuota: "unlimited",
    supportLevel: "dedicated",
  },
};

export function getPlanConfig(plan: SubscriptionPlan): PlanFeatures {
  return PLAN_CONFIGS[plan];
}

export function canPostJob(
  plan: SubscriptionPlan,
  currentCount: number
): { allowed: boolean; reason?: string } {
  const config = getPlanConfig(plan);
  
  if (config.jobPostingQuota === "unlimited") {
    return { allowed: true };
  }
  
  if (currentCount >= config.jobPostingQuota) {
    const upgradeMessages: Record<SubscriptionPlan, string> = {
      free: "Quota habis! Upgrade ke Starter (Rp 199k)",
      starter: "Quota habis! Upgrade ke Professional",
      professional: "Quota habis! Upgrade ke Enterprise",
      enterprise: "Quota habis!",
    };
    
    return {
      allowed: false,
      reason: upgradeMessages[plan],
    };
  }
  
  return { allowed: true };
}

export function canUseFeatured(
  plan: SubscriptionPlan,
  currentCount: number
): { allowed: boolean; reason?: string } {
  const config = getPlanConfig(plan);
  
  if (config.featuredQuota === 0) {
    return {
      allowed: false,
      reason: "Feature not available in your plan",
    };
  }
  
  if (config.featuredQuota === "unlimited") {
    return { allowed: true };
  }
  
  if (currentCount >= config.featuredQuota) {
    const upgradeMessages: Partial<Record<SubscriptionPlan, string>> = {
      starter: "Quota habis! Upgrade ke Professional",
    };
    
    return {
      allowed: false,
      reason: upgradeMessages[plan] || "Featured quota habis!",
    };
  }
  
  return { allowed: true };
}

export function canUseUrgent(
  plan: SubscriptionPlan,
  currentCount: number
): { allowed: boolean; reason?: string } {
  const config = getPlanConfig(plan);
  
  if (config.urgentQuota === 0) {
    return {
      allowed: false,
      reason: "Feature not available in your plan",
    };
  }
  
  if (config.urgentQuota === "unlimited") {
    return { allowed: true };
  }
  
  if (currentCount >= config.urgentQuota) {
    return {
      allowed: false,
      reason: "Urgent quota habis!",
    };
  }
  
  return { allowed: true };
}

export function canDownloadCV(
  plan: SubscriptionPlan,
  currentCount: number
): { allowed: boolean; reason?: string } {
  const config = getPlanConfig(plan);
  
  if (!config.hasCVDatabase) {
    return {
      allowed: false,
      reason: "CV Database not available in your plan",
    };
  }
  
  if (config.cvDownloadQuota === "unlimited") {
    return { allowed: true };
  }
  
  if (currentCount >= config.cvDownloadQuota) {
    return {
      allowed: false,
      reason: "Quota habis! Upgrade Enterprise",
    };
  }
  
  return { allowed: true };
}

export function getQuotaDisplay(plan: SubscriptionPlan, counts: {
  jobPosting: number;
  featured: number;
  urgent: number;
  cvDownload: number;
}): string {
  const config = getPlanConfig(plan);
  
  const parts: string[] = [];
  
  // Job posting quota
  const jobQuota = config.jobPostingQuota === "unlimited" 
    ? "∞" 
    : `${counts.jobPosting} / ${config.jobPostingQuota}`;
  parts.push(`Job: ${jobQuota}`);
  
  // Featured quota (only show if > 0)
  if (config.featuredQuota !== 0) {
    const featuredQuota = config.featuredQuota === "unlimited"
      ? "∞"
      : `${counts.featured} / ${config.featuredQuota}`;
    parts.push(`Featured: ${featuredQuota}`);
  }
  
  // Urgent quota (only show if > 0)
  if (config.urgentQuota !== 0) {
    const urgentQuota = config.urgentQuota === "unlimited"
      ? "∞"
      : `${counts.urgent} / ${config.urgentQuota}`;
    parts.push(`Urgent: ${urgentQuota}`);
  }
  
  // CV quota (only show if has access)
  if (config.hasCVDatabase) {
    const cvQuota = config.cvDownloadQuota === "unlimited"
      ? "∞"
      : `${counts.cvDownload} / ${config.cvDownloadQuota}`;
    parts.push(`CV: ${cvQuota}`);
  }
  
  return parts.join(", ");
}
