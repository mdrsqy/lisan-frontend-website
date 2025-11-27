"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, RefreshCw, Mail, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import NotificationStack from "@/components/ui/notification";
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

export default function VerifyCodeClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];
    
    if (value.length > 1) {
      const pastedValue = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        if (pastedValue[i]) newCode[i] = pastedValue[i];
      }
      setCode(newCode);
      const lastIndex = Math.min(newCode.length - 1, pastedValue.length - 1);
      inputRefs.current[lastIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newCode = [...code];
    pastedData.forEach((char, index) => {
      newCode[index] = char;
    });
    setCode(newCode);
    inputRefs.current[Math.min(5, pastedData.length - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = code.join("");
    
    if (otpString.length < 6) {
      toast.error("Mohon lengkapi 6 digit kode verifikasi");
      return;
    }

    setLoading(true);
    try {
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem("temp_email") : "";
      
      await api.post("/auth/verify-email", { 
        token: otpString,
        email: storedEmail 
      });

      setLoading(false);
      setIsSuccess(true);
      toast.success("Verifikasi berhasil! Mengalihkan...");
      
      setTimeout(() => {
        router.push("/authentication/signin");
      }, 2000);

    } catch (error: any) {
      const msg = error.response?.data?.message || "Kode verifikasi salah atau kadaluarsa";
      toast.error(msg);
      setLoading(false);
      setIsSuccess(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    const loadingToast = toast.loading("Mengirim ulang kode...");
    try {
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem("temp_email") : "";
      await api.post("/auth/resend-verification", { email: storedEmail });
      
      setTimer(60);
      toast.success("Kode baru telah dikirim ke email Anda", { id: loadingToast });
    } catch (error) {
      toast.error("Gagal mengirim ulang kode", { id: loadingToast });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0F1C] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-100 overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {loading && <GlobalLoader messages={["Memverifikasi kode...", "Mengecek validitas...", "Mengaktifkan akun..."]} />}
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

      {/* Mengubah max-w-md menjadi max-w-lg agar kartu lebih lebar */}
      <div className="w-full max-w-lg px-4 relative z-10">
        <button 
          onClick={() => router.back()}
          className="absolute -top-12 left-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        <GlassCard className="p-6 sm:p-8 md:p-10 rounded-[2.5rem]">
          <div className="mb-8 flex flex-col items-center text-center">
            <motion.div 
              animate={isSuccess ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : {}}
              className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 transition-colors duration-500
                ${isSuccess 
                  ? "bg-green-500/20 border-green-500/50 shadow-[0_0_30px_-5px_rgba(34,197,94,0.5)]" 
                  : "bg-blue-500/10 border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]"
                }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              ) : (
                <Mail className="w-8 h-8 text-blue-400" />
              )}
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Verifikasi Email</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Masukkan 6 digit kode yang telah kami kirimkan ke email Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-4 mb-8" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  
                  animate={isSuccess ? {
                    borderColor: "#4ade80",
                    backgroundColor: "rgba(74, 222, 128, 0.1)",
                    color: "#4ade80",
                    scale: 1.05,
                    boxShadow: "0 0 15px -3px rgba(74, 222, 128, 0.4)"
                  } : {
                    borderColor: digit ? "rgba(59, 130, 246, 0.5)" : "rgba(255, 255, 255, 0.1)",
                    scale: 1,
                    backgroundColor: digit ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.05)"
                  }}
                  
                  transition={{
                    duration: 0.3,
                    delay: isSuccess ? index * 0.08 : 0,
                    type: "spring",
                    stiffness: 300
                  }}

                  // Memperlebar ukuran kotak input: w-12/14/16
                  className="w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-20 rounded-xl border text-center text-xl sm:text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-text"
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading || code.join("").length < 6 || isSuccess}
                className={`
                  w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all duration-300 text-sm tracking-wide
                  ${isSuccess 
                    ? "bg-green-600 shadow-green-500/25 scale-[1.02]" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {loading ? "Memverifikasi..." : isSuccess ? "Berhasil!" : "Verifikasi Kode"}
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-slate-500">
                    Kirim ulang kode dalam <span className="text-slate-300 font-mono font-medium">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="flex items-center justify-center gap-2 mx-auto text-sm text-blue-400 hover:text-blue-300 transition-colors group"
                  >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Kirim Ulang Kode
                  </button>
                )}
              </div>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}