import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

export function VerifiedBadge({ 
  className, 
  size = "md",
  showTooltip = true 
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span 
      className={cn("inline-flex items-center", className)}
      title={showTooltip ? "Verified Company" : undefined}
      data-testid="badge-verified"
    >
      <CheckCircle2 
        className={cn(
          "text-blue-500 fill-blue-100",
          sizeClasses[size]
        )} 
      />
    </span>
  );
}
