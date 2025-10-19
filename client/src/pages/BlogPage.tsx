import { useState } from "react";
import Header from "@/components/Header";
import { ChevronDown } from "lucide-react";
import article1Img from "@assets/5_1760872341106.png";
import article2Img from "@assets/3_1760872341107.png";
import article3Img from "@assets/4_1760872341107.png";

const categories = ["All", "Newsletter", "Tips", "Insight", "Success Stories"];

const blogPosts = [
  {
    id: 1,
    category: "Newsletter",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "The Future of Job Market: Emerging Trends to Watch",
    description: "Technological advancements, data analytics, and industry disruptions: navigating the evolving landscape ...",
    image: article1Img,
    decorativeColor: "bg-orange-500"
  },
  {
    id: 2,
    category: "Tips",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Mental Health Matters: Strategies for Job Seeker Well-Being",
    description: "Addressing stress, burnout, and mental Health in the workplace. A holistic approach to support employee ...",
    image: article2Img,
    decorativeColor: "bg-teal-500"
  },
  {
    id: 3,
    category: "Insight",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Creating a Career Path: Leadership Insights",
    description: "Empowering your team to prioritize success every day, leadership strategies, training, and cultivating ...",
    image: article3Img,
    decorativeColor: "bg-purple-500"
  },
  {
    id: 4,
    category: "Newsletter",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Tips Menulis CV yang Menarik Perhatian Recruiter",
    description: "Panduan lengkap membuat CV yang profesional dan menarik perhatian recruiter untuk meningkatkan peluang diterima ...",
    image: article1Img,
    decorativeColor: "bg-red-500"
  },
  {
    id: 5,
    category: "Tips",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Cara Memaksimalkan Peluang Diterima Kerja",
    description: "Strategi efektif untuk meningkatkan peluang kamu diterima di perusahaan impian dengan persiapan yang matang ...",
    image: article2Img,
    decorativeColor: "bg-blue-500"
  },
  {
    id: 6,
    category: "Insight",
    date: "October 18, 2023",
    readTime: "7 min read",
    title: "Strategi Interview yang Efektif untuk Fresh Graduate",
    description: "Tips dan trik menghadapi interview kerja bagi fresh graduate untuk tampil percaya diri dan profesional ...",
    image: article3Img,
    decorativeColor: "bg-green-500"
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="dark" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6 leading-tight" data-testid="page-title">
              Our Blog & Insight
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We delve into the world of job market, exploring the latest trends, regulations, and best practices that drive responsible career operations.
            </p>
          </div>
          
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <svg viewBox="0 0 400 300" className="w-full h-auto">
                {/* Decorative Background */}
                <ellipse cx="200" cy="150" rx="180" ry="130" fill="#E5E7EB" />
                
                {/* Computer Screens */}
                <rect x="120" y="60" width="60" height="45" rx="3" fill="white" stroke="#9CA3AF" strokeWidth="2" />
                <rect x="200" y="50" width="70" height="50" rx="3" fill="white" stroke="#9CA3AF" strokeWidth="2" />
                <rect x="290" y="70" width="55" height="40" rx="3" fill="white" stroke="#9CA3AF" strokeWidth="2" />
                
                {/* Icons on screens */}
                <circle cx="235" cy="70" r="8" fill="#D4FF00" />
                <rect x="315" y="85" width="15" height="15" fill="#FF6B6B" />
                <circle cx="150" cy="80" r="6" fill="#4ECDC4" />
                
                {/* Bear Character */}
                <circle cx="200" cy="200" r="45" fill="#8B6F47" />
                <circle cx="185" cy="190" r="8" fill="#F5E6D3" />
                <circle cx="215" cy="190" r="8" fill="#F5E6D3" />
                <circle cx="185" cy="188" r="3" fill="black" />
                <circle cx="215" cy="188" r="3" fill="black" />
                <ellipse cx="200" cy="205" rx="6" ry="4" fill="#F5E6D3" />
                
                {/* Hard Hat */}
                <ellipse cx="200" cy="165" rx="30" ry="8" fill="#FFD700" />
                <path d="M 170 165 Q 200 140 230 165" fill="#FFD700" />
                
                {/* Vest */}
                <rect x="175" y="220" width="50" height="40" rx="5" fill="#4A90E2" />
                <rect x="177" y="225" width="10" height="30" fill="#FF6B6B" />
                <rect x="213" y="225" width="10" height="30" fill="#FF6B6B" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-black"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" data-testid="button-categories">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Categories
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
              data-testid={`blog-card-${post.id}`}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Decorative Shapes */}
                <div className={`absolute top-6 left-6 w-16 h-16 ${post.decorativeColor} rounded-full opacity-80`}></div>
                <div className={`absolute bottom-6 right-6 w-20 h-20 ${post.decorativeColor} rounded-full opacity-60`}></div>
              </div>
              
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-black mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
