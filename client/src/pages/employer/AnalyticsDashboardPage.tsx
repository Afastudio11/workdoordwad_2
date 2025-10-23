/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE (Professional+ plans only)
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - PLAN REQUIRED: professional or enterprise
 * - ROUTE: /employer/analytics
 * - DO NOT import admin or worker components
 */
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick, 
  UserCheck,
  Crown,
  Lock,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

interface AdvancedAnalytics {
  demographics: {
    ageDistribution: Array<{ range: string; count: number }>;
    educationLevel: Array<{ level: string; count: number }>;
    experienceLevel: Array<{ level: string; count: number }>;
  };
  conversion: {
    viewToApply: number;
    applyToInterview: number;
    interviewToHire: number;
  };
  jobPerformance: Array<{
    jobTitle: string;
    views: number;
    applications: number;
    conversionRate: number;
  }>;
  applicantQuality: {
    averageExperience: number;
    qualifiedRate: number;
    topSkills: Array<{ skill: string; count: number }>;
  };
}

const COLORS = ['#D4FF00', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function AnalyticsDashboardPage() {
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["/api/companies/my-companies"],
    select: (data: any[]) => data?.[0],
  });

  const plan = company?.subscriptionPlan || "free";
  const hasAccess = plan === "professional" || plan === "enterprise";

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AdvancedAnalytics>({
    queryKey: ["/api/employer/advanced-analytics"],
    enabled: hasAccess,
  });

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
            Advanced Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Unlock detailed insights about your job postings and applicants
          </p>
        </div>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-purple-600" />
              <CardTitle className="text-xl">Premium Feature</CardTitle>
            </div>
            <CardDescription className="text-base">
              Advanced Analytics is available for Professional and Enterprise plans only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <PieChart className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Demographic Insights</p>
                  <p className="text-sm text-gray-600">
                    Age, education, and experience distribution of applicants
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Conversion Tracking</p>
                  <p className="text-sm text-gray-600">
                    Track views to applications to hires conversion rates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Job Performance</p>
                  <p className="text-sm text-gray-600">
                    Compare performance across all your job postings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Applicant Quality</p>
                  <p className="text-sm text-gray-600">
                    Insights on applicant qualifications and top skills
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/employer/dashboard#plans">
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid="button-upgrade-plan"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Professional Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
        <Alert>
          <AlertDescription>
            No analytics data available. Post jobs and receive applications to see insights.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
            Advanced Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Deep insights into your recruitment performance
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
          <Crown className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">
            {plan.toUpperCase()} PLAN
          </span>
        </div>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Conversion Funnel
          </CardTitle>
          <CardDescription>Track applicants through your hiring pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg" data-testid="conversion-view-to-apply">
              <Eye className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">
                {analytics.conversion.viewToApply.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Views → Applications</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg" data-testid="conversion-apply-to-interview">
              <MousePointerClick className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">
                {analytics.conversion.applyToInterview.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Applications → Interviews</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg" data-testid="conversion-interview-to-hire">
              <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-900">
                {analytics.conversion.interviewToHire.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Interviews → Hires</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.demographics.ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
                <Bar dataKey="count" fill="#D4FF00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Education Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Education Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartPieChart>
                <Pie
                  data={analytics.demographics.educationLevel}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, percent }) => `${level}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.demographics.educationLevel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Job Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Job Performance Comparison
          </CardTitle>
          <CardDescription>
            Compare views, applications, and conversion rates across jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.jobPerformance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis dataKey="jobTitle" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
              />
              <Legend />
              <Bar dataKey="views" fill="#3B82F6" name="Views" radius={[8, 8, 0, 0]} />
              <Bar dataKey="applications" fill="#D4FF00" name="Applications" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Applicant Quality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Applicant Quality Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Average Experience</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-avg-experience">
                    {analytics.applicantQuality.averageExperience.toFixed(1)} years
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Qualified Applicants</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-qualified-rate">
                    {analytics.applicantQuality.qualifiedRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Top Skills</p>
              <div className="space-y-2">
                {analytics.applicantQuality.topSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                        <span className="text-sm text-gray-600">{skill.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(skill.count / analytics.applicantQuality.topSkills[0].count) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
