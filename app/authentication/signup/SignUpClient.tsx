"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NotificationStack from "../../../components/ui/notification";

export default function SignUpClient() {
  const [full_name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  const { signup, loading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!full_name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      toast.error("Harap isi semua field terlebih dahulu");
      return;
    }

    try {
      await signup({ full_name, username, email, password, role });
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      toast.success(`Akun ${user.full_name || "baru"} berhasil dibuat!`, {
        duration: 2000,
      });

      setTimeout(() => router.push("/authentication/signin"), 2200);
    } catch (err: any) {
      toast.error(err.message || "Gagal mendaftar, periksa kembali data Anda");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#000000] text-[#e7e9ea] overflow-hidden">
      {/* 🔔 Global Notification */}
      <NotificationStack />

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-20 relative">
        <div className="absolute inset-0 bg-[#1c9cf0]/10 backdrop-blur-md rounded-2xl shadow-[0_0_80px_#1c9cf0]/10" />

        <div className="w-full max-w-md relative z-10">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#1c9cf0] flex items-center justify-center text-[#ffffff] font-bold text-xl shadow-[0_0_30px_#1c9cf0]/40">
              H
            </div>
            <h1 className="mt-6 text-4xl font-light text-[#e7e9ea]">Buat Akun</h1>
            <p className="text-[#e7e9ea]/70 mt-2">
              Bergabunglah dengan{" "}
              <span className="font-semibold text-[#ffffff]">Lisan</span>.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-[#e7e9ea]/80 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={full_name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-4 py-3 rounded-xl bg-[#1c9cf0]/10 text-[#e7e9ea] placeholder-[#e7e9ea]/50
                focus:ring-2 focus:ring-[#1c9cf0] outline-none shadow-inner shadow-[#000000]/40 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-[#e7e9ea]/80 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 rounded-xl bg-[#1c9cf0]/10 text-[#e7e9ea] placeholder-[#e7e9ea]/50
                focus:ring-2 focus:ring-[#1c9cf0] outline-none shadow-inner shadow-[#000000]/40 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-[#e7e9ea]/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 rounded-xl bg-[#1c9cf0]/10 text-[#e7e9ea] placeholder-[#e7e9ea]/50
                focus:ring-2 focus:ring-[#1c9cf0] outline-none shadow-inner shadow-[#000000]/40 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-[#e7e9ea]/80 mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1c9cf0]/10 text-[#e7e9ea] placeholder-[#e7e9ea]/50
                  focus:ring-2 focus:ring-[#1c9cf0] outline-none shadow-inner shadow-[#000000]/40 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-[#e7e9ea]/70 hover:text-[#ffffff] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.5} />
                  ) : (
                    <Eye size={20} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1c9cf0] text-[#ffffff] font-semibold
              hover:scale-[1.02] hover:shadow-[0_0_25px_#1c9cf0]/60 transition-transform duration-300 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>

            <p className="text-center text-sm text-[#e7e9ea]/80 mt-4">
              Sudah punya akun?{" "}
              <a
                href="/authentication/signin"
                className="text-[#1c9cf0] hover:text-[#ffffff] font-medium transition-all"
              >
                Masuk di sini
              </a>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-[#000000] items-center justify-center border-l border-[#1c9cf0]/20">
        <div className="animated-pattern w-full h-full rounded-1xl shadow-xl flex items-center justify-center text-[#e7e9ea] text-lg font-light border border-[#1c9cf0]/30" />
      </div>
    </div>
  );
}