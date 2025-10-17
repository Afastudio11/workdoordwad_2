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
      logo: string | null;
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
      return await apiRequest(`/api/wishlists/${jobId}`, {
        method: "DELETE",
      });
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
    if (normalized === 'full-time') return "Penuh Waktu";
    if (normalized === 'part-time') return "Paruh Waktu";
    if (normalized === 'contract') return "Kontrak";
    return "Freelance";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!wishlists || wishlists.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Belum Ada Lowongan Tersimpan
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Simpan lowongan yang menarik untuk ditinjau kemudian
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
          Lowongan Tersimpan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {wishlists.length} lowongan tersimpan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishlists.map((wishlist, index) => (
          <Card key={wishlist.id} data-testid={`card-wishlist-${index}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1" data-testid={`text-job-title-${index}`}>
                    {wishlist.job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm" data-testid={`text-company-${index}`}>
                    {wishlist.job.company.name}
                  </p>
                </div>
                <button
                  onClick={() => removeFromWishlistMutation.mutate(wishlist.jobId)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  data-testid={`button-remove-${index}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span data-testid={`text-location-${index}`}>{wishlist.job.location}</span>
                  <span className="ml-auto px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                    {getJobTypeBadge(wishlist.job.jobType)}
                  </span>
                </div>
                {wishlist.job.salaryMin && wishlist.job.salaryMax && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white" data-testid={`text-salary-${index}`}>
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
