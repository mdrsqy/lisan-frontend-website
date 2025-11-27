"use client";

import React from "react";
import { Toaster, toast, Toast, resolveValue } from "react-hot-toast";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

const toastStyles = {
  success: {
    icon: CheckCircle2,
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/10",
    glow: "shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]",
    gradient: "from-green-500/20 to-transparent",
  },
  error: {
    icon: XCircle,
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/10",
    glow: "shadow-[0_0_30px_-5px_rgba(248,113,113,0.3)]",
    gradient: "from-red-500/20 to-transparent",
  },
  loading: {
    icon: Loader2,
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/10",
    glow: "shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]",
    gradient: "from-blue-500/20 to-transparent",
  },
  blank: {
    icon: Info,
    color: "text-slate-400",
    border: "border-slate-500/20",
    bg: "bg-slate-500/10",
    glow: "shadow-[0_0_30px_-5px_rgba(148,163,184,0.1)]",
    gradient: "from-slate-500/10 to-transparent",
  },
  custom: {
    icon: Info,
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/10",
    glow: "shadow-[0_0_30px_-5px_rgba(192,132,252,0.3)]",
    gradient: "from-purple-500/20 to-transparent",
  }
};

export default function NotificationStack() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        success: { duration: 4000 },
        error: { duration: 4000 },
        blank: { duration: 4000 },
        loading: { duration: Infinity },
      }}
    >
      {(t) => <ToastItem t={t} />}
    </Toaster>
  );
}

const ToastItem = ({ t }: { t: Toast }) => {
  const type =
    t.type === "loading"
      ? "loading"
      : t.type === "success"
      ? "success"
      : t.type === "error"
      ? "error"
      : "blank";

  const style = toastStyles[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={
        t.visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: -20, scale: 0.9 }
      }
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        group relative w-full max-w-sm overflow-hidden rounded-2xl 
        bg-[#0A0F1C]/80 backdrop-blur-xl border ${style.border}
        ${style.glow} transition-all duration-300
        hover:translate-y-[-2px] hover:shadow-lg
      `}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r ${style.gradient} opacity-50 pointer-events-none`} />

      <div className="relative p-4 flex items-start gap-4">
        <div
          className={`
          flex-shrink-0 w-10 h-10 rounded-full ${style.bg} ${style.border} border
          flex items-center justify-center ${style.color}
        `}
        >
          <Icon size={20} className={type === "loading" ? "animate-spin" : ""} />
        </div>

        <div className="flex-1 pt-0.5">
          <p className="text-sm font-semibold text-white leading-tight">
            {type === "loading"
              ? "Memproses..."
              : type === "success"
              ? "Berhasil"
              : type === "error"
              ? "Gagal"
              : "Info"}
          </p>
          <div className="mt-1 text-sm text-slate-400 leading-relaxed">
            {resolveValue(t.message, t)}
          </div>
        </div>

        {type !== "loading" && (
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {type === "loading" && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 10, ease: "linear" }}
        />
      )}
    </motion.div>
  );
};