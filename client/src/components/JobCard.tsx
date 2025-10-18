import { MapPin, Building2, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  id: string;
  date: string;
  company: string;
  title: string;
  companyLogo?: string;
  tags: string[];
  salary: string;
  location: string;
  bgColor?: string;
  icon?: string;
  jobType?: string;
}

const jobIcons = ['🍎', '🎯', '💼', '🎨', '💻', '🚀'];

export default function JobCard({
  id,
  date,
  company,
  title,
  tags,
  salary,
  location,
  icon,
  jobType = "Penuh Waktu",
}: JobCardProps) {
  const randomIcon = icon || jobIcons[Math.floor(Math.random() * jobIcons.length)];
  const category = tags[0] || "Umum";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all" data-testid={`card-job-${id}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl">{randomIcon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black mb-2" data-testid={`text-job-title-${id}`}>{title}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
            <MapPin className="h-4 w-4" />
            <span data-testid={`text-location-${id}`}>{location}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-700 mb-3">
        <Building2 className="h-4 w-4" />
        <span data-testid={`text-company-${id}`}>{company}</span>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
          {jobType}
        </Badge>
      </div>

      <div className="text-sm text-gray-700 mb-4">
        <span>{category}</span>
        <span className="mx-2">•</span>
        <span className="font-semibold text-black" data-testid={`text-salary-${id}`}>{salary}</span>
      </div>

      <Link href={`/jobs/${id}`}>
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800 rounded-full font-medium"
          data-testid={`button-apply-${id}`}
        >
          Lamar Sekarang
        </Button>
      </Link>
    </div>
  );
}
