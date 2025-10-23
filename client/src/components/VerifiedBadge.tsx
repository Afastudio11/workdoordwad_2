import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Crown, Award, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SubscriptionPlan = "free" | "starter" | "professional" | "enterprise" | null;

interface VerifiedBadgeProps {
  plan: SubscriptionPlan;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const planConfig = {
  free: {
    icon: null,
    label: null,
    color: "",
    tooltip: null,
  },
  starter: {
    icon: CheckCircle2,
    label: "Verified",
    color: "bg-blue-500 text-white hover:bg-blue-600",
    tooltip: "Verified Starter Company",
  },
  professional: {
    icon: Award,
    label: "Professional",
    color: "bg-purple-500 text-white hover:bg-purple-600",
    tooltip: "Verified Professional Company",
  },
  enterprise: {
    icon: Crown,
    label: "Enterprise",
    color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600",
    tooltip: "Verified Enterprise Company",
  },
};

const sizeConfig = {
  sm: {
    iconSize: 12,
    badgeClass: "h-5 text-xs px-1.5",
    textClass: "ml-1",
  },
  md: {
    iconSize: 14,
    badgeClass: "h-6 text-sm px-2",
    textClass: "ml-1.5",
  },
  lg: {
    iconSize: 16,
    badgeClass: "h-7 text-base px-2.5",
    textClass: "ml-2",
  },
};

export function VerifiedBadge({ 
  plan, 
  size = "md", 
  showText = true,
  className = "" 
}: VerifiedBadgeProps) {
  // Don't show badge for free plan
  if (!plan || plan === "free") {
    return null;
  }

  const config = planConfig[plan];
  const sizeConf = sizeConfig[size];
  
  if (!config.icon) return null;

  const Icon = config.icon;

  const badge = (
    <Badge 
      className={`${config.color} ${sizeConf.badgeClass} ${className} flex items-center gap-0.5`}
      data-testid={`badge-${plan}`}
    >
      <Icon size={sizeConf.iconSize} />
      {showText && (
        <span className={sizeConf.textClass}>{config.label}</span>
      )}
    </Badge>
  );

  if (config.tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}

// Standalone icon version for smaller spaces
export function VerifiedIcon({ plan, size = 16 }: { plan: SubscriptionPlan; size?: number }) {
  if (!plan || plan === "free") {
    return null;
  }

  const config = planConfig[plan];
  if (!config.icon) return null;

  const Icon = config.icon;
  
  const colorMap = {
    starter: "text-blue-500",
    professional: "text-purple-500",
    enterprise: "text-amber-500",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon 
            size={size} 
            className={`${colorMap[plan]} inline-block`}
            data-testid={`icon-${plan}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
