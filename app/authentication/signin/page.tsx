'use client';
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignIn() {
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

      toast.success(`Selamat datang kembali, ${user.name}!`, { duration: 2500 });

      setTimeout(() => {
        if (user.role === "admin") router.push("/admin/dashboard");
        else router.push("/user/dashboard");
      }, 3500);
    } catch (err: any) {
      toast.error(err.message || "Gagal masuk, periksa kembali data Anda");
    }
  };



  return (
    <div className="min-h-screen flex bg-[#070014] text-gray-200 overflow-hidden">
      {/* Kiri: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-700 to-pink-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-900/30">
              H
            </div>
            <h1 className="mt-6 text-4xl font-light text-gray-100">
              Selamat Datang
            </h1>
            <p className="text-gray-400 mt-2">
              Masuk ke <span className="text-pink-400 font-semibold">Lisan</span>.
            </p>
          </div>

          {/* Form Login */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email / Username</label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="contoh@email.com atau username"
                className="w-full px-4 py-3 rounded-xl bg-[#100026] border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none text-gray-100 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#100026] border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 outline-none text-gray-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400 hover:text-pink-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a
                  href="/authentication/forgot-password"
                  className="text-sm text-pink-400 hover:text-pink-300 transition-all"
                >
                  Lupa kata sandi?
                </a>
              </div>
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-900/30 transition-transform duration-300 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Belum punya akun?{" "}
              <a
                href="/authentication/signup"
                className="text-pink-400 hover:text-pink-300 font-medium transition-all"
              >
                Daftar di sini
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Kanan */}
      <div className="hidden md:flex w-1/2 bg-[#100026] items-center justify-center border-l border-gray-800">
        <div className="animated-pattern w-[100%] h-[100%] rounded-1xl shadow-xl flex items-center justify-center text-gray-100 text-lg font-light border border-gray-700">
        </div>
      </div>
    </div>
  );
}