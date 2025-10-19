import { Link } from "wouter";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6" data-testid="link-back">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="page-title">
          Blog
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Temukan artikel, tips, dan panduan seputar karir dan rekrutmen.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600" data-testid="coming-soon">
            Konten blog akan segera hadir. Kami sedang menyiapkan artikel-artikel menarik untuk kamu.
          </p>
        </div>
      </div>
    </div>
  );
}
