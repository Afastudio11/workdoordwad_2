import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: "free" | "starter" | "professional" | "enterprise";
  feature: "job_posting" | "featured" | "urgent" | "analytics" | "cv_database";
  quotaInfo?: {
    current: number;
    limit: number;
  };
}

export function UpgradePrompt({ 
  open, 
  onOpenChange, 
  currentPlan,
  feature,
  quotaInfo 
}: UpgradePromptProps) {
  const featureMessages: Record<string, { title: string; description: string; upgradeTo: string }> = {
    job_posting: {
      title: "Quota Posting Habis!",
      description: `Anda telah mencapai limit ${quotaInfo?.limit} posting pekerjaan di plan ${currentPlan.toUpperCase()}.`,
      upgradeTo: currentPlan === "free" ? "Starter" : currentPlan === "starter" ? "Professional" : "Enterprise",
    },
    featured: {
      title: "Featured Jobs Tidak Tersedia",
      description: currentPlan === "free" 
        ? "Featured jobs hanya tersedia untuk plan Starter ke atas."
        : `Anda telah menggunakan ${quotaInfo?.current} dari ${quotaInfo?.limit} featured jobs di plan ${currentPlan.toUpperCase()}.`,
      upgradeTo: currentPlan === "free" ? "Starter" : "Professional",
    },
    urgent: {
      title: "Urgent Jobs Tidak Tersedia",
      description: "Urgent jobs hanya tersedia untuk plan Professional dan Enterprise.",
      upgradeTo: "Professional",
    },
    analytics: {
      title: "Analytics Tidak Tersedia",
      description: "Analytics dashboard hanya tersedia untuk plan Professional dan Enterprise.",
      upgradeTo: "Professional",
    },
    cv_database: {
      title: "CV Database Tidak Tersedia",
      description: "CV Database hanya tersedia untuk plan Professional dan Enterprise.",
      upgradeTo: "Professional",
    },
  };

  const message = featureMessages[feature];

  const upgradePlans: Record<string, { price: string; features: string[] }> = {
    Starter: {
      price: "Rp 199.000/bulan",
      features: ["10 Job Posting", "3 Featured Jobs", "Verified Badge", "Basic Analytics"],
    },
    Professional: {
      price: "Rp 399.000/bulan",
      features: ["30 Job Posting", "Unlimited Featured", "Unlimited Urgent", "Advanced Analytics", "CV Database (100 downloads)"],
    },
    Enterprise: {
      price: "Hubungi Sales",
      features: ["Unlimited Job Posting", "Unlimited Featured", "Unlimited Urgent", "Advanced Analytics", "Unlimited CV Downloads", "Dedicated Support"],
    },
  };

  const recommendedPlan = upgradePlans[message.upgradeTo];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-upgrade-prompt">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-yellow-600" />
            <DialogTitle className="text-xl">{message.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {message.description}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                Upgrade ke {message.upgradeTo}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {recommendedPlan.price}
              </p>
            </div>
            <Badge className="bg-lime-500 text-white">
              <TrendingUp className="w-3 h-3 mr-1" />
              Recommended
            </Badge>
          </div>

          <ul className="space-y-2">
            {recommendedPlan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
            data-testid="button-cancel-upgrade"
          >
            Nanti Saja
          </Button>
          <Link href="/employer/plans-billing">
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              data-testid="button-view-plans"
            >
              Lihat Semua Paket
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
