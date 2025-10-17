import { useState } from "react";
import { Link } from "wouter";
import { Search, ChevronDown, HelpCircle } from "lucide-react";
import logoImgDark from "@assets/black@4x_1760695283292.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Pekerja", "Pemberi Kerja", "Akun", "Pembayaran"];

  const faqs: FAQ[] = [
    {
      id: "1",
      category: "Pekerja",
      question: "Bagaimana cara melamar pekerjaan?",
      answer: "Untuk melamar pekerjaan, cari lowongan yang sesuai di halaman Find Job, klik pada lowongan yang Anda minati, lalu klik tombol 'Apply'. Anda akan diminta untuk melengkapi data dan mengunggah CV.",
    },
    {
      id: "2",
      category: "Pekerja",
      question: "Apakah gratis untuk mencari pekerjaan?",
      answer: "Ya, Pintu Kerja 100% gratis untuk pencari kerja. Anda dapat mencari lowongan, melamar pekerjaan, dan berkomunikasi dengan pemberi kerja tanpa biaya apapun.",
    },
    {
      id: "3",
      category: "Pekerja",
      question: "Bagaimana cara mengupdate CV saya?",
      answer: "Anda dapat mengupdate CV dengan masuk ke profil Anda, klik menu 'Edit Profile', lalu upload CV terbaru Anda di bagian 'Upload CV'.",
    },
    {
      id: "4",
      category: "Pemberi Kerja",
      question: "Berapa biaya untuk posting lowongan?",
      answer: "Untuk UMKM, posting lowongan 100% GRATIS. Untuk perusahaan besar, kami menyediakan paket premium dengan fitur tambahan seperti promosi lowongan dan akses ke database kandidat.",
    },
    {
      id: "5",
      category: "Pemberi Kerja",
      question: "Bagaimana cara memverifikasi perusahaan?",
      answer: "Untuk verifikasi perusahaan, hubungi tim kami dengan melampirkan dokumen legalitas perusahaan seperti SIUP, TDP, atau NIB. Proses verifikasi biasanya memakan waktu 1-3 hari kerja.",
    },
    {
      id: "6",
      category: "Akun",
      question: "Bagaimana cara reset password?",
      answer: "Klik 'Lupa Password' di halaman login, masukkan email Anda, dan kami akan mengirimkan link untuk reset password ke email Anda.",
    },
    {
      id: "7",
      category: "Akun",
      question: "Bisakah saya punya dua akun?",
      answer: "Satu email hanya bisa digunakan untuk satu akun. Namun Anda bisa memilih peran yang berbeda (pekerja atau pemberi kerja) dalam satu akun.",
    },
    {
      id: "8",
      category: "Pembayaran",
      question: "Metode pembayaran apa saja yang tersedia?",
      answer: "Kami menerima pembayaran melalui transfer bank, e-wallet (OVO, GoPay, Dana), dan kartu kredit/debit untuk paket premium.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <img src={logoImgDark} alt="Pintu Kerja" className="h-8" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-findjob">
                Find job
              </Link>
              <Link href="/messages" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-messages">
                Messages
              </Link>
              <Link href="/hiring" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-hiring">
                Hiring
              </Link>
              <Link href="/community" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-community">
                Community
              </Link>
              <Link href="/faq" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors" data-testid="link-faq">
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <HelpCircle className="h-8 w-8 text-gray-900" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Temukan jawaban untuk pertanyaan yang sering diajukan</p>
        </div>

        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              data-testid="input-search-faq"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                data-testid={`category-${category.toLowerCase()}`}
              >
                {category === "all" ? "Semua" : category}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-200 last:border-0" data-testid={`faq-${faq.id}`}>
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left">
                  <div className="flex items-start gap-3 pr-4">
                    <span className="text-sm font-medium text-gray-500 flex-shrink-0">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-base font-medium text-gray-900">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="pl-9 text-gray-600">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada pertanyaan yang ditemukan</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Tidak menemukan jawaban yang Anda cari?</p>
          <Link href="/contact">
            <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors" data-testid="button-contact">
              Hubungi Kami
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
