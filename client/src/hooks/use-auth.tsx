import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setDevUser: (role: "pekerja" | "pemberi_kerja" | "admin") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_MODE = import.meta.env.VITE_DEV_BYPASS_AUTH === "true" || import.meta.env.MODE === "development";

const DEV_USERS: Record<"pekerja" | "pemberi_kerja" | "admin", User> = {
  pekerja: {
    id: "dev-pekerja-1",
    username: "dev_pekerja",
    password: "dev",
    email: "pekerja@dev.local",
    fullName: "Development Pekerja",
    phone: "08123456789",
    role: "pekerja",
    bio: null,
    dateOfBirth: null,
    gender: null,
    address: null,
    city: null,
    province: null,
    photoUrl: null,
    cvUrl: null,
    cvFileName: null,
    education: null,
    experience: null,
    skills: null,
    preferredIndustries: null,
    preferredLocations: null,
    preferredJobTypes: null,
    expectedSalaryMin: null,
    isVerified: false,
    createdAt: new Date(),
  },
  pemberi_kerja: {
    id: "dev-pemberi-1",
    username: "dev_pemberi",
    password: "dev",
    email: "pemberi@dev.local",
    fullName: "Development Pemberi Kerja",
    phone: "08123456789",
    role: "pemberi_kerja",
    bio: null,
    dateOfBirth: null,
    gender: null,
    address: null,
    city: null,
    province: null,
    photoUrl: null,
    cvUrl: null,
    cvFileName: null,
    education: null,
    experience: null,
    skills: null,
    preferredIndustries: null,
    preferredLocations: null,
    preferredJobTypes: null,
    expectedSalaryMin: null,
    isVerified: true,
    createdAt: new Date(),
  },
  admin: {
    id: "dev-admin-1",
    username: "dev_admin",
    password: "dev",
    email: "admin@dev.local",
    fullName: "Development Admin",
    phone: "08123456789",
    role: "admin",
    bio: null,
    dateOfBirth: null,
    gender: null,
    address: null,
    city: null,
    province: null,
    photoUrl: null,
    cvUrl: null,
    cvFileName: null,
    education: null,
    experience: null,
    skills: null,
    preferredIndustries: null,
    preferredLocations: null,
    preferredJobTypes: null,
    expectedSalaryMin: null,
    isVerified: false,
    createdAt: new Date(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [devUser, setDevUserState] = useState<User | null>(() => {
    if (DEV_MODE) {
      const stored = localStorage.getItem("dev_user_role");
      if (stored && (stored === "pekerja" || stored === "pemberi_kerja" || stored === "admin")) {
        return DEV_USERS[stored];
      }
    }
    return null;
  });

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !DEV_MODE || !devUser,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("/api/auth/logout", "POST"),
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      if (DEV_MODE) {
        setDevUserState(null);
        localStorage.removeItem("dev_user_role");
      }
      setLocation("/login");
    },
  });

  const logout = () => {
    if (DEV_MODE && devUser) {
      setDevUserState(null);
      localStorage.removeItem("dev_user_role");
      setLocation("/");
    } else {
      logoutMutation.mutate();
    }
  };

  const setDevUser = (role: "pekerja" | "pemberi_kerja" | "admin") => {
    if (DEV_MODE) {
      const mockUser = DEV_USERS[role];
      setDevUserState(mockUser);
      localStorage.setItem("dev_user_role", role);
      queryClient.setQueryData(["/api/auth/me"], mockUser);
    }
  };

  const currentUser = DEV_MODE && devUser ? devUser : user;

  return (
    <AuthContext.Provider
      value={{
        user: currentUser || null,
        isLoading: DEV_MODE && devUser ? false : isLoading,
        isAuthenticated: !!(currentUser),
        logout,
        setDevUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
