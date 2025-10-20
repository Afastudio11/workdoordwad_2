import { useState } from "react";
import { ArrowRight } from "lucide-react";
import EmployerDashboardHeader from "@/components/EmployerDashboardHeader";
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
      <EmployerDashboardHeader />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6" data-testid="page-title">
                Get in touch with us
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                We're here to help! Whether you have a question about our services, 
                need assistance with your account, or want to provide feedback, 
                our team is ready to assist you.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email:</h3>
                <a 
                  href="mailto:hello@finpro.com" 
                  className="text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
                  data-testid="contact-email"
                >
                  hello@finpro.com
                </a>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Phone:</h3>
                <p className="text-2xl font-semibold text-gray-900" data-testid="contact-phone">
                  +1 234 567 78
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Available Monday to Friday, 9 AM - 6 PM GMT
                </p>
              </div>
            </div>

            <Button 
              variant="default"
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 text-base font-medium"
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
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name..."
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="bg-white border-gray-200 rounded-lg h-12 px-4"
                    required
                    data-testid="input-first-name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name..."
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
                  placeholder="Enter your email address..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white border-gray-200 rounded-lg h-12 px-4"
                  required
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  How can we help you?
                </label>
                <Textarea
                  id="message"
                  placeholder="Enter your message..."
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
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-10 py-6 text-base font-medium"
                  data-testid="button-send-message"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
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
