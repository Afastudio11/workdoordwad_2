import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import LandingPage from "./LandingPage";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      if (user.role === "pekerja") {
        setLocation("/user/dashboard");
      } else if (user.role === "pemberi_kerja") {
        setLocation("/employer/dashboard");
      } else if (user.role === "admin") {
        setLocation("/admin/dashboard");
      } else {
        // Fallback for unexpected roles: redirect to login
        console.warn("Unexpected user role:", user.role);
        setLocation("/login");
      }
    }
  }, [isAuthenticated, user, setLocation]);

  return <LandingPage />;
}
