import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import article1Img from "@assets/5_1760872341106.png";
import article2Img from "@assets/3_1760872341107.png";
import article3Img from "@assets/4_1760872341107.png";

const defaultImages: Record<string, string> = {
  "Newsletter": article1Img,
  "Tips": article2Img,
  "Insight": article3Img,
  "Success Stories": article1Img,
};

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

export default function AIInnovationSection() {
  const [activeTab, setActiveTab] = useState("articles");
  
  const { data: blogData, isLoading } = useQuery<{ posts: BlogPost[]; total: number }>({
    queryKey: ["/api/blog", { limit: 3 }],
  });

  const articles = blogData?.posts || [];

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 md:mb-12">
          <div className="mb-6 md:mb-8 lg:mb-0">
            <h2 className="heading-1 text-heading mb-4 md:mb-6">
              Sumber Daya untuk Membantu<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>kamu Merekrut dengan Tepat
            </h2>
            
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setActiveTab("guides")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors ${
                  activeTab === "guides"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                data-testid="tab-guides"
              >
                Panduan
              </button>
              <button
                onClick={() => setActiveTab("articles")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors ${
                  activeTab === "articles"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                data-testid="tab-articles"
              >
                Artikel
              </button>
            </div>
          </div>

          <div className="w-full lg:max-w-md">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Bukan ahli? Jangan khawatir! Kami punya panduan dan artikel lengkap tentang praktik terbaik dan tips dalam merekrut karyawan.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-4 bg-gray-200 rounded-2xl aspect-[4/3]"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article) => {
              const articleImage = article.heroImage || defaultImages[article.category] || article1Img;
              const publishedDate = new Date(article.publishedAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric"
              });
              
              return (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <div
                    className="group cursor-pointer"
                    data-testid={`article-card-${article.id}`}
                  >
                    <div className="mb-4 overflow-hidden rounded-2xl aspect-[4/3]">
                      <img
                        src={articleImage}
                        alt={article.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-3 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                      <span>{publishedDate}</span>
                      {article.readTime && (
                        <>
                          <span>•</span>
                          <span>{article.readTime} baca</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Belum ada artikel tersedia.</p>
          </div>
        )}
      </div>
    </section>
  );
}
