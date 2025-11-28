import React from "react"
import { Zap, Brain, MessageCircle } from "lucide-react"
import { GlassCard, SectionTitle } from "@/components/landing/Section"

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Mulai dalam Hitungan Detik." subtitle="CARA KERJA" emoji="⚙️" />

        <div className="relative grid md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 border-t border-dashed border-slate-700 z-0" />

          {[
            { step: "01", title: "Input Media", desc: "Cukup nyalakan kamera untuk menangkap bahasa isyarat, atau gunakan mikrofon untuk input suara Anda.", icon: Zap },
            { step: "02", title: "Pemrosesan AI", desc: "Engine cerdas kami mendeteksi 21 titik landmark tangan dan melakukan analisis ekspresi wajah secara real-time.", icon: Brain },
            { step: "03", title: "Hasil Instan", desc: "Terima terjemahan dalam bentuk teks, suara, atau animasi avatar yang akurat dan ekspresif seketika.", icon: MessageCircle },
          ].map((item, i) => (
            <GlassCard
              key={i}
              className="relative z-10 p-6 md:p-10 rounded-[2.5rem] text-center group"
              hoverEffect={true}
            >
              <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:shadow-blue-500/20">
                <item.icon className="w-8 h-8 text-blue-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}