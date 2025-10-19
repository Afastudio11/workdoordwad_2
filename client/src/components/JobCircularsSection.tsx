import { MapPin, Clock, Search, Briefcase } from "lucide-react";

const jobCirculars = [
  {
    company: "Apple Inc.",
    position: "Sr. User Interface",
    location: "London, UK",
    type: "Full Time",
    category: "Web Development",
    salary: "$45k-$55k",
    postedTime: "05 Hours Ago",
    logo: "🍎"
  },
  {
    company: "Fiverr",
    position: "PHP Developer",
    location: "London, UK",
    type: "Full Time",
    category: "Graphics",
    salary: "$45k-$55k",
    postedTime: "05 Hours Ago",
    logo: "🎯"
  },
  {
    company: "Behance",
    position: "Sr. Software Engineer",
    location: "London, UK",
    type: "Full Time",
    category: "Themeforest",
    salary: "$45k-$55k",
    postedTime: "05 Hours Ago",
    logo: "🔷"
  },
  {
    company: "Apple Inc.",
    position: "UX Researcher",
    location: "London, UK",
    type: "Full Time",
    category: "Web Development",
    salary: "$45k-$55k",
    postedTime: "05 Hours Ago",
    logo: "🍎"
  },
  {
    company: "Apple Inc.",
    position: "Project Manager",
    location: "London, UK",
    type: "Full Time",
    category: "Web Development",
    salary: "$45k-$55k",
    postedTime: "05 Hours Ago",
    logo: "🍎"
  },
  {
    company: "Behance",
    position: "Products Designer",
    location: "London, UK",
    type: "Full Time",
    category: "Themeforest",
    salary: "$45k-$55k",
    postedTime: "05 Hours Ago",
    logo: "🔷"
  }
];

const categories = ["Designer", "Web Developer", "Software Engineer", "Doctors", "Marketing"];

export default function JobCircularsSection() {
  return (
    <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-6 md:mb-8">
            Featured Job Circulars
          </h2>
          
          {/* Search Bar - Single Pill Shape */}
          <div className="mb-6">
            <div className="flex items-center gap-0 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 p-1.5 max-w-2xl shadow-sm">
              <input 
                type="text" 
                placeholder="etc: Search Your Needs" 
                className="flex-1 pl-6 pr-4 py-2.5 bg-transparent text-black dark:text-white text-sm focus:outline-none"
                data-testid="input-search"
              />
              <select 
                className="px-4 py-2.5 bg-transparent text-black dark:text-white text-sm border-l border-gray-200 dark:border-gray-700 focus:outline-none cursor-pointer"
                data-testid="select-category"
              >
                <option>Web Devleopment</option>
                <option>Design</option>
                <option>Marketing</option>
              </select>
              <button 
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center flex-shrink-0"
                data-testid="button-search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Popular Categories:</span>
            {categories.map((cat, index) => (
              <button 
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 1 
                    ? 'bg-black dark:bg-white text-white dark:text-black' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                data-testid={`button-category-${index}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobCirculars.map((job, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
              data-testid={`job-card-${index}`}
            >
              {/* Position and Location */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {job.position}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{job.location}</span>
                </div>
              </div>
              
              {/* Company */}
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">{job.logo}</div>
                <span className="text-sm font-medium text-black dark:text-white">{job.company}</span>
              </div>

              {/* Time and Type */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{job.postedTime}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{job.type}</span>
                </div>
              </div>

              {/* Category and Salary */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{job.category}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>💰</span>
                  <span>{job.salary}</span>
                </div>
              </div>

              {/* Apply Button */}
              <button 
                className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                data-testid={`button-apply-${index}`}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button 
            className="w-full md:w-auto px-16 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors"
            data-testid="button-load-more"
          >
            Load More
          </button>
        </div>
      </div>
    </section>
  );
}
