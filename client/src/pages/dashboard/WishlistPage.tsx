import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart, MapPin, Briefcase, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Wishlist {
  id: string;
  jobId: string;
  job: {
    id: string;
    title: string;
    location: string;
    jobType: string;
    salaryMin: number | null;
    salaryMax: number | null;
    company: {
      name: string;
    };
  };
}

export default function WishlistPage() {
  const { toast } = useToast();
  
  const { data: wishlists, isLoading } = useQuery<Wishlist[]>({
    queryKey: ["/api/wishlists"],
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return await apiRequest("DELETE", `/api/wishlists/${jobId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlists"] });
      toast({ title: "Lowongan dihapus dari wishlist" });
    },
    onError: () => {
      toast({ title: "Gagal menghapus dari wishlist", variant: "destructive" });
    },
  });

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} jt`;
    }
    return `Rp ${(amount / 1000).toFixed(0)} rb`;
  };

  const getJobTypeBadge = (type: string) => {
    const normalized = type.toLowerCase().replace(/\s+/g, '-');
    if (normalized === 'full-time') return "Full Time";
    if (normalized === 'part-time') return "Part Time";
    if (normalized === 'contract') return "Kontrak";
    return "Freelance";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!wishlists || wishlists.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Wishlist Kosong
        </h3>
        <p className="text-gray-900 mb-6">
          Simpan lowongan yang menarik untuk ditinjau kemudian
        </p>
        <Button asChild>
          <a href="/jobs">Cari Lowongan</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900" data-testid="text-page-title">
          Wishlist
        </h1>
        <p className="text-gray-900 mt-1">
          {wishlists.length} lowongan tersimpan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishlists.map((wishlist, index) => (
          <Card key={wishlist.id} data-testid={`card-wishlist-${index}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1" data-testid={`text-job-title-${index}`}>
                    {wishlist.job.title}
                  </h3>
                  <p className="text-sm text-gray-900" data-testid={`text-company-${index}`}>
                    {wishlist.job.company.name}
                  </p>
                </div>
                <button
                  onClick={() => removeFromWishlistMutation.mutate(wishlist.jobId)}
                  className="text-red-600 hover:opacity-80 transition-opacity"
                  data-testid={`button-remove-${index}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <MapPin className="w-4 h-4" />
                  <span data-testid={`text-location-${index}`}>{wishlist.job.location}</span>
                  <span className="ml-auto px-2 py-0.5 bg-gray-200 text-gray-900 text-xs rounded-md">
                    {getJobTypeBadge(wishlist.job.jobType)}
                  </span>
                </div>
                {wishlist.job.salaryMin && wishlist.job.salaryMax && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-900" />
                    <span className="font-semibold text-gray-900" data-testid={`text-salary-${index}`}>
                      {formatSalary(wishlist.job.salaryMin)} - {formatSalary(wishlist.job.salaryMax)}
                    </span>
                  </div>
                )}
              </div>

              <Link href={`/jobs/${wishlist.jobId}`}>
                <Button className="w-full" variant="outline" data-testid={`button-view-${index}`}>
                  Lihat Detail
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
