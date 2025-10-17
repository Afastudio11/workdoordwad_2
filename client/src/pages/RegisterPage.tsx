import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Eye, EyeOff, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaFacebook, FaGoogle } from "react-icons/fa";

const registerSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui Terms of Services",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"candidate" | "employers">("employers");

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: RegisterForm) => {
    console.log({ ...data, userType });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="register-title">
            Buat akun.
          </h1>
          <p className="text-gray-900">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-gray-900 hover:underline font-bold" data-testid="link-login">
              Masuk
            </Link>
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-1 mb-6">
          <p className="text-xs text-gray-500 text-center mb-2">BUAT AKUN SEBAGAI</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUserType("candidate")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-full transition-colors ${
                userType === "candidate"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-[#ffffff]/50"
              }`}
            >
              <User className="h-4 w-4" />
              <span className="font-medium">Kandidat</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType("employers")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-full transition-colors ${
                userType === "employers"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-[#ffffff]/50"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span className="font-medium">Pemberi Kerja</span>
            </button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nama Lengkap"
                        className="bg-[#ffffff] border-gray-300 text-gray-900 placeholder:text-gray-400"
                        {...field}
                        data-testid="input-fullname"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nama Pengguna"
                        className="bg-[#ffffff] border-gray-300 text-gray-900 placeholder:text-gray-400"
                        {...field}
                        data-testid="input-username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Alamat email"
                      className="bg-[#ffffff] border-gray-300 text-gray-900 placeholder:text-gray-400"
                      {...field}
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Kata sandi"
                        className="bg-[#ffffff] border-gray-300 text-gray-900 placeholder:text-gray-400 pr-10"
                        {...field}
                        data-testid="input-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        data-testid="toggle-password"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Konfirmasi Kata Sandi"
                        className="bg-[#ffffff] border-gray-300 text-gray-900 placeholder:text-gray-400 pr-10"
                        {...field}
                        data-testid="input-confirm-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        data-testid="toggle-confirm-password"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={field.value}
                        onChange={field.onChange}
                        data-testid="checkbox-terms"
                      />
                    </FormControl>
                    <label className="text-sm text-gray-900">
                      Saya telah membaca dan menyetujui{" "}
                      <a href="#" className="text-gray-900 hover:underline font-bold">
                        Ketentuan Layanan
                      </a>
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
              data-testid="button-register"
            >
              Buat Akun →
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#ffffff] text-gray-500">ATAU</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-full bg-[#ffffff] hover:bg-gray-50 transition-colors"
            >
              <FaFacebook className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-900">Daftar dengan Facebook</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-full bg-[#ffffff] hover:bg-gray-50 transition-colors"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-gray-900">Daftar dengan Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
