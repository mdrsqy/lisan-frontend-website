import React from "react"
import { ScanFace, Heart, Gamepad2, Users } from "lucide-react"
import { GlassCard, SectionTitle } from "@/components/landing/Section"

export default function FeaturesSection() {
  return (
    <section id="fitur" className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Inovasi Teknologi Inklusif." subtitle="FITUR UTAMA" emoji="⚡️" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          <GlassCard className="md:col-span-2 md:row-span-2 p-6 md:p-10 rounded-[2.5rem] flex flex-col justify-between group relative overflow-hidden" hoverEffect={true}>
            <div>
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <ScanFace className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">Penerjemah Dua Arah Cerdas</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-lg group-hover:text-slate-200 transition-colors">
                Ciptakan percakapan yang mengalir tanpa hambatan. Terjemahkan Bahasa Isyarat (BISINDO/SIBI) menjadi teks atau suara secara instan, dan ubah ucapan lawan bicara menjadi visualisasi avatar 3D.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {['TensorFlow', 'MediaPipe', 'TCN Model'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs font-mono text-blue-300 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">{tag}</span>
              ))}
            </div>
            <div className="hidden md:block absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-600/20 transition-colors" />
          </GlassCard>

          <GlassCard className="p-6 md:p-8 rounded-[2.5rem] group" hoverEffect={true}>
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 text-pink-400 border border-pink-500/20 group-hover:scale-110 transition-transform duration-300 group-hover:bg-pink-500 group-hover:text-white">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-pink-300 transition-colors">Deteksi Emosi & Ekspresi</h3>
            <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200">
              Komunikasi lebih dari sekadar kata. AI menangkap nuansa emosi agar avatar merepresentasikan perasaan Anda.
            </p>
          </GlassCard>

          <GlassCard className="p-6 md:p-8 rounded-[2.5rem] group" hoverEffect={true}>
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300 group-hover:bg-cyan-500 group-hover:text-white">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">Pembelajaran Tergamifikasi</h3>
            <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200">
              Kuasai bahasa isyarat dengan cara yang menyenangkan. Raih poin, naikkan level, dan dapatkan lencana.
            </p>
          </GlassCard>

          <GlassCard className="md:col-span-3 lg:col-span-1 p-6 md:p-8 rounded-[2.5rem] group flex items-center gap-6" hoverEffect={true}>
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex-shrink-0 flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300 group-hover:bg-purple-500 group-hover:text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-purple-300 transition-colors">Mesin Avatar 3D</h3>
              <p className="text-slate-400 text-sm group-hover:text-slate-200">Visualisasi gerakan tangan yang halus, natural, dan mudah dipahami.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}