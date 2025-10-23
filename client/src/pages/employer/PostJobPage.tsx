/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/post-job
 * - DO NOT import admin or worker components
 */
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Zap, Clock, AlertCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertJobSchema, type Company } from "@shared/schema";
import VerificationBanner from "@/components/VerificationBanner";
import { QuotaDisplay } from "@/components/ui/quota-display";
import { UpgradePrompt } from "@/components/ui/upgrade-prompt";
import { Alert, AlertDescription } from "@/components/ui/alert";

const postJobFormSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  jobType: z.string().min(1, "Job type is required"),
  industry: z.string().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
});

type PostJobFormData = z.infer<typeof postJobFormSchema>;

export default function PostJobPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<"job_posting" | "featured" | "urgent">("job_posting");

  const { data: companies, isLoading: loadingCompanies } = useQuery<Company[]>({
    queryKey: ["/api/companies/my-companies"],
  });

  const form = useForm<PostJobFormData>({
    resolver: zodResolver(postJobFormSchema),
    defaultValues: {
      companyId: "",
      title: "",
      description: "",
      requirements: "",
      location: "",
      jobType: "full-time",
      industry: "",
      salaryMin: "",
      salaryMax: "",
      education: "",
      experience: "",
      isFeatured: false,
      isUrgent: false,
    },
  });

  const selectedCompanyId = form.watch("companyId");
  const selectedCompany = useMemo(() => {
    return companies?.find((c) => c.id === selectedCompanyId);
  }, [companies, selectedCompanyId]);

  const plan = (selectedCompany?.subscriptionPlan || "free") as "free" | "starter" | "professional" | "enterprise";
  
  const canUseFeatured = useMemo(() => {
    if (!selectedCompany) return false;
    if (plan === "free") return false;
    if (plan === "starter") return (selectedCompany.featuredJobCount || 0) < 3;
    return true; // professional and enterprise have unlimited
  }, [selectedCompany, plan]);

  const canUseUrgent = useMemo(() => {
    if (!selectedCompany) return false;
    return plan === "professional" || plan === "enterprise";
  }, [selectedCompany, plan]);

  const canPostJob = useMemo(() => {
    if (!selectedCompany) return false;
    const quotaLimits: Record<string, number | "unlimited"> = {
      free: 3,
      starter: 10,
      professional: 30,
      enterprise: "unlimited",
    };
    const limit = quotaLimits[plan];
    if (limit === "unlimited") return true;
    return (selectedCompany.jobPostingCount || 0) < limit;
  }, [selectedCompany, plan]);

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/jobs", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Job Posted",
        description: "Your job has been posted successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companies/my-companies"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Failed to post job. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PostJobFormData) => {
    if (!canPostJob) {
      setUpgradeFeature("job_posting");
      setShowUpgradePrompt(true);
      return;
    }

    const payload = {
      ...data,
      salaryMin: data.salaryMin && data.salaryMin !== "" ? Number(data.salaryMin) : null,
      salaryMax: data.salaryMax && data.salaryMax !== "" ? Number(data.salaryMax) : null,
      requirements: data.requirements || undefined,
      industry: data.industry || undefined,
      education: data.education || undefined,
      experience: data.experience || undefined,
      isFeatured: data.isFeatured || false,
      isUrgent: data.isUrgent || false,
    };
    createJobMutation.mutate(payload);
  };

  const isBlocked = user?.isBlocked || false;
  const isUnverified = user?.verificationStatus !== "verified";
  const isFormDisabled = isBlocked || isUnverified;

  const getQuotaLimits = () => {
    if (!selectedCompany) return null;
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
      jobPosting: { current: selectedCompany.jobPostingCount || 0, limit: quotaLimits[plan] },
      featured: { current: selectedCompany.featuredJobCount || 0, limit: featuredLimits[plan] },
      urgent: { current: selectedCompany.urgentJobCount || 0, limit: urgentLimits[plan] },
    };
  };

  return (
    <div className="space-y-6">
      {/* Verification Banner */}
      {user && (
        <VerificationBanner
          verificationStatus={user.verificationStatus as "pending" | "verified" | "rejected"}
          rejectionReason={user.rejectionReason}
          isBlocked={user.isBlocked}
          blockedReason={user.blockedReason}
        />
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
          Post a Job
        </h1>
        <p className="text-gray-600 mt-1">
          Create a new job posting to attract qualified candidates
        </p>
      </div>

      {/* Quota Display */}
      {selectedCompany && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Quota Subscription Anda</CardTitle>
            <CardDescription>
              Paket: <strong>{plan.toUpperCase()}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
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

      {/* Quota Warning */}
      {!canPostJob && selectedCompany && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Anda telah mencapai limit posting pekerjaan untuk plan {plan.toUpperCase()}.{" "}
            <button
              onClick={() => {
                setUpgradeFeature("job_posting");
                setShowUpgradePrompt(true);
              }}
              className="underline font-semibold"
            >
              Upgrade sekarang
            </button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Job Details
          </CardTitle>
          <CardDescription>
            Fill in the details for your job posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-company">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingCompanies ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : companies && companies.length > 0 ? (
                          companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No companies found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={6} data-testid="input-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} data-testid="input-requirements" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-job-type">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-industry" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-education">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SMA">SMA</SelectItem>
                          <SelectItem value="D3">D3</SelectItem>
                          <SelectItem value="S1">S1</SelectItem>
                          <SelectItem value="S2">S2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-experience">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-1 tahun">0-1 tahun</SelectItem>
                          <SelectItem value="1-3 tahun">1-3 tahun</SelectItem>
                          <SelectItem value="3-5 tahun">3-5 tahun</SelectItem>
                          <SelectItem value="5+ tahun">5+ tahun</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                          data-testid="input-salary-min"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salaryMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                          data-testid="input-salary-max"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Premium Features */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-900">Premium Features</h3>
                
                {/* Featured Job */}
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            if (checked && !canUseFeatured) {
                              setUpgradeFeature("featured");
                              setShowUpgradePrompt(true);
                              return;
                            }
                            field.onChange(checked);
                          }}
                          disabled={!selectedCompany || !canUseFeatured}
                          data-testid="checkbox-featured"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          Featured Job
                          {plan === "free" && (
                            <Badge variant="secondary" className="text-xs">Starter+</Badge>
                          )}
                        </FormLabel>
                        <FormDescription>
                          Highlight this job in search results (Available on Starter plan and above)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Urgent Job */}
                <FormField
                  control={form.control}
                  name="isUrgent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            if (checked && !canUseUrgent) {
                              setUpgradeFeature("urgent");
                              setShowUpgradePrompt(true);
                              return;
                            }
                            field.onChange(checked);
                          }}
                          disabled={!selectedCompany || !canUseUrgent}
                          data-testid="checkbox-urgent"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-red-600" />
                          Urgent Hiring
                          {(plan === "free" || plan === "starter") && (
                            <Badge variant="secondary" className="text-xs">Professional+</Badge>
                          )}
                        </FormLabel>
                        <FormDescription>
                          Mark as urgent to attract quick applications (Available on Professional plan and above)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={createJobMutation.isPending || isFormDisabled || !canPostJob}
                className="w-full md:w-auto"
                data-testid="button-post-job"
              >
                {createJobMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isFormDisabled ? "Verifikasi Diperlukan" : !canPostJob ? "Quota Habis - Upgrade" : "Post Job"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        open={showUpgradePrompt}
        onOpenChange={setShowUpgradePrompt}
        currentPlan={plan}
        feature={upgradeFeature}
        quotaInfo={
          upgradeFeature === "job_posting" && selectedCompany
            ? { current: selectedCompany.jobPostingCount || 0, limit: getQuotaLimits()!.jobPosting.limit as number }
            : upgradeFeature === "featured" && selectedCompany
            ? { current: selectedCompany.featuredJobCount || 0, limit: getQuotaLimits()!.featured.limit as number }
            : undefined
        }
      />
    </div>
  );
}
