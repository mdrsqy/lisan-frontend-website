'use client'

import React from "react"
import { Apple } from "lucide-react"
import { Boxes } from "@/components/ui/background-boxes"
import { cn } from "@/lib/utils"

const StoreBadge = ({ type, onClick }: { type: 'apple' | 'google', onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="relative group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 w-full sm:w-auto justify-center sm:justify-start overflow-hidden z-40"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {type === 'apple' ? (
      <Apple className="w-8 h-8 fill-white" />
    ) : (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg"
        alt="Play Store"
        className="w-7 h-7"
      />
    )}
    <div className="flex flex-col items-start text-white relative z-40">
      <span className="text-[10px] font-medium opacity-60 uppercase tracking-wide leading-none mb-1">
        {type === 'apple' ? 'Download on the' : 'Get it on'}
      </span>
      <span className="text-lg font-bold leading-none tracking-tight">
        {type === 'apple' ? 'App Store' : 'Google Play'}
      </span>
    </div>
  </button>
)

export default function CtaSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0A0F1C] py-32 flex flex-col items-center justify-center rounded-3xl mx-auto my-20 max-w-7xl border border-white/10">

      <div className="absolute inset-0 w-full h-full bg-[#0A0F1C] z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes className="pointer-events-none !z-0" />

      <div className={cn("relative z-40 px-6 text-center max-w-4xl mx-auto")}>
        <h2 className="text-4xl md:text-7xl font-bold mb-8 text-white tracking-tight">
          Jadilah Bagian dari <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Revolusi Inklusi
          </span>
        </h2>

        <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Jangan biarkan perbedaan bahasa menjadi penghalang. Mulai langkah kecil Anda hari ini untuk Indonesia yang lebih setara dengan teknologi Lisan.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
          <StoreBadge type="apple" onClick={() => { }} />
          <StoreBadge type="google" onClick={() => { }} />
        </div>
      </div>
    </section>
  )
}