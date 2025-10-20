/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/plans-billing
 * - DO NOT import admin or worker components
 */
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
      id: "standard",
      name: "Standard",
      price: "Rp 149.000",
      priceColor: "text-orange-600",
      features: [
        { text: "1 Bulan Masa Aktif", enabled: true },
        { text: "5 Job Posting Reguler", enabled: true },
        { text: "Job Posting Premium", enabled: false },
        { text: "Job Invitation", enabled: false },
        { text: "Talent Search", enabled: false },
        { text: "Unlimited Job Applications", enabled: true },
      ],
    },
    {
      id: "basic",
      name: "Basic",
      price: "Rp 249.000",
      priceColor: "text-pink-600",
      features: [
        { text: "3 Bulan Masa Aktif", enabled: true },
        { text: "10 Job Posting Reguler", enabled: true },
        { text: "+1 Job Posting Premium", enabled: true },
        { text: "20 Job Invitation", enabled: true },
        { text: "Talent Search", enabled: true },
        { text: "Unlimited Job Applications", enabled: true },
      ],
    },
    {
      id: "medium",
      name: "Medium",
      price: "Rp 499.000",
      priceColor: "text-purple-600",
      features: [
        { text: "6 Bulan Masa Aktif", enabled: true },
        { text: "20 Job Posting Reguler", enabled: true },
        { text: "+3 Job Posting Premium", enabled: true },
        { text: "50 Job Invitation", enabled: true },
        { text: "Talent Search", enabled: true },
        { text: "Unlimited Job Applications", enabled: true },
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: "Rp 999.000",
      priceColor: "text-blue-600",
      features: [
        { text: "12 Bulan Masa Aktif", enabled: true },
        { text: "50 Job Posting Reguler", enabled: true },
        { text: "+7 Job Posting Premium", enabled: true },
        { text: "150 Job Invitation", enabled: true },
        { text: "Talent Search", enabled: true },
        { text: "Unlimited Job Applications", enabled: true },
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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className="relative bg-white shadow-sm hover:shadow-md transition-shadow"
            data-testid={`card-plan-${plan.id}`}
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className={`text-4xl font-bold ${plan.priceColor}`}>{plan.price}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    {feature.enabled ? (
                      <span className="text-black font-medium">{feature.text}</span>
                    ) : (
                      <span className="text-gray-400 line-through">{feature.text}</span>
                    )}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                data-testid={`button-select-${plan.id}`}
              >
                Coba Sekarang
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
