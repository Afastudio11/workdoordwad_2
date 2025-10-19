import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Loader2, PlusCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertJobSchema, type Company } from "@shared/schema";

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
});

type PostJobFormData = z.infer<typeof postJobFormSchema>;

export default function PostJobPage() {
  const { toast } = useToast();

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
    },
  });

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
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PostJobFormData) => {
    const payload = {
      ...data,
      salaryMin: data.salaryMin && data.salaryMin !== "" ? Number(data.salaryMin) : null,
      salaryMax: data.salaryMax && data.salaryMax !== "" ? Number(data.salaryMax) : null,
      requirements: data.requirements || undefined,
      industry: data.industry || undefined,
      education: data.education || undefined,
      experience: data.experience || undefined,
    };
    createJobMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
          Post a Job
        </h1>
        <p className="text-gray-600 mt-1">
          Create a new job posting to attract qualified candidates
        </p>
      </div>

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

              <Button
                type="submit"
                disabled={createJobMutation.isPending}
                className="w-full md:w-auto"
                data-testid="button-post-job"
              >
                {createJobMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Post Job
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
