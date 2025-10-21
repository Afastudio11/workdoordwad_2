import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  workingSchedule: string[];
  employmentType: string[];
}

const jobTypeMapping: Record<string, string> = {
  "Waktu Penuh": "full-time",
  "Paruh Waktu": "part-time",
  "Kontrak": "contract",
  "Freelance": "freelance",
};

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [showWorkingSchedule, setShowWorkingSchedule] = useState(true);
  const [showEmploymentType, setShowEmploymentType] = useState(true);
  
  const [filters, setFilters] = useState<FilterState>({
    workingSchedule: [],
    employmentType: [],
  });

  const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    if (checked) {
      newFilters[category] = [...newFilters[category], value];
    } else {
      newFilters[category] = newFilters[category].filter((item) => item !== value);
    }
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Filter</h3>

        {/* Working schedule */}
        <div className="mb-6">
          <button
            onClick={() => setShowWorkingSchedule(!showWorkingSchedule)}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-sm font-medium text-black">Jadwal Kerja</span>
            {showWorkingSchedule ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </button>
          {showWorkingSchedule && (
            <div className="space-y-3">
              {Object.keys(jobTypeMapping).map((label) => (
                <div key={label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`schedule-${label}`}
                    checked={filters.workingSchedule.includes(jobTypeMapping[label])}
                    onCheckedChange={(checked) =>
                      handleFilterChange("workingSchedule", jobTypeMapping[label], checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`schedule-${label}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
