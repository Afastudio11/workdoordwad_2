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
import { CreditCard, Check, TrendingUp, Crown, Zap, Clock, BarChart3, Database, CheckCircle2 } from "lucide-react";
import type { PremiumTransaction, Company } from "@shared/schema";

interface PlanFeature {
  text: string;
  included: boolean;
  icon?: React.ReactNode;
}

interface Plan {
  id: "free" | "starter" | "professional" | "enterprise";
  name: string;
  displayName: string;
  tagline: string;
  price: string;
  priceValue: number;
  priceColor: string;
  badge?: string;
  features: PlanFeature[];
  recommended?: boolean;
}

export default function PlansBillingPage() {
  const { data: transactions, isLoading: loadingTransactions } = useQuery<PremiumTransaction[]>({
    queryKey: ["/api/premium/transactions"],
  });

  const { data: companies } = useQuery<Company[]>({
    queryKey: ["/api/companies/my-companies"],
  });

  const currentCompany = companies?.[0];
  const currentPlan = currentCompany?.subscriptionPlan || "free";

  const plans: Plan[] = [
    {
      id: "free",
      name: "GRATIS",
      displayName: "Gratis",
      tagline: "Untuk Memulai",
      price: "Rp 0",
      priceValue: 0,
      priceColor: "text-gray-600",
      features: [
        { text: "3 Job Posting", included: true },
        { text: "Featured Jobs", included: false },
        { text: "Urgent Hiring", included: false },
        { text: "Verified Badge", included: false, icon: <CheckCircle2 className="w-4 h-4" /> },
        { text: "Analytics Dashboard", included: false },
        { text: "CV Database Access", included: false },
      ],
    },
    {
      id: "starter",
      name: "STARTER",
      displayName: "Starter",
      tagline: "Untuk Berkembang",
      price: "Rp 199.000/bulan",
      priceValue: 199000,
      priceColor: "text-lime-600",
      badge: "Populer",
      recommended: true,
      features: [
        { text: "10 Job Posting", included: true },
        { text: "3 Featured Jobs", included: true, icon: <Zap className="w-4 h-4 text-yellow-600" /> },
        { text: "Urgent Hiring", included: false },
        { text: "Verified Badge", included: true, icon: <CheckCircle2 className="w-4 h-4 text-blue-500" /> },
        { text: "Basic Analytics", included: true },
        { text: "CV Database Access", included: false },
      ],
    },
    {
      id: "professional",
      name: "PROFESSIONAL",
      displayName: "Professional",
      tagline: "Solusi Lengkap",
      price: "Rp 399.000/bulan",
      priceValue: 399000,
      priceColor: "text-blue-600",
      badge: "Recommended",
      features: [
        { text: "30 Job Posting", included: true },
        { text: "Unlimited Featured Jobs", included: true, icon: <Zap className="w-4 h-4 text-yellow-600" /> },
        { text: "Unlimited Urgent Hiring", included: true, icon: <Clock className="w-4 h-4 text-red-600" /> },
        { text: "Verified Badge", included: true, icon: <CheckCircle2 className="w-4 h-4 text-blue-500" /> },
        { text: "Advanced Analytics", included: true, icon: <BarChart3 className="w-4 h-4 text-purple-600" /> },
        { text: "CV Database (100 downloads)", included: true, icon: <Database className="w-4 h-4 text-green-600" /> },
      ],
    },
    {
      id: "enterprise",
      name: "ENTERPRISE",
      displayName: "Enterprise",
      tagline: "Custom Solution",
      price: "Hubungi Sales",
      priceValue: 999999,
      priceColor: "text-purple-600",
      badge: "Best Value",
      features: [
        { text: "Unlimited Job Posting", included: true },
        { text: "Unlimited Featured Jobs", included: true, icon: <Zap className="w-4 h-4 text-yellow-600" /> },
        { text: "Unlimited Urgent Hiring", included: true, icon: <Clock className="w-4 h-4 text-red-600" /> },
        { text: "Verified Badge", included: true, icon: <CheckCircle2 className="w-4 h-4 text-blue-500" /> },
        { text: "Advanced Analytics", included: true, icon: <BarChart3 className="w-4 h-4 text-purple-600" /> },
        { text: "Unlimited CV Downloads", included: true, icon: <Database className="w-4 h-4 text-green-600" /> },
        { text: "Dedicated Support", included: true },
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
          Pilih paket yang sesuai dengan kebutuhan rekrutmen Anda
        </p>
      </div>

      {/* Current Plan Badge */}
      {currentCompany && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Paket Saat Ini</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plans.find(p => p.id === currentPlan)?.displayName || "Free"}
                </p>
              </div>
              <Badge className="bg-blue-600 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative bg-white border shadow-sm hover:shadow-lg transition-all duration-300 ${
              plan.recommended 
                ? "border-blue-500 ring-2 ring-blue-200" 
                : currentPlan === plan.id
                ? "border-green-500 ring-2 ring-green-200"
                : "border-gray-200"
            }`}
            data-testid={`card-plan-${plan.id}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className={plan.recommended ? "bg-lime-500 text-white" : "bg-purple-500 text-white"}>
                  {plan.badge}
                </Badge>
              </div>
            )}

            {currentPlan === plan.id && (
              <div className="absolute -top-3 right-4">
                <Badge className="bg-green-600 text-white">
                  Current Plan
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-black mb-1">
                {plan.displayName}
              </CardTitle>
              <p className="text-sm text-gray-600">{plan.tagline}</p>
              <div className="mt-4">
                <div className={`text-3xl font-bold ${plan.priceColor}`}>
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
                        <div className="flex items-center gap-1">
                          {feature.icon}
                          <span className="text-gray-900 font-medium">{feature.text}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full bg-gray-200 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400">{feature.text}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-semibold ${
                  currentPlan === plan.id
                    ? "bg-green-600 hover:bg-green-700"
                    : plan.recommended
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white`}
                disabled={currentPlan === plan.id}
                data-testid={`button-select-${plan.id}`}
              >
                {currentPlan === plan.id ? "Paket Aktif" : plan.id === "enterprise" ? "Hubungi Kami" : "Pilih Paket"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Billing History */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            Riwayat transaksi dan pembayaran Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTransactions ? (
            <div className="text-center py-8 text-gray-500">
              Loading transactions...
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Belum ada riwayat pembayaran</p>
              <p className="text-sm text-gray-500 mt-2">
                Riwayat transaksi akan muncul di sini setelah Anda berlangganan
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
