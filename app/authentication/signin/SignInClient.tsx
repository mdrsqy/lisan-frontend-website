"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NotificationStack from "../../../components/ui/notification";

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

      toast.success(`Selamat datang kembali, ${user.full_name || "User"}!`);

      setTimeout(() => {
        router.push(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      }, 2200);
    } catch (err: any) {
      toast.error(err.message || "Gagal masuk, periksa kembali data Anda");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#000000] text-[#e7e9ea] overflow-hidden relative">
      <NotificationStack />

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-20 relative">
        <div className="absolute inset-0 bg-[#1c9cf0]/10 backdrop-blur-md rounded-2xl shadow-[0_0_80px_#1c9cf0]/20" />
        <div className="w-full max-w-md relative z-10">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#1c9cf0] flex items-center justify-center text-[#ffffff] font-bold text-xl shadow-[0_0_30px_#1c9cf0]/40">
              H
            </div>
            <h1 className="mt-6 text-4xl font-light text-[#ffffff]">Selamat Datang</h1>
            <p className="text-[#e7e9ea]/80 mt-2">
              Masuk ke <span className="font-semibold text-[#1c9cf0]">Lisan</span>.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-[#e7e9ea]/80 mb-2">Email / Username</label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="contoh@email.com atau username"
                className="w-full px-4 py-3 rounded-xl bg-[#000000]/40 text-[#e7e9ea] placeholder-[#e7e9ea]/60 focus:ring-2 focus:ring-[#1c9cf0] outline-none shadow-inner shadow-[#000000]/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-[#e7e9ea]/80 mb-2">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#000000]/40 text-[#e7e9ea] placeholder-[#e7e9ea]/60 focus:ring-2 focus:ring-[#1c9cf0] outline-none shadow-inner shadow-[#000000]/50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-[#e7e9ea]/70 hover:text-[#1c9cf0] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>

              <div className="flex justify-end mt-2">
                <a href="/authentication/forgot-password" className="text-sm text-[#e7e9ea]/80 hover:text-[#1c9cf0] transition-all">
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1c9cf0] text-[#ffffff] font-semibold hover:scale-[1.02] hover:shadow-[0_0_25px_#1c9cf0]/70 transition-transform duration-300 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <p className="text-center text-sm text-[#e7e9ea]/80 mt-4">
              Belum punya akun?{" "}
              <a href="/authentication/signup" className="text-[#1c9cf0] hover:text-[#ffffff] font-medium transition-all">
                Daftar di sini
              </a>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-[#000000] items-center justify-center border-l border-[#1c9cf0]/20">
        <div className="animated-pattern w-full h-full flex items-center justify-center text-[#e7e9ea] text-lg font-light border border-[#1c9cf0]/20"></div>
      </div>
    </div>
  );
}