'use client'

import React from "react"
import { useRouter } from "next/navigation"
import { Download } from "lucide-react"

const GlassCard = ({ children, className = "", hoverEffect = false }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
  <div className={`
    relative overflow-hidden
    bg-white/[0.03] backdrop-blur-md
    border border-white/[0.08]
    shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]
    ${hoverEffect ? "hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer" : ""}
    transition-all duration-500 ease-out
    ${className}
  `}>
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    {children}
  </div>
)

export default function Navbar() {
  const router = useRouter()

  const handleAuthNavigation = (path: string) => {
    router.push(path)
  }

  const handleDownload = () => {
    window.open('https://play.google.com/store/apps', '_blank');
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="fixed w-full z-50 px-4 py-4 md:px-8 transition-all duration-300 bottom-0 md:top-0 md:bottom-auto">
      <GlassCard className="max-w-7xl mx-auto rounded-2xl md:rounded-full px-4 py-3 md:px-6 flex items-center justify-between !bg-black/20 supports-[backdrop-filter]:!backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/10">
        
        <div className="flex items-center gap-3 cursor-pointer group" onClick={scrollToTop}>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform active:scale-95 p-1.5 border border-white/10">
            <img src="/lisan.png" alt="Lisan Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden md:block">
            Lisan<span className="text-blue-400">.</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-m font-medium text-slate-300">
          {['Fitur', 'Manfaat', 'Cara Kerja', 'Harga'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors relative group py-2">
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full opacity-0 group-hover:opacity-100"></span>
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleAuthNavigation('/sign-in')}
            className="text-m font-medium hover:text-white px-5 py-2.5 transition-colors hover:bg-white/5 rounded-full active:scale-95"
          >
            Masuk
          </button>
          <button
            onClick={() => handleAuthNavigation('/sign-up')}
            className="px-6 py-2.5 bg-white text-slate-900 rounded-full text-m font-bold hover:bg-blue-50 hover:text-blue-900 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95 transform hover:-translate-y-0.5"
          >
            Daftar
          </button>
        </div>

        <div className="flex md:hidden w-full justify-between items-center pl-4">
          <div className="flex items-center gap-2" onClick={scrollToTop}>
            <span className="text-lg font-bold tracking-tight text-white">
              Lisan<span className="text-blue-400">.</span>
            </span>
          </div>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 active:scale-95 hover:bg-blue-500 transition-all">
            <Download className="w-3.5 h-3.5" />
            Unduh
          </button>
        </div>

      </GlassCard>
    </nav>
  )
}