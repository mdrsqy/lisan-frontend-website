'use client';

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignUp() {
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
        duration: 2500,
      });

      setTimeout(() => router.push("/authentication/signin"), 3000);
    } catch (err: any) {
      toast.error(err.message || "Gagal mendaftar, periksa kembali data Anda");
    }
  };

  return (
    <div className="min-h-screen flex bg-[oklch(0.145_0_0)] text-[oklch(0.985_0_0)] overflow-hidden">
      {/* Kiri: Form Sign Up */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-20 relative">
        <div className="absolute inset-0 bg-[oklch(0.205_0_0)/0.15] backdrop-blur-md rounded-2xl shadow-[0_0_80px_oklch(0.922_0_0)/0.1]" />
        
        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[oklch(0.922_0_0)] to-pink-500 flex items-center justify-center text-[oklch(0.205_0_0)] font-bold text-xl shadow-[0_0_30px_oklch(0.922_0_0)/0.4]">
              H
            </div>
            <h1 className="mt-6 text-4xl font-light text-[oklch(0.985_0_0)]">
              Buat Akun
            </h1>
            <p className="text-[oklch(0.922_0_0)] mt-2">
              Bergabunglah dengan{" "}
              <span className="font-semibold text-[oklch(0.985_0_0)]">Lisan</span>.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm text-[oklch(0.922_0_0)] mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={full_name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-4 py-3 rounded-xl bg-[oklch(0.205_0_0)/0.5] text-[oklch(0.985_0_0)] placeholder-[oklch(0.922_0_0)/0.6]
                focus:ring-2 focus:ring-[oklch(0.922_0_0)] outline-none shadow-inner shadow-[oklch(0.205_0_0)/0.4] transition-all duration-300"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm text-[oklch(0.922_0_0)] mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 rounded-xl bg-[oklch(0.205_0_0)/0.5] text-[oklch(0.985_0_0)] placeholder-[oklch(0.922_0_0)/0.6]
                focus:ring-2 focus:ring-[oklch(0.922_0_0)] outline-none shadow-inner shadow-[oklch(0.205_0_0)/0.4] transition-all duration-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-[oklch(0.922_0_0)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 rounded-xl bg-[oklch(0.205_0_0)/0.5] text-[oklch(0.985_0_0)] placeholder-[oklch(0.922_0_0)/0.6]
                focus:ring-2 focus:ring-[oklch(0.922_0_0)] outline-none shadow-inner shadow-[oklch(0.205_0_0)/0.4] transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[oklch(0.922_0_0)] mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[oklch(0.205_0_0)/0.5] text-[oklch(0.985_0_0)] placeholder-[oklch(0.922_0_0)/0.6]
                  focus:ring-2 focus:ring-[oklch(0.922_0_0)] outline-none shadow-inner shadow-[oklch(0.205_0_0)/0.4] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-[oklch(0.922_0_0)] hover:text-[oklch(0.985_0_0)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.5} />
                  ) : (
                    <Eye size={20} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Daftar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[oklch(0.922_0_0)] to-pink-500 text-[oklch(0.205_0_0)] font-semibold
              hover:scale-[1.02] hover:shadow-[0_0_25px_oklch(0.922_0_0)/0.5] transition-transform duration-300 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>

            <p className="text-center text-sm text-[oklch(0.922_0_0)] mt-4">
              Sudah punya akun?{" "}
              <a
                href="/authentication/signin"
                className="text-[oklch(0.985_0_0)] hover:text-[oklch(0.922_0_0)] font-medium transition-all"
              >
                Masuk di sini
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Kanan: Animasi Background (tetap dipertahankan) */}
      <div className="hidden md:flex w-1/2 bg-[oklch(0.205_0_0)] items-center justify-center border-l border-[oklch(0.922_0_0)/0.2]">
        <div className="animated-pattern w-full h-full rounded-1xl shadow-xl flex items-center justify-center text-[oklch(0.985_0_0)] text-lg font-light border border-[oklch(0.922_0_0)/0.3]" />
      </div>
    </div>
  );
}