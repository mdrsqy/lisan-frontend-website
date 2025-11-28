'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, PlayCircle, Apple } from "lucide-react"
import { SparklesCore } from "@/components/ui/sparkle"

const StoreBadge = ({ type, onClick }: { type: 'apple' | 'google', onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="relative group flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/[0.08] border border-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-white/25 transition-all active:scale-95 w-full overflow-hidden z-20 shadow-lg shadow-black/20"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {type === 'apple' ? (
      <Apple className="w-6 h-6 sm:w-8 sm:h-8 fill-white" />
    ) : (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg"
        alt="Play Store"
        className="w-5 h-5 sm:w-7 sm:h-7"
      />
    )}
    <div className="flex flex-col items-start text-white relative z-10">
      <span className="text-[10px] font-medium opacity-60 uppercase tracking-wide leading-none mb-1">
        {type === 'apple' ? 'Download on the' : 'Get it on'}
      </span>
      <span className="text-base sm:text-lg font-bold leading-none tracking-tight">
        {type === 'apple' ? 'App Store' : 'Google Play'}
      </span>
    </div>
  </button>
)

export default function HeroSection() {
  const router = useRouter()

  const handleAuthNavigation = (path: string) => {
    router.push(path)
  }

  const handleDownload = () => {
    window.open('https://play.google.com/store/apps', '_blank')
  }

  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 px-4 sm:px-6 overflow-hidden min-h-[100dvh] flex items-center justify-center bg-[#0A0F1C]">
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <SparklesCore
          id="tsparticles-bg"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#60A5FA"
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 mb-8 backdrop-blur-xl hover:bg-white/10 transition-colors cursor-pointer hover:border-blue-500/30 group">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
            <span className="text-xs sm:text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              Versi 2.0 Beta Kini Tersedia
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-white relative z-20 mb-2">
            The Voice of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-gradient-x">
              Hands
            </span>
          </h1>

          <div className="w-full max-w-[40rem] h-2 relative mx-auto mt-[-10px] md:mt-[-20px] mb-8">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/4 h-[5px] bg-indigo-500 blur-[20px]" />
          </div>

          <p className="text-base sm:text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light relative z-20 px-4">
            Menghadirkan jembatan komunikasi yang inklusif melalui kekuatan AI. Menerjemahkan bahasa isyarat secara{' '}
            <span className="text-white font-medium">real-time</span>, memahami{' '}
            <span className="text-white font-medium">konteks</span>, dan menangkap{' '}
            <span className="text-white font-medium">emosi</span>.
          </p>

          {/* Desktop Actions */}
          <div className="hidden md:flex flex-row items-center justify-center gap-5 mb-0 relative z-20">
            <button
              onClick={() => handleAuthNavigation('/sign-up')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-white shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Mulai Gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <button className="px-8 py-4 bg-white/[0.05] border border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 group active:scale-95">
              <PlayCircle className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors group-hover:scale-110 duration-300" />
              Lihat Demo
            </button>
          </div>

          {/* Mobile Actions (Store Badges) */}
          <div className="flex md:hidden flex-col gap-4 max-w-sm mx-auto mt-6 relative z-20 px-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StoreBadge type="google" onClick={handleDownload} />
              <StoreBadge type="apple" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto relative z-20">
            {[
              { val: "98%", label: "Akurasi AI" },
              { val: "22Jt+", label: "Komunitas" },
              { val: "<0.5s", label: "Latensi" },
              { val: "2 Arah", label: "Komunikasi" }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="bg-white/[0.03] border border-white/5 md:bg-transparent md:border-transparent md:hover:bg-white/5 md:hover:border-white/5 p-4 rounded-xl md:rounded-2xl transition-all cursor-default flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.val}</div>
                <div className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}