/**
 * IMPORTANT: THIS IS AN EMPLOYER-ONLY PAGE
 * - MUST USE: EmployerDashboardHeader/RecruiterLayout (NOT AdminLayout or DashboardHeader)
 * - ROLE REQUIRED: pemberi_kerja (employer/recruiter)
 * - ROUTE: /employer/all-companies
 * - DO NOT import admin or worker components
 */
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, Globe, Search } from "lucide-react";
import { useState } from "react";
import type { Company } from "@shared/schema";

export default function AllCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: companies, isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
          All Companies
        </h1>
        <p className="text-gray-600 mt-1">
          Browse all companies registered on the platform
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search companies by name, industry, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-companies"
        />
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
                ? "Try adjusting your search terms"
                : "Be the first to register your company"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
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
                    {company.industry && (
                      <Badge variant="secondary" className="mt-1">
                        {company.industry}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
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
                      {company.employeeCount} employees
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

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  data-testid={`button-view-${company.id}`}
                >
                  View Company Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
