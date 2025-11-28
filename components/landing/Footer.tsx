import React from "react"
import Link from "next/link"
import { Twitter, Instagram, Facebook, Globe } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050810] pt-20 pb-32 md:pb-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shadow-lg shadow-blue-500/20 p-1.5 border border-white/10">
              <img src="/lisan.png" alt="Lisan Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-white">Lisan<span className="text-blue-500">.</span></span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Menghubungkan dunia tanpa batas suara. Platform komunikasi inklusif untuk masa depan yang setara bagi semua.
          </p>
          <div className="flex gap-4">
            {[Twitter, Instagram, Facebook, Globe].map((Icon, i) => (
              <Link key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 active:scale-95">
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>

        {[
          {
            h: "Produk", l: [
              { label: "Fitur Utama", href: "#fitur" },
              { label: "Investasi", href: "#investasi" },
              { label: "Untuk Sekolah", href: "/schools" },
              { label: "API Developer", href: "/api" }
            ]
          },
          {
            h: "Perusahaan", l: [
              { label: "Tentang Kami", href: "/about" },
              { label: "Karir", href: "/careers" },
              { label: "Blog", href: "/blog" },
              { label: "Kontak", href: "/contact" }
            ]
          },
          {
            h: "Legalitas", l: [
              { label: "Kebijakan Privasi", href: "/privacy" },
              { label: "Syarat Ketentuan", href: "/terms" },
              { label: "Lisensi", href: "/licenses" },
              { label: "Hak Cipta", href: "/copyright" }
            ]
          },
        ].map((col, i) => (
          <div key={i}>
            <h4 className="font-bold text-white mb-6 tracking-wide text-lg">{col.h}</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              {col.l.map((link, j) => (
                <li key={j}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors block hover:translate-x-1 duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-medium">
        <p>© 2025 Lisan AI. All rights reserved.</p>
      </div>
    </footer>
  )
}