"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import GlobalLoader from "@/components/GlobalLoader";
import NotificationStack from "@/components/ui/notification";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] ${className}`}>
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    {children}
  </div>
);

const signUpLoadingMessages = [
  "Mendaftarkan akun Anda...",
  "Menyiapkan profil pengguna...",
  "Mengirim kode verifikasi...",
  "Sedikit lagi selesai..."
];
const signInLoadingMessages = ["Mengalihkan ke halaman masuk..."];

export default function SignUpClient() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "user";
  const [showPassword, setShowPassword] = useState(false);

  const { signup, sendCode, loading: storeLoading } = useAuthStore();
  const router = useRouter();

  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [activeMessages, setActiveMessages] = useState(signUpLoadingMessages);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      toast.error("Mohon lengkapi semua data pendaftaran");
      return;
    }

    setActiveMessages(signUpLoadingMessages);
    setIsLoadingLocal(true);

    try {
      await signup({ name, username, email, password, role });
      
      if (typeof window !== "undefined") {
        localStorage.setItem("temp_email", email);
      }

      await sendCode(email);
      
      setTimeout(() => {
        router.push(`/verify-code`);
      }, 2000);

    } catch (err: any) {
      console.error("Signup/OTP error:", err);
      setIsLoadingLocal(false);
    }
  };

  const handleSignInNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveMessages(signInLoadingMessages);
    setIsLoadingLocal(true);
    setTimeout(() => {
      router.push("/signin");
    }, 1000);
  };

  const isGlobalLoading = storeLoading || isLoadingLocal;

  return (
    <div className="relative min-h-screen bg-[#0A0F1C] text-slate-100 font-sans overflow-hidden flex items-center justify-center py-10">

      {/* Perbaikan: Menggunakan AnimatePresence dan conditional rendering karena GlobalLoader tidak menerima prop isLoading */}
      <AnimatePresence>
        {isGlobalLoading && <GlobalLoader messages={activeMessages} />}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" 
        />
        
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/15 rounded-full blur-[100px] mix-blend-screen" 
        />
      </div>

      <NotificationStack />

      <div className="w-full max-w-2xl px-6 relative z-10">

        <button 
          onClick={() => router.push('/')}
          className="absolute -top-12 left-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </button>

        <GlassCard className="p-8 md:p-12 rounded-[2rem]">
          
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shadow-lg shadow-blue-500/20 flex items-center justify-center mb-6 p-4 hover:scale-105 transition-transform duration-300">
              <img src="/lisan.png" alt="Lisan Logo" className="w-full h-full object-contain" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h1>
            <p className="text-slate-400 text-sm max-w-md">
              Bergabunglah dengan <span className="font-semibold text-blue-400">Lisan</span> untuk mulai belajar bahasa isyarat.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    disabled={isGlobalLoading}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    disabled={isGlobalLoading}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    disabled={isGlobalLoading}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 pl-1">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isGlobalLoading}
                      className="w-full px-5 py-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isGlobalLoading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isGlobalLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGlobalLoading ? "Memproses..." : "Daftar Sekarang"}
              </button>

              <p className="text-center text-sm text-slate-400 mt-6">
                Sudah punya akun?{" "}
                <button
                  onClick={handleSignInNavigation}
                  disabled={isGlobalLoading}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline underline-offset-4 disabled:opacity-50"
                >
                  Masuk di sini
                </button>
              </p>
            </div>

          </form>
        </GlassCard>
      </div>
    </div>
  );
}