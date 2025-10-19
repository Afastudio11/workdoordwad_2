import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check, Star, TrendingUp } from "lucide-react";
import type { PremiumTransaction } from "@shared/schema";

export default function PlansBillingPage() {
  const { data: transactions, isLoading } = useQuery<PremiumTransaction[]>({
    queryKey: ["/api/premium/transactions"],
  });

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Post up to 3 jobs per month",
        "Basic applicant tracking",
        "Email notifications",
        "Standard support",
      ],
      current: true,
    },
    {
      id: "professional",
      name: "Professional",
      price: "Rp 500,000",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Post unlimited jobs",
        "Advanced applicant tracking",
        "Priority email & chat support",
        "Analytics dashboard",
        "Featured job postings (5/month)",
        "Save unlimited candidates",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Rp 1,500,000",
      period: "/month",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom branding",
        "API access",
        "Unlimited featured postings",
        "Advanced analytics & reporting",
        "Team collaboration tools",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
          Plans & Billing
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your subscription and billing information
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${plan.popular ? 'border-[#D4FF00] border-2' : ''}`}
            data-testid={`card-plan-${plan.id}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#D4FF00] text-gray-900">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-600">{plan.period}</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
                data-testid={`button-select-${plan.id}`}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            View your past transactions and invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading transactions...
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No billing history yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div>
                    <p className="font-medium">{transaction.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      Rp {transaction.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
