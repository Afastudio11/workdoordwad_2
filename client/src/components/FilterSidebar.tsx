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
        <h3 className="text-lg font-semibold text-black mb-6">Filters</h3>

        {/* Working schedule */}
        <div className="mb-6">
          <button
            onClick={() => setShowWorkingSchedule(!showWorkingSchedule)}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-sm font-medium text-black">Working schedule</span>
            {showWorkingSchedule ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </button>
          {showWorkingSchedule && (
            <div className="space-y-3">
              {["Full time", "Part time", "Internship", "Project work", "Volunteering"].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`schedule-${item}`}
                    checked={filters.workingSchedule.includes(item)}
                    onCheckedChange={(checked) =>
                      handleFilterChange("workingSchedule", item, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`schedule-${item}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employment type */}
        <div>
          <button
            onClick={() => setShowEmploymentType(!showEmploymentType)}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-sm font-medium text-black">Employment type</span>
            {showEmploymentType ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </button>
          {showEmploymentType && (
            <div className="space-y-3">
              {[
                "Full day",
                "Flexible schedule",
                "Shift work",
                "Distant work",
                "Shift method",
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${item}`}
                    checked={filters.employmentType.includes(item)}
                    onCheckedChange={(checked) =>
                      handleFilterChange("employmentType", item, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`type-${item}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {item}
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
