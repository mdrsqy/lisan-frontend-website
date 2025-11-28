import React from "react"
import { Star } from "lucide-react"
import { GlassCard, SectionTitle } from "@/components/landing/Section"

export default function TestimonialsSection() {
  return (
    <section id="social-proof" className="py-24 px-6 overflow-visible">
      <div className="max-w-7xl mx-auto">
        <SectionTitle title="Dipercaya oleh Komunitas." subtitle="TESTIMONI" emoji="💙" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Andi Saputra", role: "Teman Tuli", text: "Sebuah terobosan! Sekarang saya bisa memesan kopi dan mengobrol santai dengan barista tanpa perlu menulis di kertas.", color: "bg-blue-500" },
            { name: "Siti Aminah", role: "Manajer HRD", text: "Lisan sangat membantu proses wawancara kerja untuk kandidat disabilitas. Komunikasi berjalan lancar dan profesional.", color: "bg-purple-500" },
            { name: "Budi Santoso", role: "Mahasiswa", text: "Belajar BISINDO jadi serasa main game. Fitur rank dan XP bikin saya termotivasi untuk latihan setiap hari.", color: "bg-cyan-500" }
          ].map((testi, i) => (
            <GlassCard key={i} className="relative z-10 p-6 md:p-8 rounded-3xl group" hoverEffect={true}>
              <div className="flex gap-1 text-yellow-500 mb-6 group-hover:scale-105 transition-transform origin-left">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-300 mb-8 italic text-lg group-hover:text-white transition-colors">"{testi.text}"</p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${testi.color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                  {testi.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testi.name}</h4>
                  <p className="text-sm text-slate-500 group-hover:text-slate-300">{testi.role}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}