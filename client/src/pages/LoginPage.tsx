import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import logoImage from "@assets/black@4x_1760695283292.png";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="block mb-6 text-center" data-testid="link-home">
            <img src={logoImage} alt="Pintu Kerja" className="h-8 inline-block" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="login-title">
            Selamat Datang Kembali.
          </h1>
          <p className="text-gray-900">
            Belum punya akun?{" "}
            <Link href="/register" className="text-gray-900 hover:underline font-bold" data-testid="link-register">
              Daftar
            </Link>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  data-testid="checkbox-remember"
                />
                <span className="ml-2 text-sm text-gray-900">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-gray-900 hover:underline font-bold" data-testid="link-forgot-password">
                Lupa kata sandi?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base rounded-full"
              data-testid="button-login"
            >
              Masuk →
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
              <span className="text-sm text-gray-900">Masuk dengan Facebook</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-full bg-[#ffffff] hover:bg-gray-50 transition-colors"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-gray-900">Masuk dengan Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
