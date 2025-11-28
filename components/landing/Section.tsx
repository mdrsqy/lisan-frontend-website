'use client'

import React from "react"

export const GlassCard = ({ children, className = "", hoverEffect = false }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
  <div className={`
    relative overflow-hidden
    bg-white/[0.03] backdrop-blur-md
    border border-white/[0.08]
    shadow-lg
    ${hoverEffect ? "hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 transition-all duration-300" : ""}
    ${className}
  `}>
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    {children}
  </div>
)

export const SectionTitle = ({ title, subtitle, emoji, align = "center" }: { title: string, subtitle: string, emoji?: string, align?: "center" | "left" }) => (
  <div className={`mb-16 relative z-10 ${align === "center" ? "text-center" : "text-left"}`}>
    
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 ${align === "center" ? "mx-auto" : ""}`}>
      {emoji && <span className="text-sm filter drop-shadow-md">{emoji}</span>}
      <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">{subtitle}</span>
    </div>

    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
      {title}
    </h2>
    
  </div>
)