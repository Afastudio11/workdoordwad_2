import { useState } from "react";
import { Search, MessageCircle, ThumbsUp, Share2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";

interface Post {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

export default function CommunityPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Tips Karir", "Pengalaman Kerja", "Interview", "Gaji", "Work-Life Balance"];

  const posts: Post[] = [
    {
      id: "1",
      author: "Ahmad Setiawan",
      avatar: "AS",
      title: "Tips Sukses Interview Kerja untuk Fresh Graduate",
      content: "Halo semua! Saya baru saja lulus dan berhasil dapat kerja setelah 5x interview. Mau share tips yang menurut saya sangat membantu...",
      category: "Tips Karir",
      likes: 45,
      comments: 12,
      timestamp: "2 hours ago",
      isLiked: false,
    },
    {
      id: "2",
      author: "Sarah Putri",
      avatar: "SP",
      title: "Pengalaman Kerja di Startup vs Korporat",
      content: "Setelah 3 tahun di startup dan sekarang pindah ke korporat, saya ingin berbagi pengalaman tentang perbedaan budaya kerja...",
      category: "Pengalaman Kerja",
      likes: 78,
      comments: 23,
      timestamp: "5 hours ago",
      isLiked: true,
    },
    {
      id: "3",
      author: "Budi Santoso",
      avatar: "BS",
      title: "Cara Negosiasi Gaji yang Efektif",
      content: "Berdasarkan pengalaman saya, ada beberapa strategi negosiasi gaji yang bisa meningkatkan peluang kita mendapatkan gaji yang lebih baik...",
      category: "Gaji",
      likes: 124,
      comments: 45,
      timestamp: "1 day ago",
      isLiked: false,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Komunitas</h1>
          <Button className="flex items-center gap-2" data-testid="button-new-post">
            <MessageCircle className="h-4 w-4" />
            Posting Baru
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari diskusi..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              data-testid="input-search"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:bg-secondary"
                }`}
                data-testid={`category-${category.toLowerCase().replace(' ', '-')}`}
              >
                {category === "all" ? "Semua Topik" : category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
                data-testid={`post-${post.id}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-700">{post.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">{post.author}</h3>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                    </div>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-secondary text-foreground rounded">
                      {post.category}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-foreground mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.content}</p>

                <div className="flex items-center gap-6">
                  <button
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      post.isLiked ? "text-gray-900 font-semibold" : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`button-like-${post.id}`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`button-comment-${post.id}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`button-share-${post.id}`}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Trending Topics</h3>
              </div>
              <div className="space-y-3">
                <div className="pb-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground mb-1">#RemoteWork</p>
                  <p className="text-xs text-muted-foreground">234 discussions</p>
                </div>
                <div className="pb-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground mb-1">#CareerSwitch</p>
                  <p className="text-xs text-muted-foreground">189 discussions</p>
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium text-foreground mb-1">#SalaryNegotiation</p>
                  <p className="text-xs text-muted-foreground">156 discussions</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be respectful and professional</li>
                <li>• No spam or self-promotion</li>
                <li>• Share helpful and accurate information</li>
                <li>• Protect privacy and confidentiality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
