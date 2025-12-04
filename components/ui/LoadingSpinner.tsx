"use client";

import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingSpinnerProps {
  isLoading: boolean;
  text?: string;
}

export function LoadingSpinner({ isLoading, text = "Memuat Data..." }: LoadingSpinnerProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-md animate-pulse" />
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600 relative z-10" />
          </div>
          <span className="text-xs font-bold text-slate-700 tracking-wide">{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}