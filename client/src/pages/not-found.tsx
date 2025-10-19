import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Halaman Tidak Ditemukan</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 mb-4">
            Halaman yang kamu cari tidak ditemukan.
          </p>
          
          <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
            Kembali ke Beranda
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
