"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NotificationStack from "@/components/ui/notification";

export default function SignInClient() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signin, loading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrUsername.trim() || !password.trim()) {
      toast.error("Harap isi semua field terlebih dahulu");
      return;
    }

    try {
      await signin(emailOrUsername, password);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      toast.success(`Selamat datang kembali, ${user.name || "User"}!`);

      setTimeout(() => {
        router.push(
          user.role === "admin"
            ? "/admin/dashboard"
            : "/user/dashboard"
        );
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Gagal masuk, periksa kembali data Anda");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f3f4f6] text-black overflow-hidden relative">

      {/* Background pastel seperti landing page */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f7f8fa] to-[#f1f1f1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(246,191,75,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(2,125,218,0.10),transparent_70%)]" />
      </div>

      <NotificationStack />

      {/* Card login */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-20 relative z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.08)] border border-[#027dda]/10">

          <div className="mb-10 flex flex-col items-center text-center">

            {/* Logo */}
            <div className="w-16 h-16 rounded-full bg-white shadow-[0_0_15px_#027dda33] flex items-center justify-center">
              <img
                src="/lisan-logo.png"
                alt="Lisan Logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            <h1 className="mt-5 text-4xl font-semibold text-black">Selamat Datang</h1>
            <p className="text-gray-600 mt-2">
              Masuk ke <span className="font-semibold text-[#027dda]">Lisan</span>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email / Username */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Email / Username
              </label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="contoh@email.com atau username"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-[#027dda] outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Kata Sandi
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-[#027dda] outline-none transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-500 hover:text-[#027dda] transition"
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.5} />
                  ) : (
                    <Eye size={20} strokeWidth={1.5} />
                  )}
                </button>
              </div>

              <div className="flex justify-end mt-2">
                <a
                  href="/authentication/forgot-password"
                  className="text-sm text-gray-600 hover:text-[#027dda] transition"
                >
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#027dda] text-white font-semibold hover:scale-[1.02] hover:shadow-[0_0_18px_#027dda66] transition disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Belum punya akun?{" "}
              <a
                href="/authentication/signup"
                className="text-[#027dda] hover:text-[#c82131] font-medium transition"
              >
                Daftar di sini
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right side visual */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative">
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_50%_50%,#027dda,transparent_70%)]" />
        <div className="animated-pattern w-full h-full flex items-center justify-center text-gray-400 text-lg font-light"></div>
      </div>
    </div>
  );
}