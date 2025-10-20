import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import JobCircularsSection from "@/components/JobCircularsSection";
import AIInnovationSection from "@/components/AIInnovationSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "pemberi_kerja") {
        setLocation("/employer/dashboard");
      } else if (user.role === "pekerja") {
        setLocation("/user/dashboard");
      }
    }
  }, [user, setLocation]);

  // Don't render landing page if user is authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <JobCircularsSection />
      <AIInnovationSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
