import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import DynamicHeader from "@/components/DynamicHeader";
import { ChevronDown } from "lucide-react";
import article1Img from "@assets/5_1760872341106.png";
import article2Img from "@assets/3_1760872341107.png";
import article3Img from "@assets/4_1760872341107.png";

const categories = ["All", "Newsletter", "Tips", "Insight", "Success Stories"];

const defaultImages: Record<string, string> = {
  "Newsletter": article1Img,
  "Tips": article2Img,
  "Insight": article3Img,
  "Success Stories": article1Img,
};

const decorativeColors = ["bg-orange-500", "bg-teal-500", "bg-purple-500", "bg-red-500", "bg-blue-500", "bg-green-500"];

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string | null;
  category: string;
  readTime: string | null;
  publishedAt: string;
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: blogData, isLoading } = useQuery<{ posts: BlogPost[]; total: number }>({
    queryKey: ["/api/blog", activeCategory !== "All" ? { category: activeCategory } : {}],
  });

  const filteredPosts = blogData?.posts || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicHeader />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6 leading-tight" data-testid="page-title">
            Our Blog & Insight
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            We delve into the world of job market, exploring the latest trends, regulations, and best practices that drive responsible career operations.
          </p>
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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading blog posts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPosts.map((post, index) => {
              const postImage = post.heroImage || defaultImages[post.category] || article1Img;
              const decorativeColor = decorativeColors[index % decorativeColors.length];
              const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              });
              
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                >
                  <div
                    className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                    data-testid={`blog-card-${post.id}`}
                  >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={postImage}
                      alt={post.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                    />
                    {/* Decorative Shapes */}
                    <div className={`absolute top-6 left-6 w-16 h-16 ${decorativeColor} rounded-full opacity-80`}></div>
                    <div className={`absolute bottom-6 right-6 w-20 h-20 ${decorativeColor} rounded-full opacity-60`}></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span>{publishedDate}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-black mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
