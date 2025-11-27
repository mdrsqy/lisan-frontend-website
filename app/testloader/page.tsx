'use client'

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, Play, Pause, ChevronLeft, Zap } from "lucide-react"

// --- KOMPONEN GLOBAL LOADER (Disalin dari desain sebelumnya) ---
const loadingMessages = [
  "Menghubungkan Neural Network...",
  "Memuat Model Bahasa...",
  "Sinkronisasi Data...",
  "Menyiapkan Avatar 3D...",
  "Mengoptimalkan Latensi..."
]

const GlobalLoader = () => {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050810]/95 backdrop-blur-3xl overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Core Gyroscope Animation */}
      <div className="relative w-32 h-32 mb-12">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-blue-500/30 border-t-blue-400 border-r-transparent shadow-[0_0_30px_rgba(59,130,246,0.2)]"
        />
        
        {/* Inner Dashed Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-dashed border-purple-500/30 border-b-purple-400"
        />

        {/* 3D Spinning Orbits */}
        <div className="absolute inset-0 perspective-[1000px]">
          <motion.div
            animate={{ rotateX: 360, rotateY: 180 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-[2px] border-cyan-400/40 border-l-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            style={{ transformStyle: "preserve-3d" }}
          />
          <motion.div
            animate={{ rotateX: 180, rotateY: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border-[2px] border-blue-500/40 border-r-blue-400"
            style={{ transformStyle: "preserve-3d" }}
          />
        </div>

        {/* Core Pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white,0_0_40px_blue]" />
        </motion.div>
      </div>

      {/* Dynamic Text */}
      <div className="h-8 relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-blue-200 font-mono text-sm tracking-widest font-medium"
          >
            {loadingMessages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden relative">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  )
}
// --- END KOMPONEN ---


export default function TestLoaderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isInfinite, setIsInfinite] = useState(false)

  // Efek untuk simulasi loading timer
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isLoading && !isInfinite) {
      timeout = setTimeout(() => {
        setIsLoading(false)
      }, 5000) // 5 detik simulasi
    }
    return () => clearTimeout(timeout)
  }, [isLoading, isInfinite])

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-200 font-sans flex items-center justify-center p-6">
      
      {/* Tampilkan Loader jika state aktif */}
      <AnimatePresence>
        {(isLoading || isInfinite) && (
            <>
                <GlobalLoader />
                {/* Tombol Stop Darurat untuk Dev Mode */}
                <button 
                    onClick={() => { setIsLoading(false); setIsInfinite(false); }}
                    className="fixed bottom-10 right-10 z-[10000] px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-full text-xs font-mono hover:bg-red-500 hover:text-white transition-all"
                >
                    [DEV] FORCE STOP
                </button>
            </>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full relative z-10">
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6 text-blue-400">
                <Zap size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Loader Playground</h1>
            <p className="text-slate-400">Uji coba animasi, transisi, dan performa komponen Global Loader.</p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 space-y-4">
            
            {/* Opsi 1: Simulasi Normal */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <Play size={18} />
                        </div>
                        <span className="font-semibold text-white">Simulasi Loading</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">5 Detik</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">Menjalankan loader selama 5 detik lalu menutup otomatis. Berguna untuk melihat transisi mount/unmount.</p>
                <button 
                    onClick={() => setIsLoading(true)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                >
                    Mulai Test (5s)
                </button>
            </div>

            {/* Opsi 2: Infinite Loop */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <RefreshCw size={18} />
                        </div>
                        <span className="font-semibold text-white">Infinite Loop</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">Dev Mode</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">Loader akan berjalan terus menerus. Gunakan tombol [FORCE STOP] di pojok kanan bawah untuk keluar.</p>
                <button 
                    onClick={() => setIsInfinite(true)}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-purple-500/20"
                >
                    Mulai Loop
                </button>
            </div>

        </div>

        <div className="mt-8 text-center">
            <button className="text-sm text-slate-500 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors">
                <ChevronLeft size={16} /> Kembali ke Dashboard
            </button>
        </div>
      </div>
    </div>
  )
}