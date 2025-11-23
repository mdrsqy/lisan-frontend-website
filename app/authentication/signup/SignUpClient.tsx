"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NotificationStack from "../../../components/ui/notification";

export default function SignUpClient() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "user";
  const [showPassword, setShowPassword] = useState(false);

  const { signup, loading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      toast.error("Harap isi semua field terlebih dahulu");
      return;
    }

    try {
      await signup({ name, username, email, password, role });

      toast.success(`Akun ${name} berhasil dibuat!`);

      setTimeout(() => router.push("/authentication/signin"), 1800);
    } catch (err: any) {
      toast.error(err.message || "Gagal mendaftar, periksa kembali data Anda");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f3f4f6] text-black overflow-hidden relative">

      {/* Background pastel lembut */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f7f8fa] to-[#f1f1f1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(246,191,75,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_90%,rgba(2,125,218,0.10),transparent_70%)]" />
      </div>

      <NotificationStack />

      {/* Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-20 relative z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.08)] border border-[#027dda]/10">

          <div className="mb-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-[0_0_15px_#027dda33] flex items-center justify-center">
              <img
                src="/lisan-logo.png"
                alt="Lisan Logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            <h1 className="mt-6 text-4xl font-semibold text-black">
              Buat Akun
            </h1>
            <p className="text-gray-600 mt-2">
              Bergabunglah dengan <span className="font-semibold text-[#027dda]">Lisan</span>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-[#027dda] outline-none transition-all"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-[#027dda] outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-[#027dda] outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#027dda] text-white font-semibold hover:scale-[1.02] hover:shadow-[0_0_18px_#027dda66] transition disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-3">
              Sudah punya akun?{" "}
              <a
                href="/authentication/signin"
                className="text-[#027dda] hover:text-[#c82131] font-medium transition"
              >
                Masuk di sini
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right visual */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative">
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_50%_50%,#027dda,transparent_70%)]" />
        <div className="animated-pattern w-full h-full flex items-center justify-center text-gray-400 text-lg font-light" />
      </div>
    </div>
  );
}