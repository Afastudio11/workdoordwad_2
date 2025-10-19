import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Mail, Phone, MapPin, FileText } from "lucide-react";
import type { SavedCandidate, User } from "@shared/schema";

type SavedCandidateWithUser = SavedCandidate & { candidate: User };

export default function SavedCandidatesPage() {
  const { data: savedCandidates, isLoading } = useQuery<SavedCandidateWithUser[]>({
    queryKey: ["/api/saved-candidates"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading saved candidates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" data-testid="text-page-title">
          Saved Candidate
        </h1>
        <p className="text-gray-600 mt-1">
          View and manage candidates you've saved for future consideration
        </p>
      </div>

      {!savedCandidates || savedCandidates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved candidates</h3>
            <p className="text-gray-600">
              Save candidates from your applications to keep track of promising talent
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedCandidates.map((saved) => {
            const candidate = saved.candidate;
            return (
              <Card key={saved.id} data-testid={`card-candidate-${candidate.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#D4FF00] flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {candidate.fullName?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{candidate.fullName}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{candidate.bio || "No bio available"}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-unsave-${candidate.id}`}>
                      <Bookmark className="w-4 h-4 mr-1 fill-current" />
                      Saved
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {candidate.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {candidate.email}
                      </div>
                    )}
                    {candidate.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {candidate.phone}
                      </div>
                    )}
                    {candidate.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {candidate.city}
                      </div>
                    )}
                  </div>

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {saved.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {saved.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" data-testid={`button-contact-${candidate.id}`}>
                      <Mail className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                    {candidate.cvUrl && (
                      <Button variant="outline" size="sm" data-testid={`button-view-cv-${candidate.id}`}>
                        <FileText className="w-4 h-4 mr-1" />
                        View CV
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
