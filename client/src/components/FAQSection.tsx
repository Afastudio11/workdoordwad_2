import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Bagaimana cara mendaftar di platform ini?",
    answer: "Anda dapat mendaftar dengan mudah menggunakan email atau akun media sosial. Proses pendaftaran hanya memerlukan beberapa menit."
  },
  {
    question: "Apakah ada biaya untuk posting lowongan kerja?",
    answer: "Tidak, platform kami gratis selamanya untuk UMKM Indonesia. Anda dapat memposting lowongan kerja tanpa biaya apapun."
  },
  {
    question: "Bagaimana cara melamar pekerjaan?",
    answer: "Gunakan fitur Quick Apply untuk melamar pekerjaan dalam hitungan detik. Cukup simpan CV Anda sekali, dan lamar ke berbagai posisi dengan satu klik."
  },
  {
    question: "Apakah platform ini mobile-friendly?",
    answer: "Ya, platform kami didesain mobile-first sehingga Anda dapat mengakses lowongan dari mana saja, kapan saja melalui smartphone Anda."
  },
  {
    question: "Bagaimana AI membantu dalam proses rekrutmen?",
    answer: "AI kami mengumpulkan lowongan dari berbagai sumber termasuk Instagram, dan kemudian diverifikasi oleh tim editor kami untuk memastikan kualitas dan keakuratan."
  }
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Frequently Asked Question
          </h2>
          <p className="text-gray-600">
            Pertanyaan yang sering diajukan tentang platform kami
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-black/10">
              <AccordionTrigger className="text-left text-lg font-medium text-black hover:text-gray-900">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
