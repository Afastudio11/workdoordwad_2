import { useQuery, useMutation } from "@tanstack/react-query";
import { Briefcase, MapPin, Heart, Zap, Sparkles, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Job {
  id: string;
  title: string;
  location: string;
  jobType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  company: {
    name: string;
  };
}

export default function RecommendationsPage() {
  const { toast } = useToast();
  
  const { data: recommendations, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/recommendations"],
  });

  const quickApplyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await apiRequest("/api/applications", "POST", { jobId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({ title: "Lamaran berhasil dikirim!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Gagal mengirim lamaran", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await apiRequest("/api/wishlists", "POST", { jobId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlists"] });
      toast({ title: "Ditambahkan ke wishlist" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Gagal menambahkan ke wishlist",
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} jt`;
    }
    return `Rp ${(amount / 1000).toFixed(0)} rb`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-muted rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2" data-testid="text-page-title">
            <Sparkles className="h-8 w-8 text-primary" />
            Rekomendasi Untuk Anda
          </h1>
          <p className="text-muted-foreground mt-1">
            Lowongan yang sesuai dengan profil dan preferensi Anda
          </p>
        </div>

        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Belum Ada Rekomendasi
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Lengkapi profil Anda (keahlian, preferensi industri, dan lokasi) untuk mendapatkan rekomendasi pekerjaan yang lebih sesuai
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/user/dashboard#profile">
              <Button>
                Lengkapi Profil
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline">
                Jelajahi Semua Lowongan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2" data-testid="text-page-title">
          <Sparkles className="h-8 w-8 text-primary" />
          Rekomendasi Untuk Anda
        </h1>
        <p className="text-muted-foreground mt-1">
          {recommendations.length} lowongan yang cocok dengan profil Anda
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((job, index) => (
          <Card key={job.id} data-testid={`recommendation-card-${index}`} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <Link href={`/jobs/${job.id}`} className="flex-1">
                  <Badge className="mb-3" variant="secondary">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Rekomendasi
                  </Badge>
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1 hover:text-primary transition-colors" data-testid={`recommendation-title-${index}`}>
                        {job.title}
                      </h3>
                      <p className="text-muted-foreground" data-testid={`recommendation-company-${index}`}>
                        {job.company.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span data-testid={`recommendation-location-${index}`}>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.jobType}</span>
                    </div>
                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center gap-1 font-semibold text-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span data-testid={`recommendation-salary-${index}`}>
                          {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      quickApplyMutation.mutate(job.id);
                    }}
                    className="whitespace-nowrap"
                    data-testid={`button-quick-apply-${index}`}
                    disabled={quickApplyMutation.isPending}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Quick Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      addToWishlistMutation.mutate(job.id);
                    }}
                    data-testid={`button-wishlist-${index}`}
                    disabled={addToWishlistMutation.isPending}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link href="/jobs">
          <Button variant="outline">
            Lihat Semua Lowongan
          </Button>
        </Link>
      </div>
    </div>
  );
}
