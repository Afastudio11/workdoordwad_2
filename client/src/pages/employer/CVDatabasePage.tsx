/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE (Professional+ plans only)
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - PLAN REQUIRED: professional or enterprise
 * - ROUTE: /employer/cv-database
 * - DO NOT import admin or worker components
 */
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { 
  Search, 
  Download,
  Crown,
  Lock,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Eye,
  Filter,
  ChevronDown,
  User,
  FileText
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  education?: string;
  experience?: string;
  skills: string[];
  currentRole?: string;
  expectedSalary?: string;
  resumeUrl?: string;
  updatedAt: string;
}

interface CVDatabaseResponse {
  candidates: Candidate[];
  total: number;
  downloads: {
    current: number;
    limit: number | "unlimited";
  };
}

export default function CVDatabasePage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [educationFilter, setEducationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["/api/companies/my-companies"],
    select: (data: any[]) => data?.[0],
  });

  const plan = company?.subscriptionPlan || "free";
  const hasAccess = plan === "professional" || plan === "enterprise";

  const { data: cvData, isLoading: cvLoading, refetch } = useQuery<CVDatabaseResponse>({
    queryKey: ["/api/employer/cv-database", {
      search: searchQuery,
      skill: skillFilter,
      education: educationFilter,
      experience: experienceFilter,
      location: locationFilter,
    }],
    enabled: hasAccess,
  });

  const downloadMutation = useMutation({
    mutationFn: async (candidateId: string) => {
      const response = await apiRequest(`/api/employer/cv-database/${candidateId}/download`, "POST");
      return await response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "CV Downloaded",
        description: data?.message || "The CV has been downloaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/employer/cv-database"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employer/quota"] });
    },
    onError: (error: any) => {
      toast({
        title: "Download Failed",
        description: error?.message || "Failed to download CV. You may have reached your quota limit.",
        variant: "destructive",
      });
    },
  });

  const handleDownload = (candidateId: string) => {
    const canDownload = cvData?.downloads.limit === "unlimited" || 
      (typeof cvData?.downloads.limit === "number" && 
       cvData.downloads.current < cvData.downloads.limit);

    if (!canDownload) {
      toast({
        title: "Quota Exceeded",
        description: "You've reached your CV download limit. Please upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    downloadMutation.mutate(candidateId);
  };

  const handleSearch = () => {
    refetch();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSkillFilter("");
    setEducationFilter("");
    setExperienceFilter("");
    setLocationFilter("");
  };

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
            CV Database
          </h1>
          <p className="text-gray-600 mt-1">
            Browse and download CVs from qualified candidates
          </p>
        </div>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-purple-600" />
              <CardTitle className="text-xl">Premium Feature</CardTitle>
            </div>
            <CardDescription className="text-base">
              CV Database access is available for Professional and Enterprise plans only
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Search className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Advanced Search</p>
                  <p className="text-sm text-gray-600">
                    Filter by skills, education, experience, and location
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">CV Downloads</p>
                  <p className="text-sm text-gray-600">
                    Professional: 50/month • Enterprise: Unlimited
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Verified Candidates</p>
                  <p className="text-sm text-gray-600">
                    Access profiles from verified job seekers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Direct Contact</p>
                  <p className="text-sm text-gray-600">
                    Get contact information to reach out directly
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
            CV Database
          </h1>
          <p className="text-gray-600 mt-1">
            Browse and contact qualified candidates
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
          <Crown className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">
            {plan.toUpperCase()} PLAN
          </span>
        </div>
      </div>

      {/* Download Quota */}
      {cvData?.downloads && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">CV Downloads</p>
                  <p className="text-xs text-gray-600">
                    {cvData.downloads.current} of {cvData.downloads.limit === "unlimited" ? "∞" : cvData.downloads.limit} used
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {cvData.downloads.limit === "unlimited" 
                    ? "∞" 
                    : (cvData.downloads.limit as number) - cvData.downloads.current}
                </p>
                <p className="text-xs text-gray-600">remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search by name, skills, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                data-testid="input-search"
              />
            </div>
            <Button onClick={handleSearch} data-testid="button-search">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger data-testid="select-skill-filter">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Skills</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={educationFilter} onValueChange={setEducationFilter}>
              <SelectTrigger data-testid="select-education-filter">
                <SelectValue placeholder="All Education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Education</SelectItem>
                <SelectItem value="sma">SMA/SMK</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="sarjana">Sarjana (S1)</SelectItem>
                <SelectItem value="magister">Magister (S2)</SelectItem>
                <SelectItem value="doktor">Doktor (S3)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger data-testid="select-experience-filter">
                <SelectValue placeholder="All Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Experience</SelectItem>
                <SelectItem value="fresh-graduate">Fresh Graduate</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5+">5+ years</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger data-testid="select-location-filter">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                <SelectItem value="jakarta">Jakarta</SelectItem>
                <SelectItem value="surabaya">Surabaya</SelectItem>
                <SelectItem value="bandung">Bandung</SelectItem>
                <SelectItem value="bali">Bali</SelectItem>
                <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || skillFilter || educationFilter || experienceFilter || locationFilter) && (
            <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters">
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        {cvLoading ? (
          <div className="text-center py-12 text-gray-500">Loading candidates...</div>
        ) : !cvData?.candidates || cvData.candidates.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="font-semibold">No candidates found</p>
                <p className="text-sm">Try adjusting your search filters</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Found {cvData.total} candidate{cvData.total !== 1 ? 's' : ''}
            </div>
            {cvData.candidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-candidate-name-${candidate.id}`}>
                            {candidate.name}
                          </h3>
                          {candidate.currentRole && (
                            <p className="text-sm text-gray-600">{candidate.currentRole}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {candidate.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {candidate.location}
                          </div>
                        )}
                        {candidate.education && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <GraduationCap className="w-4 h-4" />
                            {candidate.education}
                          </div>
                        )}
                        {candidate.experience && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            {candidate.experience}
                          </div>
                        )}
                        {candidate.expectedSalary && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Award className="w-4 h-4" />
                            Expected: {candidate.expectedSalary}
                          </div>
                        )}
                      </div>

                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {candidate.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-gray-100">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Updated {new Date(candidate.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleDownload(candidate.id)}
                        disabled={downloadMutation.isPending}
                        data-testid={`button-download-cv-${candidate.id}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {downloadMutation.isPending ? "Downloading..." : "Download CV"}
                      </Button>
                      {candidate.email && (
                        <Button
                          variant="outline"
                          onClick={() => window.location.href = `mailto:${candidate.email}`}
                          data-testid={`button-contact-${candidate.id}`}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
