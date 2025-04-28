"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import logoipsum from "@/assets/img/logoipsum.png";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons
import { useRouter } from "next/navigation";

// Validasi form
const registerSchema = z.object({
  username: z.string().min(3, "Minimal 3 karakter"),
  password: z.string().min(6, "Minimal 6 karakter"),
  role: z.string().min(1, "Wajib pilih role"),
});

type FormValues = z.infer<typeof registerSchema>;

const roles = ["Admin", "User"];

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post("/auth/register", data);

      if (response.data?.message) {
        alert(response.data.message);
      } else {
        alert("Pendaftaran berhasil!");
        router.push("/login");
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message || "Terjadi kesalahan saat mendaftar.";
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                {...register("password")}
                placeholder="Input password"
                className="w-full mt-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Button to toggle password visibility */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              {...register("role")}
              className="w-full mt-1 px-3 py-2 border rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition"
          >
            Register
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
