import { useAuth } from "@/hooks/use-auth";
import LandingPage from "./LandingPage";
import NewJobDashboardPage from "./NewJobDashboardPage";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <NewJobDashboardPage />;
  }

  return <LandingPage />;
}
