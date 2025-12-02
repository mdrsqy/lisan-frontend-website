"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../lib/authStore";
import Notification from "../../components/Notification";

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

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative bg-[#0A0F1C]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] ${className} overflow-hidden`}>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 blur-sm"></div>
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0"></div>
    <div className="relative z-10">{children}</div>
  </div>
);

export default function SignInClient() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signin, loading: storeLoading } = useAuthStore();
  
  const router = useRouter();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: !emailOrUsername.trim(),
      password: !password.trim(),
    };
    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "warning", message: "Mohon lengkapi semua kolom yang bertanda merah." },
        })
      );
      return;
    }

    setIsRedirecting(true);
    try {

      await signin(emailOrUsername, password);

      const currentUser = useAuthStore.getState().user;
      const userRole = currentUser?.role || "user";

      setTimeout(() => {
        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/my");
        }

      }, 500);

    } catch (err: any) {
      console.error("Login error:", err);
      setIsRedirecting(false);
    }
  };

  const handleSignUpNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRedirecting(true);
    setTimeout(() => {
      router.push("/sign-up");
    }, 500);
  };

  const isGlobalLoading = storeLoading || isRedirecting;

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 font-sans flex items-center justify-center py-10 overflow-hidden">
      
      <Notification />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none"></div>

        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"
        />

        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"
        />

        <motion.div
          animate={{ x: [0, 50, -50, 0], y: [0, 50, 50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"
        />
      </div>

      <div className="fixed bottom-8 left-8 z-[50]">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          onClick={() => router.push("/")}
          className="text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Kembali</span>
        </HoverBorderGradient>
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        <GlassCard className="p-8 md:p-10 rounded-[2.5rem]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              <img 
                src="/lisan.png" 
                alt="Lisan Logo" 
                className="w-full h-full object-contain drop-shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Lisan";
                }} 
              />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Selamat Datang</h1>
            <p className="text-slate-400 text-sm">
              Masuk ke akun <span className="font-semibold text-blue-400">Lisan</span> Anda
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label className={`block text-sm font-medium mb-2 pl-1 transition-colors ${errors.email ? "text-red-400" : "text-slate-300"}`}>
                Email / Username {errors.email && "*"}
              </label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => {
                  setEmailOrUsername(e.target.value);
                  if (errors.email) setErrors(prev => ({...prev, email: false}));
                }}
                placeholder="nama@email.com"
                disabled={isGlobalLoading}
                className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-slate-500 outline-none transition-all duration-200 disabled:opacity-50
                  ${errors.email 
                    ? "border-red-500 focus:border-red-500 focus:bg-red-500/10 focus:ring-4 focus:ring-red-500/10 animate-pulse-once" 
                    : "border-white/10 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10"
                  }
                `}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1 pl-1">Email atau username wajib diisi</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 pl-1">
                <label className={`block text-sm font-medium transition-colors ${errors.password ? "text-red-400" : "text-slate-300"}`}>
                  Kata Sandi {errors.password && "*"}
                </label>
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({...prev, password: false}));
                  }}
                  placeholder="••••••••"
                  disabled={isGlobalLoading}
                  className={`w-full px-5 py-4 pr-12 rounded-xl bg-white/5 border text-white placeholder-slate-500 outline-none transition-all duration-200 disabled:opacity-50
                    ${errors.password
                      ? "border-red-500 focus:border-red-500 focus:bg-red-500/10 focus:ring-4 focus:ring-red-500/10 animate-pulse-once" 
                      : "border-white/10 focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10"
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isGlobalLoading}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50 ${errors.password ? "text-red-400 hover:text-red-300" : "text-slate-500 hover:text-white"}`}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>
               {errors.password && <p className="text-xs text-red-400 mt-1 pl-1">Kata sandi wajib diisi</p>}
            </div>

            <button
              type="submit"
              disabled={isGlobalLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-2"
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