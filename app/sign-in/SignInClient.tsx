"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import GlobalLoader from "@/components/GlobalLoader";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`
      relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 
      shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] 
      ${className}
    `}
  >
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    {children}
  </div>
);

export default function SignInClient() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signin, loading } = useAuthStore();
  const router = useRouter();
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMessage("Harap isi semua field.");
      return;
    }

    setErrorMessage("");

    try {
      await signin(emailOrUsername, password);

      setTimeout(() => {
        router.push("/my");
      }, 500);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || "Gagal masuk, periksa kembali data Anda."
      );
    }
  };

  const handleSignUpNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoadingLocal(true);

    setTimeout(() => {
      router.push("/sign-up");
    }, 500);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0F1C] text-slate-100 flex items-center justify-center">
      {(loading || isLoadingLocal) && <GlobalLoader messages={["Memuat..."]} />}

      <div className="w-full max-w-md px-0 relative z-10">
        <button
          onClick={() => router.push("/")}
          className="absolute -top-12 left-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </button>

        <GlassCard className="p-8 md:p-10 rounded-[2.5rem]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shadow-lg shadow-blue-500/20 flex items-center justify-center mb-6 p-4">
              <img src="/lisan.png" alt="Lisan Logo" className="w-full h-full object-contain" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Selamat Datang</h1>
            <p className="text-slate-400 text-sm">
              Masuk ke akun <span className="font-semibold text-blue-400">Lisan</span> Anda
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMessage && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                {errorMessage}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                Email / Username
              </label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 pl-1">
                <label className="block text-sm font-medium text-slate-300">Kata Sandi</label>
                <a
                  href="/authentication/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Lupa kata sandi?
                </a>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isLoadingLocal}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 text-sm"
            >
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>

            <p className="text-center text-sm text-slate-400 mt-8">
              Belum punya akun?{" "}
              <button
                onClick={handleSignUpNavigation}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline-offset-4"
              >
                Daftar Sekarang
              </button>
            </p>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}