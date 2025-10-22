import { useState } from "react";
import { ArrowRight } from "lucide-react";
import DynamicHeader from "@/components/DynamicHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: "Pesan Terkirim!",
        description: "Terima kasih telah menghubungi kami. Kami akan segera merespons.",
      });
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <DynamicHeader />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div>
              <h1 className="heading-1 text-heading mb-6" data-testid="page-title">
                Hubungi Kami
              </h1>
              
              <p className="body-large text-muted-foreground">
                Kami siap membantu! Apakah Anda memiliki pertanyaan tentang layanan kami, 
                membutuhkan bantuan dengan akun Anda, atau ingin memberikan feedback, 
                tim kami siap membantu Anda.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="caption mb-2">Email:</h3>
                <a 
                  href="mailto:support@pintukerja.com" 
                  className="heading-3 text-link"
                  data-testid="contact-email"
                >
                  support@pintukerja.com
                </a>
              </div>

              <div>
                <h3 className="caption mb-2">Telepon:</h3>
                <p className="heading-3 text-heading" data-testid="contact-phone">
                  +62 21 1234 5678
                </p>
                <p className="body-small text-muted-foreground mt-1">
                  Tersedia Senin - Jumat, 09:00 - 18:00 WIB
                </p>
              </div>
            </div>

            <Button 
              variant="default"
              size="lg"
              className="btn-cta-large"
              data-testid="button-live-chat"
            >
              Live Chat
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-gray-50 rounded-3xl p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    Nama Depan
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Masukkan nama depan Anda..."
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="bg-white border-gray-200 rounded-lg h-12 px-4"
                    required
                    data-testid="input-first-name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Nama Belakang
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Masukkan nama belakang Anda..."
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="bg-white border-gray-200 rounded-lg h-12 px-4"
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan alamat email Anda..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-gray-200 rounded-lg h-12 px-4"
                  required
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Bagaimana kami bisa membantu Anda?
                </label>
                <Textarea
                  id="message"
                  placeholder="Masukkan pesan Anda..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white border-gray-200 rounded-lg min-h-[160px] px-4 py-3 resize-none"
                  required
                  data-testid="input-message"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="btn-cta-large"
                  data-testid="button-send-message"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
