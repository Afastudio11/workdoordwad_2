/**
 * ADMIN ONLY: Company Directory
 * - Displays all companies registered on the platform
 * - Admin can view, edit, suspend, delete companies
 * - Filter by subscription plan, status, employee count
 * - Export company data
 */
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  Search,
  Edit,
  Ban,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  CreditCard,
  FileText,
  Image as ImageIcon,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import type { Company } from "@shared/schema";

export default function AdminCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [employeeCountFilter, setEmployeeCountFilter] = useState<string>("all");
  const [subscriptionPlanFilter, setSubscriptionPlanFilter] = useState<string>("all");

  const { data: companies, isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  // Get unique industries for filter
  const industries = Array.from(
    new Set(companies?.map((c) => c.industry).filter((ind): ind is string => Boolean(ind)))
  );

  const getEmployeeCountRange = (employeeCount: string | null): number => {
    if (!employeeCount) return 0;
    // Parse employee count ranges like "1-50", "50-100", "500+"
    if (employeeCount.includes("+")) {
      return parseInt(employeeCount) || 1000;
    }
    if (employeeCount.includes("-")) {
      const max = employeeCount.split("-")[1];
      return parseInt(max) || 0;
    }
    return parseInt(employeeCount) || 0;
  };

  const filteredCompanies = companies?.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && company.isVerified) ||
      (statusFilter === "unverified" && !company.isVerified);

    const matchesIndustry =
      industryFilter === "all" ||
      company.industry === industryFilter;

    const employeeCount = getEmployeeCountRange(company.employeeCount);
    const matchesEmployeeCount =
      employeeCountFilter === "all" ||
      (employeeCountFilter === "1-50" && employeeCount <= 50) ||
      (employeeCountFilter === "51-200" && employeeCount > 50 && employeeCount <= 200) ||
      (employeeCountFilter === "201-500" && employeeCount > 200 && employeeCount <= 500) ||
      (employeeCountFilter === "500+" && employeeCount > 500);

    const matchesSubscriptionPlan =
      subscriptionPlanFilter === "all" ||
      company.subscriptionPlan === subscriptionPlanFilter;

    return matchesSearch && matchesStatus && matchesIndustry && matchesEmployeeCount && matchesSubscriptionPlan;
  });

  const handleExport = () => {
    if (!companies) return;

    const csvContent = [
      ["Company Name", "Industry", "Location", "Employee Count", "Verified", "Website"],
      ...companies.map((c) => [
        c.name,
        c.industry || "",
        c.location || "",
        c.employeeCount || "",
        c.isVerified ? "Yes" : "No",
        c.website || ""
      ])
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `companies_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
            Company Directory
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all companies registered on the platform
          </p>
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="gap-2"
          data-testid="button-export"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search companies by name, industry, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-companies"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
            data-testid="select-status-filter"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 flex-1"
            data-testid="select-industry-filter"
          >
            <option value="all">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          <select
            value={employeeCountFilter}
            onChange={(e) => setEmployeeCountFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 flex-1"
            data-testid="select-employee-filter"
          >
            <option value="all">All Company Sizes</option>
            <option value="1-50">1-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>

          <select
            value={subscriptionPlanFilter}
            onChange={(e) => setSubscriptionPlanFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 flex-1"
            data-testid="select-subscription-filter"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="standard">Standard</option>
            <option value="basic">Basic</option>
            <option value="medium">Medium</option>
            <option value="professional">Professional</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">
              Verified: {companies?.filter((c) => c.isVerified).length || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-700">
              Unverified: {companies?.filter((c) => !c.isVerified).length || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Total: {companies?.length || 0}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading companies...</div>
        </div>
      ) : !filteredCompanies || filteredCompanies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? "No companies found" : "No companies registered"}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search terms or filters"
                : "No companies have registered yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <Card key={company.id} data-testid={`card-company-${company.id}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-[#D4FF00] flex items-center justify-center shrink-0">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{company.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {company.isVerified ? (
                        <Badge variant="default" className="bg-green-500 text-white gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {company.industry && (
                    <Badge variant="outline">{company.industry}</Badge>
                  )}
                  {company.subscriptionPlan && (
                    <Badge 
                      variant="default" 
                      className={`gap-1 ${
                        company.subscriptionPlan === 'professional' ? 'bg-purple-600' :
                        company.subscriptionPlan === 'medium' ? 'bg-blue-600' :
                        company.subscriptionPlan === 'basic' ? 'bg-green-600' :
                        company.subscriptionPlan === 'standard' ? 'bg-yellow-600' :
                        'bg-gray-600'
                      } text-white`}
                    >
                      <CreditCard className="w-3 h-3" />
                      {company.subscriptionPlan.charAt(0).toUpperCase() + company.subscriptionPlan.slice(1)}
                    </Badge>
                  )}
                </div>

                {company.description && (
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {company.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  {company.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {company.location}
                    </div>
                  )}
                  {company.employeeCount && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {company.employeeCount}
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Document Links */}
                {(company.logo || company.legalDocUrl) && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Dokumen:</p>
                    <div className="flex gap-2">
                      {company.logo && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 flex-1"
                          onClick={() => window.open(company.logo!, '_blank')}
                          data-testid={`button-view-logo-${company.id}`}
                        >
                          <ImageIcon className="w-3 h-3" />
                          Logo
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                      {company.legalDocUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 flex-1"
                          onClick={() => window.open(company.legalDocUrl!, '_blank')}
                          data-testid={`button-view-legal-doc-${company.id}`}
                        >
                          <FileText className="w-3 h-3" />
                          Legal Doc
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    data-testid={`button-edit-${company.id}`}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    data-testid={`button-suspend-${company.id}`}
                  >
                    <Ban className="w-3 h-3" />
                    Suspend
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-red-600 hover:text-red-700"
                    data-testid={`button-delete-${company.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
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
