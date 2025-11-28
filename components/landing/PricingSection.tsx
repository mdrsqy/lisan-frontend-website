import React from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { GlassCard, SectionTitle } from "@/components/landing/Section"

export default function PricingSection() {
  return (
    <section id="investasi" className="py-24 px-6 overflow-visible relative z-20">
      <div className="max-w-5xl mx-auto relative z-20">
        <SectionTitle title="Investasi Cerdas untuk Masa Depan Inklusif." subtitle="INVESTASI" emoji="💳" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-20">
          <GlassCard className="relative z-20 p-6 md:p-10 rounded-[2.5rem] opacity-90 hover:opacity-100 transition-all hover:scale-[1.02]">
            <h3 className="text-2xl font-bold mb-2 text-white">Akses Dasar</h3>
            <p className="text-slate-400 mb-6">Solusi tepat untuk pemula & penggunaan harian</p>
            <div className="text-4xl font-bold text-white mb-8">Rp 0</div>
            <ul className="space-y-4 mb-8 text-slate-300">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Penerjemah Teks/Suara Dasar</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Akses Modul Pembelajaran Awal</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Avatar Standar</li>
            </ul>
            <Link href="/sign-up" className="w-full block text-center py-4 rounded-xl border border-white/20 font-bold hover:bg-white/10 hover:border-white/40 transition-all active:scale-95 text-white">
              Mulai Gratis
            </Link>
          </GlassCard>

          <GlassCard className="relative z-20 p-6 md:p-10 rounded-[2.5rem] border-blue-500/30 bg-blue-500/5 overflow-visible hover:border-blue-500/60 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:scale-[1.03] transition-all">
            <div className="absolute top-0 right-0 px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-bl-xl shadow-lg">POPULAR</div>
            <h3 className="text-2xl font-bold mb-2 text-white">Lisan Premium</h3>
            <p className="text-slate-400 mb-6">Pengalaman penuh tanpa batas & fitur AI canggih</p>
            <div className="text-4xl font-bold text-white mb-8">Rp 56.000<span className="text-lg text-slate-500 font-normal">/bulan</span></div>
            <ul className="space-y-4 mb-8 text-slate-300">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400" /> Semua Fitur Gratis</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400" /> Deteksi Emosi AI Lanjutan</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400" /> Pembelajaran Tanpa Batas & XP</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400" /> AI Coach Pribadi</li>
            </ul>
            <Link href="/sign-up" className="w-full block text-center py-4 rounded-xl bg-blue-600 font-bold hover:bg-blue-500 hover:shadow-lg transition-all active:scale-95 shadow-blue-500/25 text-white">
              Berlangganan Sekarang
            </Link>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}