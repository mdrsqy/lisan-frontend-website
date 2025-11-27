"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NotificationStack from "@/components/ui/notification";
import { motion, AnimatePresence } from "framer-motion";
import GlobalLoader from "@/components/GlobalLoader";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`
    relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 
    shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] 
    ${className}
  `}>
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    {children}
  </div>
);

const signInLoadingMessages = [
  "Selamat datang kembali!"
];

const signUpLoadingMessages = [
  "Mengalihkan ke halaman daftar..."
];

export default function SignInClient() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signin, loading } = useAuthStore();
  const router = useRouter();
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [activeMessages, setActiveMessages] = useState(signInLoadingMessages);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveMessages(signInLoadingMessages);

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

  const handleSignUpNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveMessages(signUpLoadingMessages);
    setIsLoadingLocal(true);

    setTimeout(() => {
      router.push('/sign-up');
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0F1C] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-100 overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {(loading || isLoadingLocal) && <GlobalLoader messages={activeMessages} />}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" 
        />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/15 rounded-full blur-[100px] mix-blend-screen" 
        />
      </div>

      <NotificationStack />

      <div className="w-full max-w-md px-0 relative z-10">
        
        <button 
          onClick={() => router.push('/')}
          className="absolute -top-12 left-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </button>

        <GlassCard className="p-8 md:p-10 rounded-[2.5rem]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shadow-lg shadow-blue-500/20 flex items-center justify-center mb-6 p-4 hover:scale-105 transition-transform duration-300">
              {/* Logo Image */}
              <img 
                src="/lisan.png" 
                alt="Lisan Logo" 
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Selamat Datang</h1>
            <p className="text-slate-400 text-sm">
              Masuk ke akun <span className="font-semibold text-blue-400">Lisan</span> Anda untuk melanjutkan
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">
                Email / Username
              </label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 pl-1">
                <label className="block text-sm font-medium text-slate-300">
                  Kata Sandi
                </label>
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
                  className="w-full px-5 py-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
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
              disabled={loading || isLoadingLocal}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 text-sm tracking-wide"
            >
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>

            <p className="text-center text-sm text-slate-400 mt-8">
              Belum punya akun?{" "}
              <button
                onClick={handleSignUpNavigation}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline underline-offset-4 bg-transparent border-none cursor-pointer p-0 inline"
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