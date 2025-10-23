/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/my-jobs
 * - DO NOT import admin or worker components
 */
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Eye, Edit, Trash2, MapPin, Coins } from "lucide-react";
import { Link } from "wouter";
import { QuotaDisplay } from "@/components/ui/quota-display";
import type { Job, Company } from "@shared/schema";

type JobWithCompany = Job & { company: Company };

export default function MyJobsPage() {
  const { data: jobs, isLoading } = useQuery<JobWithCompany[]>({
    queryKey: ["/api/jobs/my-jobs"],
  });

  const { data: companies } = useQuery<Company[]>({
    queryKey: ["/api/companies/my-companies"],
  });

  const company = companies?.[0]; // Get first company (most users will have one)
  const plan = (company?.subscriptionPlan || "free") as "free" | "starter" | "professional" | "enterprise";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading your jobs...</div>
      </div>
    );
  }

  const getQuotaLimits = () => {
    if (!company) return null;
    const quotaLimits: Record<string, number | "unlimited"> = {
      free: 3,
      starter: 10,
      professional: 30,
      enterprise: "unlimited",
    };
    const featuredLimits: Record<string, number | "unlimited"> = {
      free: 0,
      starter: 3,
      professional: "unlimited",
      enterprise: "unlimited",
    };
    const urgentLimits: Record<string, number | "unlimited"> = {
      free: 0,
      starter: 0,
      professional: "unlimited",
      enterprise: "unlimited",
    };

    return {
      jobPosting: { current: company.jobPostingCount || 0, limit: quotaLimits[plan] },
      featured: { current: company.featuredJobCount || 0, limit: featuredLimits[plan] },
      urgent: { current: company.urgentJobCount || 0, limit: urgentLimits[plan] },
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
            My Jobs
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all your job postings
          </p>
        </div>
        <Link href="/employer/dashboard#post-job">
          <Button data-testid="button-post-new-job">
            <Briefcase className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Quota Display */}
      {company && getQuotaLimits() && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <QuotaDisplay
              plan={plan}
              quotas={{
                jobPosting: getQuotaLimits()!.jobPosting,
                featured: getQuotaLimits()!.featured,
                urgent: getQuotaLimits()!.urgent,
              }}
              variant="compact"
            />
          </CardContent>
        </Card>
      )}

      {!jobs || jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-4">Start by creating your first job posting</p>
            <Link href="/employer/dashboard#post-job">
              <Button data-testid="button-create-first-job">
                Post Your First Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} data-testid={`card-job-${job.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge variant={job.isActive ? "default" : "secondary"}>
                        {job.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {job.isFeatured && (
                        <Badge className="bg-[#D4FF00] text-gray-900">Featured</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{job.company?.name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.jobType}
                  </div>
                  {(job.salaryMin || job.salaryMax) && (
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      {job.salaryMin && job.salaryMax
                        ? `Rp ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                        : job.salaryMin
                        ? `From Rp ${job.salaryMin.toLocaleString()}`
                        : `Up to Rp ${job.salaryMax?.toLocaleString()}`}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-700 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex gap-2 pt-2">
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm" data-testid={`button-view-${job.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" data-testid={`button-edit-${job.id}`}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" data-testid={`button-delete-${job.id}`}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
