"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoipsum from "@/assets/img/logoipsum.png";
import nookies from "nookies";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons from react-icons

// Validasi form login
const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type FormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post("/auth/login", data);
      const { token } = response.data;

      if (token) {
        nookies.set(null, "token", token, { path: "/" });
        router.push("/articles");
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message ||
        "Gagal login. Periksa kembali akun Anda.";
      alert(message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F6F7F9] px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center mb-4">
            <Image src={logoipsum} alt="Logo" width={140} height={40} />
          </div>

          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              {...register("username")}
              placeholder="Input username"
              className="w-full mt-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                {...register("password")}
                placeholder="Input password"
                className="w-full mt-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Toggle button for visibility */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition"
          >
            Login
          </button>

          <p className="text-sm text-center">
            {"Don't have an account? "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
