"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

// --- MOCK HOOKS & UTILS ---

const useRouter = () => {
  return {
    push: (path: string) => console.log(`Navigating to: ${path}`),
  };
};

const useAuthStore = () => {
  const [loading, setLoading] = useState(false);

  const signin = async (identifier: string, pass: string) => {
    console.log("Signing in with:", identifier);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    return true; // Simulate success
  };

  return { signin, loading };
};

// --- KOMPONEN UI ---

const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  onClick,
  ...props
}: any) => {
  return (
    <Tag
      className={`relative flex content-center bg-black/20 hover:bg-black/10 transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit rounded-full cursor-pointer ${containerClassName}`}
      onClick={onClick}
      {...props}
    >
      <div className={`w-auto text-white z-10 bg-[#0A0F1C] px-4 py-2 rounded-[inherit] flex items-center gap-2 ${className}`}>
        {children}
      </div>
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: "conic-gradient(from 0deg at 50% 50%, #1e293b 0%, #3b82f6 50%, #1e293b 100%)" }}
        animate={{
          background: "conic-gradient(from 360deg at 50% 50%, #1e293b 0%, #3b82f6 50%, #1e293b 100%)",
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative bg-[#0A0F1C]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] ${className} overflow-hidden`}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-sm"></div>
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0"></div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// --- HALAMAN UTAMA ---

export default function SignInClient() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const { signin, loading } = useAuthStore();
  const router = useRouter();
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMessage("Harap isi semua field.");
      return;
    }

    setErrorMessage("");
    setIsLoadingLocal(true);

    try {
      await signin(emailOrUsername, password);
      
      setTimeout(() => {
        router.push("/my");
        setIsLoadingLocal(false);
      }, 500);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || "Gagal masuk, periksa kembali data Anda."
      );
      setIsLoadingLocal(false);
    }
  };

  const handleSignUpNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoadingLocal(true);
    setTimeout(() => {
      router.push("/sign-up");
    }, 500);
  };

  const isGlobalLoading = loading || isLoadingLocal;

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 font-sans flex items-center justify-center py-10 overflow-hidden">

      {/* --- BACKGROUND ANIMATION (ORBS) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none"></div>
        
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"
        />

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"
        />

        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 50, 50, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"
        />
      </div>

      <div className="fixed bottom-8 left-8 z-[50]">
        <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            onClick={() => router.push('/')}
            className="text-white"
        >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
        </HoverBorderGradient>
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        <GlassCard className="p-8 md:p-10 rounded-[2.5rem]">
          
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-20 h-20 rounded-2xl bg-[#0A0F1C] border border-white/10 flex items-center justify-center mb-6 p-4">
                  <img src="/lisan.png" alt="Lisan Logo" className="w-full h-full object-contain" />
                </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Selamat Datang</h1>
            <p className="text-slate-400 text-sm">
              Masuk ke akun <span className="font-semibold text-blue-400">Lisan</span> Anda
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center"
              >
                {errorMessage}
              </motion.div>
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
                disabled={isGlobalLoading}
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 pl-1">
                <label className="block text-sm font-medium text-slate-300">Kata Sandi</label>
                <a
                  href="/authentication/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline underline-offset-4"
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

            <button
              type="submit"
              disabled={isGlobalLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group mt-2"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              <span className="relative z-10">{isGlobalLoading ? "Memproses..." : "Masuk ke Akun"}</span>
            </button>

            <p className="text-center text-sm text-slate-400 mt-8">
              Belum punya akun?{" "}
              <button
                onClick={handleSignUpNavigation}
                disabled={isGlobalLoading}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline underline-offset-4 disabled:opacity-50"
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