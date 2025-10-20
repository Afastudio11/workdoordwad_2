import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import article1Img from "@assets/5_1760872341106.png";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  heroImage: string | null;
  category: string;
  readTime: string | null;
  publishedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header variant="dark" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header variant="dark" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-gray-500">Blog post tidak ditemukan</p>
            <Link href="/blog" className="text-blue-600 hover:underline mt-4 inline-block">
              Kembali ke Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const postImage = post.heroImage || article1Img;

  return (
    <div className="min-h-screen bg-white">
      <Header variant="dark" />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
          data-testid="link-back"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Blog
        </Link>

        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-testid="post-title">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {publishedDate}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            )}
          </div>
        </div>

        <div className="mb-10">
          <img
            src={postImage}
            alt={post.title}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>

        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
            data-testid="button-back-to-blog"
          >
            <ArrowLeft className="h-4 w-4" />
            Lihat Artikel Lainnya
          </Link>
        </div>
      </article>
    </div>
  );
}
