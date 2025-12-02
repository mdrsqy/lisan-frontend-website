"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, RefreshCw, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
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

const GlassCard = ({ children, className = "", isSuccess = false }: { children: React.ReactNode, className?: string, isSuccess?: boolean }) => (
  <motion.div
    animate={isSuccess ? {
      boxShadow: "0 0 50px -12px rgba(74, 222, 128, 0.5)",
      borderColor: "rgba(74, 222, 128, 0.3)"
    } : {
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.36)",
      borderColor: "rgba(255, 255, 255, 0.1)"
    }}
    transition={{ duration: 0.5 }}
    className={`
      relative overflow-hidden bg-[#0A0F1C]/60 backdrop-blur-2xl border 
      ${className}
    `}
  >
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

    <AnimatePresence>
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-green-500 pointer-events-none z-0"
        />
      )}
    </AnimatePresence>

    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

export default function VerifyCodeClient() {
  const router = useRouter();
  
  // State
  const { verifyCode, sendCode, loading: storeLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Menggabungkan loading state
  const isLoading = loading || storeLoading;

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
    if (!/^\d*$/.test(value)) return;

    setErrorMsg("");
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
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, '').slice(0, 6).split("");
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
      setErrorMsg("Mohon lengkapi 6 digit kode verifikasi");
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "warning", message: "Kode OTP harus 6 digit." },
        })
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {

      setLoading(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push("/sign-in");
      }, 2500);

    } catch (error: any) {
      setLoading(false);
      setIsSuccess(false);
      
      const msg = error?.response?.data?.message || error?.message || "Kode verifikasi salah atau kadaluarsa";
      setErrorMsg(msg);
      
      // Clear input jika gagal
      setCode(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem("temp_email") : "";
    
    if (!storedEmail) {
        window.dispatchEvent(
            new CustomEvent("notify", {
              detail: { type: "error", message: "Email tidak ditemukan, silakan daftar ulang." },
            })
        );
        return;
    }

    try {
        setLoading(true);
        await sendCode(storedEmail);
        setTimer(60);
        setLoading(false);
        // Notifikasi sukses handle di store
    } catch (error) {
        setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 font-sans flex items-center justify-center py-10 overflow-hidden">
      
      <Notification />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]"></div>

        <motion.div
          animate={isSuccess ? { scale: 0.8, opacity: 0 } : { x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"
        />

        <motion.div
          animate={isSuccess ? { scale: 0.8, opacity: 0 } : { x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isSuccess ? { opacity: 0.2, scale: 1.5 } : { opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/30 rounded-full blur-[150px]"
        />
      </div>

      <div className="w-full max-w-lg px-4 relative z-10">

        {!isSuccess && (
          <div className="fixed bottom-8 left-8 z-[50]">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              onClick={() => router.push('/sign-up')}
              className="text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Kembali</span>
            </HoverBorderGradient>
          </div>
        )}

        <GlassCard isSuccess={isSuccess} className="p-8 sm:p-10 rounded-[2.5rem]">

          <div className="mb-10 flex flex-col items-center text-center">
            <motion.div
              initial={false}
              animate={isSuccess ? {
                scale: [1, 1.2, 1],
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                borderColor: "rgba(34, 197, 94, 0.5)",
                rotate: [0, 10, -10, 0]
              } : {
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "rgba(59, 130, 246, 0.2)"
              }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-20 h-20 rounded-3xl border flex items-center justify-center mb-6 backdrop-blur-md"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <ShieldCheck className="w-10 h-10 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mail"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Mail className="w-10 h-10 text-blue-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div layout>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                {isSuccess ? "Verifikasi Berhasil!" : "Cek Email Anda"}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                {isSuccess
                  ? "Akun Anda telah aktif. Mengalihkan ke halaman login..."
                  : "Kami telah mengirimkan 6 digit kode verifikasi ke alamat email Anda."}
              </p>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isSuccess && (
                <motion.div
                  key="form-inputs"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-center gap-2 sm:gap-3 mb-8" onPaste={handlePaste}>
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
                        disabled={isLoading}

                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}

                        className={`
                          w-12 h-14 sm:w-14 sm:h-16 md:w-16 md:h-20 
                          rounded-2xl border text-center text-2xl font-bold 
                          bg-white/5 focus:bg-white/10 outline-none transition-all duration-200
                          ${errorMsg
                            ? "border-red-500/50 text-red-400 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)] animate-shake"
                            : "border-white/10 text-white focus:border-blue-500/50 focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]"
                          }
                        `}
                      />
                    ))}
                  </div>

                  {errorMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm text-center mb-6 -mt-4 bg-red-500/10 py-2 px-4 rounded-lg inline-block w-full"
                    >
                      {errorMsg}
                    </motion.p>
                  )}

                  <div className="flex flex-col gap-5">
                    <button
                      type="submit"
                      disabled={isLoading || code.join("").length < 6}
                      className="group relative w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                      <span className="relative flex items-center justify-center gap-2">
                        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {isLoading ? "Memverifikasi..." : "Verifikasi Kode"}
                      </span>
                    </button>

                    <div className="text-center">
                      {timer > 0 ? (
                        <p className="text-sm text-slate-500">
                          Kirim ulang kode dalam <span className="text-blue-400 font-mono font-medium">{timer}s</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={isLoading}
                          className="flex items-center justify-center gap-2 mx-auto text-sm text-blue-400 hover:text-blue-300 transition-colors group py-2 px-4 hover:bg-blue-500/10 rounded-full disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isLoading ? "animate-spin" : "group-hover:rotate-180"}`} />
                          Kirim Ulang Kode
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-center py-4"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block px-6 py-2 rounded-full bg-green-500/20 text-green-300 text-sm font-medium border border-green-500/30 mb-6"
                >
                  Akun Terverifikasi
                </motion.div>
                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Mohon tunggu sebentar...</p>
              </motion.div>
            )}
          </AnimatePresence>

        </GlassCard>
      </div>
    </div>
  );
}