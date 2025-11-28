'use client'

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { GlassCard, SectionTitle } from "@/components/landing/Section"

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section id="faq" className="relative z-40 mt-10 mb-10 px-6 max-w-3xl mx-auto">
      <SectionTitle title="Pertanyaan yang Sering Diajukan." subtitle="FAQ" emoji="🤔" />

      <div className="space-y-4">
        {[
          { q: "Bahasa isyarat apa saja yang didukung?", a: "Saat ini Lisan mendukung penuh BISINDO (Bahasa Isyarat Indonesia) dan SIBI. Kami terus mengembangkan dukungan untuk variasi bahasa isyarat regional lainnya." },
          { q: "Apakah aplikasi ini memerlukan koneksi internet?", a: "Ya, koneksi internet diperlukan untuk memastikan pemrosesan AI yang akurat, real-time, dan selalu terbarukan. Namun, kami sedang mengembangkan mode offline untuk kebutuhan dasar." },
          { q: "Bisakah Lisan digunakan untuk keperluan profesional?", a: "Tentu saja! Banyak pengguna kami memanfaatkan Lisan untuk wawancara kerja, rapat, dan komunikasi layanan pelanggan di berbagai industri." },
          { q: "Apakah tersedia di iOS dan Android?", a: "Ya, Lisan dapat diunduh dan digunakan secara gratis di kedua platform mobile utama tersebut." }
        ].map((faq, i) => (
          <GlassCard key={i} className="rounded-2xl overflow-hidden hover:bg-white/[0.05]">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors group"
            >
              <span className="font-bold text-slate-200 group-hover:text-white transition-colors">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 group-hover:text-white ${openFaq === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 md:p-6 pt-0 text-slate-400 text-sm leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}