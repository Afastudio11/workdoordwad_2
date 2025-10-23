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
import { CreditCard, Check, X, TrendingUp } from "lucide-react";
import type { PremiumTransaction } from "@shared/schema";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  priceColor: string;
  features: PlanFeature[];
}

export default function PlansBillingPage() {
  const { data: transactions, isLoading } = useQuery<PremiumTransaction[]>({
    queryKey: ["/api/premium/transactions"],
  });

  const plans: Plan[] = [
    {
      id: "standard",
      name: "Standard",
      price: "Rp\n149.000",
      priceValue: 149000,
      priceColor: "text-orange-600",
      features: [
        { text: "1 Bulan Masa Aktif", included: true },
        { text: "5 Job Posting Reguler", included: true },
        { text: "Job Posting Premium", included: false },
        { text: "Job Invitation", included: false },
        { text: "Talent Search", included: false },
        { text: "Unlimited Job Applications", included: true },
      ],
    },
    {
      id: "basic",
      name: "Basic",
      price: "Rp\n249.000",
      priceValue: 249000,
      priceColor: "text-pink-600",
      features: [
        { text: "3 Bulan Masa Aktif", included: true },
        { text: "10 Job Posting Reguler", included: true },
        { text: "+1 Job Posting Premium", included: true },
        { text: "20 Job Invitation", included: true },
        { text: "Talent Search", included: true },
        { text: "Unlimited Job Applications", included: true },
      ],
    },
    {
      id: "medium",
      name: "Medium",
      price: "Rp\n499.000",
      priceValue: 499000,
      priceColor: "text-purple-600",
      features: [
        { text: "6 Bulan Masa Aktif", included: true },
        { text: "20 Job Posting Reguler", included: true },
        { text: "+3 Job Posting Premium", included: true },
        { text: "50 Job Invitation", included: true },
        { text: "Talent Search", included: true },
        { text: "Unlimited Job Applications", included: true },
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: "Rp\n999.000",
      priceValue: 999000,
      priceColor: "text-blue-600",
      features: [
        { text: "12 Bulan Masa Aktif", included: true },
        { text: "50 Job Posting Reguler", included: true },
        { text: "+7 Job Posting Premium", included: true },
        { text: "150 Job Invitation", included: true },
        { text: "Talent Search", included: true },
        { text: "Unlimited Job Applications", included: true },
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
            className="relative bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
            data-testid={`card-plan-${plan.id}`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-black mb-4">
                {plan.name}
              </CardTitle>
              <div className="mt-2">
                <div className={`text-4xl font-bold ${plan.priceColor} whitespace-pre-line leading-tight`}>
                  {plan.price}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    {feature.included ? (
                      <>
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">{feature.text}</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400 line-through">{feature.text}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                data-testid={`button-select-${plan.id}`}
              >
                Coba Sekarang
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
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
              <p className="text-sm text-gray-500 mt-2">
                Your transaction history will appear here after you subscribe to a plan
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid={`transaction-${transaction.id}`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{transaction.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      Rp {transaction.amount.toLocaleString('id-ID')}
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
