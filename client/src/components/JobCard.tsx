import { MapPin, Building2, Clock, Calendar, Coins, Briefcase, FileText } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface JobCardProps {
  id: string;
  date: string;
  company: string;
  title: string;
  companyLogo?: string | null;
  tags: string[];
  salary: string;
  location: string;
  bgColor?: string;
  icon?: string;
  jobType?: string;
  isVerified?: boolean;
}

export default function JobCard({
  id,
  date,
  company,
  title,
  tags,
  salary,
  location,
  companyLogo,
  jobType = "Penuh Waktu",
  isVerified = false,
}: JobCardProps) {
  const category = tags[0] || "Umum";
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const { data: jobDetail, isLoading } = useQuery({
    queryKey: ["/api/jobs", id],
    enabled: showDetailDialog,
  });

  const job = jobDetail as any;

  return (
    <>
      <div className="card-interactive card-padding bg-gray-100 dark:bg-gray-800" data-testid={`card-job-${id}`}>
        <div className="flex items-start gap-3 mb-4">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt={`${company} logo`}
              className="w-12 h-12 object-cover rounded-lg border border-border"
              data-testid={`img-company-logo-${id}`}
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="heading-4 text-heading mb-2" data-testid={`text-job-title-${id}`}>{title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              <span data-testid={`text-location-${id}`}>{location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-body mb-3">
          <Building2 className="h-4 w-4" />
          <span data-testid={`text-company-${id}`}>{company}</span>
          {isVerified && <VerifiedBadge size="sm" />}
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <Badge variant="secondary">
            {jobType}
          </Badge>
        </div>

        <div className="text-sm text-body mb-4">
          <span>{category}</span>
          <span className="mx-2">•</span>
          <span className="font-semibold text-heading" data-testid={`text-salary-${id}`}>{salary}</span>
        </div>

        <Button 
          onClick={() => setShowDetailDialog(true)}
          className="w-full btn-cta-primary"
          data-testid={`button-apply-${id}`}
        >
          Lamar Sekarang
        </Button>
      </div>

      {/* Job Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="heading-2 text-heading">
              {isLoading ? "Memuat..." : job?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isLoading ? "Mengambil detail pekerjaan..." : `${job?.company?.name} • ${job?.location}`}
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : job ? (
            <div className="space-y-6 py-4">
              {/* Company Info */}
              <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                {job.company?.logo ? (
                  <img 
                    src={job.company.logo} 
                    alt={`${job.company.name} logo`}
                    className="w-16 h-16 object-cover rounded-lg border border-border"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border border-border">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="heading-4 text-heading">{job.company?.name}</h3>
                    {(job.company?.subscriptionPlan === "starter" || 
                      job.company?.subscriptionPlan === "professional" || 
                      job.company?.subscriptionPlan === "enterprise") && <VerifiedBadge size="md" />}
                  </div>
                  {job.company?.industry && (
                    <p className="body-small text-muted-foreground">{job.company.industry}</p>
                  )}
                  {job.company?.location && (
                    <div className="flex items-center gap-1 body-small text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.company.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Coins className="h-5 w-5 text-black dark:text-primary" />
                  <div>
                    <p className="caption">Gaji</p>
                    <p className="font-semibold text-heading">{job.salary || salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Briefcase className="h-5 w-5 text-black dark:text-primary" />
                  <div>
                    <p className="caption">Tipe Pekerjaan</p>
                    <p className="font-semibold text-heading">{job.jobType || jobType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MapPin className="h-5 w-5 text-black dark:text-primary" />
                  <div>
                    <p className="caption">Lokasi</p>
                    <p className="font-semibold text-heading">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5 text-black dark:text-primary" />
                  <div>
                    <p className="caption">Diposting</p>
                    <p className="font-semibold text-heading">{date}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {job.description && (
                <div>
                  <h4 className="heading-4 text-heading mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-black dark:text-primary" />
                    Deskripsi Pekerjaan
                  </h4>
                  <div 
                    className="body-small text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div>
                  <h4 className="heading-4 text-heading mb-3">Persyaratan</h4>
                  <div 
                    className="body-small text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>
              )}

              {/* Company Description */}
              {job.company?.description && (
                <div className="border-t border-border pt-4">
                  <h4 className="heading-4 text-heading mb-3">Tentang Perusahaan</h4>
                  <p className="body-small text-muted-foreground leading-relaxed">
                    {job.company.description}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Detail pekerjaan tidak ditemukan</p>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDetailDialog(false)}
            >
              Tutup
            </Button>
            <Button 
              onClick={() => {
                setShowDetailDialog(false);
                console.log("Melamar pekerjaan:", id);
              }}
              className="btn-cta-primary"
              disabled={isLoading}
            >
              Lanjutkan Melamar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
