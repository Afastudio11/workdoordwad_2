import { Bookmark } from "lucide-react";
import { useState } from "react";
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
}

export default function JobCard({
  id,
  date,
  company,
  title,
  companyLogo,
  tags,
  salary,
  location,
  bgColor = "bg-blue-50",
}: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className={`${bgColor} rounded-2xl p-6 relative hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-gray-600">{date}</span>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <Bookmark
            className={`h-5 w-5 ${isBookmarked ? "fill-current text-black" : "text-gray-600"}`}
          />
        </button>
      </div>

      <div className="mb-4">
        <h4 className="text-sm text-gray-600 mb-1">{company}</h4>
        <h3 className="text-xl font-semibold text-black mb-3">{title}</h3>
      </div>

      {companyLogo && (
        <div className="absolute top-6 right-16">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
            <img src={companyLogo} alt={company} className="max-w-full max-h-full" />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-white/60 text-black hover:bg-white/80"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-black">{salary}</div>
          <div className="text-sm text-gray-700">{location}</div>
        </div>
        <Link href={`/jobs/${id}`}>
          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
            Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
