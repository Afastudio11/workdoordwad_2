import { useState } from "react";

const articles = [
  {
    id: 1,
    title: "Tips Menulis CV yang Menarik Perhatian Recruiter",
    date: "29 Juni 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Cara Memaksimalkan Peluang Diterima Kerja",
    date: "29 Juni 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Strategi Interview yang Efektif untuk Fresh Graduate",
    date: "29 Juni 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"
  }
];

export default function AIInnovationSection() {
  const [activeTab, setActiveTab] = useState("articles");

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 md:mb-12">
          <div className="mb-6 md:mb-8 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-4 md:mb-6 leading-tight">
              Sumber Daya untuk Membantu<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Anda Merekrut dengan Tepat
            </h2>
            
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setActiveTab("guides")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors ${
                  activeTab === "guides"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                data-testid="tab-guides"
              >
                Panduan
              </button>
              <button
                onClick={() => setActiveTab("articles")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors ${
                  activeTab === "articles"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                data-testid="tab-articles"
              >
                Artikel
              </button>
            </div>
          </div>

          <div className="w-full lg:max-w-md">
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              Bukan ahli? Jangan khawatir! Kami punya panduan dan artikel lengkap tentang praktik terbaik dan tips dalam merekrut karyawan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group cursor-pointer"
              data-testid={`article-card-${article.id}`}
            >
              <div className="mb-4 overflow-hidden rounded-2xl aspect-[4/3]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
