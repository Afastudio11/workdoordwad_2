import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building2, Users, Briefcase } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";

type Company = {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  description: string;
  activeJobs: number;
  logo?: string;
};

export default function FindEmployersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  const { data: companies, isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const filteredCompanies = companies?.filter((company) => {
    const matchesSearch =
      !searchQuery ||
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      company.location?.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesIndustry =
      !industryFilter ||
      company.industry?.toLowerCase().includes(industryFilter.toLowerCase());

    return matchesSearch && matchesLocation && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
            Find Employers
          </h1>
          <p className="text-gray-600 mt-2">
            Discover companies and explore career opportunities
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by company name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-companies"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                  data-testid="input-location-filter"
                />
              </div>

              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Industry..."
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="pl-10"
                  data-testid="input-industry-filter"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading companies...</div>
          </div>
        ) : !filteredCompanies || filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || locationFilter || industryFilter
                  ? "No companies found"
                  : "No companies available"}
              </h3>
              <p className="text-gray-600">
                {searchQuery || locationFilter || industryFilter
                  ? "Try adjusting your filters"
                  : "Check back later for new companies"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow" data-testid={`card-company-${company.id}`}>
                <CardHeader>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1 truncate" data-testid={`text-company-name-${company.id}`}>
                        {company.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{company.location}</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {company.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{company.industry}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{company.size}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {company.activeJobs} Active Jobs
                        </Badge>
                        <Button variant="outline" size="sm" data-testid={`button-view-jobs-${company.id}`}>
                          View Jobs
                        </Button>
                      </div>
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
