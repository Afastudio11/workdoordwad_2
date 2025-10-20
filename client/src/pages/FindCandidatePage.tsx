import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Briefcase, GraduationCap, Bookmark, Mail } from "lucide-react";
import EmployerDashboardHeader from "@/components/EmployerDashboardHeader";
import type { User } from "@shared/schema";

export default function FindCandidatePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  const { data: candidates, isLoading } = useQuery<User[]>({
    queryKey: ["/api/candidates"],
  });

  const filteredCandidates = candidates?.filter((candidate) => {
    const matchesSearch =
      !searchQuery ||
      candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      candidate.city?.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesSkill =
      !skillFilter ||
      candidate.skills?.some((skill) =>
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      );

    return matchesSearch && matchesLocation && matchesSkill;
  });

  return (
    <div className="min-h-screen bg-white">
      <EmployerDashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
            Cari Kandidat
          </h1>
          <p className="text-gray-600 mt-2">
            Cari dan temukan kandidat berbakat untuk lowongan pekerjaan Anda
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan nama atau bio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-candidates"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Lokasi..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                  data-testid="input-location-filter"
                />
              </div>

              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Keahlian..."
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="pl-10"
                  data-testid="input-skill-filter"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Memuat kandidat...</div>
          </div>
        ) : !filteredCandidates || filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || locationFilter || skillFilter
                  ? "Tidak ada kandidat ditemukan"
                  : "Belum ada kandidat tersedia"}
              </h3>
              <p className="text-gray-600">
                {searchQuery || locationFilter || skillFilter
                  ? "Coba sesuaikan filter Anda"
                  : "Kembali lagi nanti untuk kandidat baru"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} data-testid={`card-candidate-${candidate.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#D4FF00] flex items-center justify-center shrink-0">
                        <span className="text-xl font-bold text-gray-900">
                          {candidate.fullName?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {candidate.fullName}
                        </CardTitle>
                        {candidate.city && (
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {candidate.city}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {candidate.bio && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {candidate.bio}
                    </p>
                  )}

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{candidate.skills.length - 4} lainnya
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      data-testid={`button-contact-${candidate.id}`}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Hubungi
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid={`button-save-${candidate.id}`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
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
