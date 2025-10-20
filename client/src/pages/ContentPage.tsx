import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

interface ContentPageData {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription: string | null;
}

export default function ContentPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: page, isLoading, isError } = useQuery<ContentPageData>({
    queryKey: [`/api/content/${slug}`],
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

  if (isError || !page) {
    return (
      <div className="min-h-screen bg-white">
        <Header variant="dark" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-gray-500">Halaman tidak ditemukan</p>
            <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
              Kembali ke Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header variant="dark" />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
          data-testid="link-back"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-testid="page-title">
            {page.title}
          </h1>
          {page.metaDescription && (
            <p className="text-lg text-gray-600">{page.metaDescription}</p>
          )}
        </div>

        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:my-4 prose-li:my-2"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}
