import { Link } from "wouter";
import Header from "@/components/Header";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="dark" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="page-title">
          Hubungi Kami
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Ada pertanyaan atau butuh bantuan? Kami siap membantu kamu.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Email</h3>
            </div>
            <p className="text-gray-600" data-testid="contact-email">
              support@pintukerja.com
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Telepon</h3>
            </div>
            <p className="text-gray-600" data-testid="contact-phone">
              +62 21 1234 5678
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Alamat</h3>
            </div>
            <p className="text-gray-600" data-testid="contact-address">
              Jl. Sudirman No. 123, Jakarta Selatan, Indonesia
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kirim Pesan</h2>
          <p className="text-gray-600 mb-6">
            Form kontak akan segera tersedia. Untuk sementara, silakan hubungi kami melalui email atau telepon di atas.
          </p>
        </div>
      </div>
    </div>
  );
}
