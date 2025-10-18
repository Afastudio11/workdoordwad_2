import { useState } from "react";
import { Search, ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import DashboardHeader from "@/components/DashboardHeader";
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
      answer: "Anda dapat mengupdate CV dengan masuk ke profil Anda, klik menu 'Ubah Profil', lalu unggah CV terbaru Anda di bagian 'Unggah CV'.",
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
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Pertanyaan yang Sering Diajukan</h1>
          <p className="text-lg text-muted-foreground">Temukan jawaban untuk pertanyaan yang sering diajukan</p>
        </div>

        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:bg-secondary"
                }`}
                data-testid={`category-${category.toLowerCase()}`}
              >
                {category === "all" ? "Semua" : category}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-border last:border-0" data-testid={`faq-${faq.id}`}>
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary text-left">
                  <div className="flex items-start gap-3 pr-4">
                    <span className="text-sm font-medium text-muted-foreground flex-shrink-0">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-base font-medium text-foreground">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="pl-9 text-muted-foreground">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tidak ada pertanyaan yang ditemukan</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Tidak menemukan jawaban yang Anda cari?</p>
          <Link href="/contact">
            <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity" data-testid="button-contact">
              Hubungi Kami
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
