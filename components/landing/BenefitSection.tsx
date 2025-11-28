import React from "react"
import { MessageCircle, ShieldCheck, Smartphone, Globe, CheckCircle2, Zap } from "lucide-react"
import { SectionTitle } from "@/components/landing/Section"

export default function BenefitsSection() {
  return (
    <section id="manfaat" className="relative py-20 px-6 bg-[#0A0F1C] overflow-hidden">
      <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle title="Mengapa Memilih Lisan?" subtitle="KEUNGGULAN" emoji="💎" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[
            { title: "Komunikasi Natural", desc: "Interaksi yang mengalir dan tidak kaku. Algoritma canggih kami memahami konteks kalimat dan intonasi bicara.", icon: MessageCircle },
            { title: "Aksesibilitas Tanpa Batas", desc: "Jembatan penghubung antara Teman Tuli dan Teman Dengar untuk berinteraksi di mana saja dan kapan saja.", icon: ShieldCheck },
            { title: "Fleksibilitas Belajar", desc: "Akses modul pembelajaran komprehensif kapan saja langsung dari smartphone Anda dengan antarmuka intuitif.", icon: Smartphone },
            { title: "Komunitas Inklusif", desc: "Bergabunglah dengan jaringan ribuan pengguna yang peduli pada kesetaraan, empati, dan inklusivitas.", icon: Globe },
            { title: "Umpan Balik Instan", desc: "AI Coach pribadi memberikan koreksi langsung jika gerakan isyarat Anda kurang tepat, mempercepat proses belajar.", icon: CheckCircle2 },
            { title: "Privasi Terjamin", desc: "Keamanan data adalah prioritas utama kami. Seluruh percakapan diproses dengan standar enkripsi tingkat tinggi.", icon: Zap },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-blue-500/30">
                  <item.icon className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>

                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}