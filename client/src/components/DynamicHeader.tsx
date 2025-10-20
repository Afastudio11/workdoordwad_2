import { useAuth } from "@/hooks/use-auth";
import DashboardHeader from "./DashboardHeader";
import EmployerDashboardHeader from "./EmployerDashboardHeader";
import Header from "./Header";

export default function DynamicHeader() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Header variant="dark" />;
  }

  if (user.role === "pemberi_kerja") {
    return <EmployerDashboardHeader />;
  }

  return <DashboardHeader />;
}
