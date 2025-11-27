'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import {
  Brain,
  Heart,
  Gamepad2,
  Users,
  ArrowRight,
  Download,
  Zap,
  MessageCircle,
  ChevronDown,
  CheckCircle2,
  PlayCircle,
  ScanFace,
  Star,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  ShieldCheck,
  Smartphone,
  Apple
} from "lucide-react"

const GlassCard = ({ children, className = "", hoverEffect = false }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
  <div className={`
    relative overflow-hidden
    bg-white/[0.03] backdrop-blur-3xl
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

const StoreBadge = ({ type, onClick }: { type: 'apple' | 'google', onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="relative group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 w-full sm:w-auto justify-center sm:justify-start overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {type === 'apple' ? <Apple className="w-8 h-8 fill-white" /> : <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Play Store" className="w-7 h-7" />}
    <div className="flex flex-col items-start text-white relative z-10">
      <span className="text-[10px] font-medium opacity-60 uppercase tracking-wide leading-none mb-1">
        {type === 'apple' ? 'Download on the' : 'Get it on'}
      </span>
      <span className="text-lg font-bold leading-none tracking-tight">
        {type === 'apple' ? 'App Store' : 'Google Play'}
      </span>
    </div>
  </button>
)

const SectionTitle = ({ title, subtitle, emoji, align = "center" }: { title: string, subtitle: string, emoji?: string, align?: "center" | "left" }) => (
  <div className={`mb-16 relative z-10 ${align === "center" ? "text-center" : "text-left"}`}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 ${align === "center" ? "mx-auto" : ""}`}
    >
      {emoji && <span className="text-sm filter drop-shadow-md">{emoji}</span>}
      <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">{subtitle}</span>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight"
    >
      {title}
    </motion.h2>
  </div>
)

const signInMessages = ["Selamat datang kembali!"]
const signUpMessages = ["Selamat bergabung di Lisan!"]

export default function LandingPage() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState<string[]>(signInMessages)

  const handleAuthNavigation = (path: string, type: 'signin' | 'signup') => {
    if (type === 'signin') {
      setLoadingMessages(signInMessages)
    } else {
      setLoadingMessages(signUpMessages)
    }
    setIsLoading(true)
    setTimeout(() => {
      router.push(path)
    }, 100)
  }

  const handleDownload = () => {
    window.open('https://play.google.com/store/apps', '_blank');
  }

  return (
    <div className="relative min-h-screen bg-[#0A0F1C] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-100 overflow-x-hidden">
      <nav className="fixed w-full z-50 px-4 py-4 md:px-8 transition-all duration-300 bottom-0 md:top-0 md:bottom-auto">
        <GlassCard className="max-w-7xl mx-auto rounded-2xl md:rounded-full px-4 py-3 md:px-6 flex items-center justify-between !bg-black/20 supports-[backdrop-filter]:!backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform active:scale-95 p-1.5 border border-white/10">
              <img src="/lisan.png" alt="Lisan Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden md:block">Lisan<span className="text-blue-400">.</span></span>
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
              onClick={() => handleAuthNavigation('/sign-in', 'signin')}
              className="text-m font-medium hover:text-white px-5 py-2.5 transition-colors hover:bg-white/5 rounded-full active:scale-95"
            >
              Masuk
            </button>
            <button
              onClick={() => handleAuthNavigation('/sign-up', 'signup')}
              className="px-6 py-2.5 bg-white text-slate-900 rounded-full text-m font-bold hover:bg-blue-50 hover:text-blue-900 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95 transform hover:-translate-y-0.5"
            >
              Daftar
            </button>
          </div>

          <div className="flex md:hidden w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">Lisan<span className="text-blue-400">.</span></span>
            </div>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 active:scale-95 hover:bg-blue-500 transition-all">
              <Download className="w-3.5 h-3.5" />
              Unduh
            </button>
          </div>
        </GlassCard>
      </nav>

      <section className="relative pt-10 md:pt-48 pb-32 px-6 overflow-hidden min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[800px] md:h-[800px] opacity-20 mix-blend-screen pointer-events-none">
            <DotLottieReact
              src="https://lottie.host/080ff921-d637-4702-8e0f-c9bced5af943/Fw7oXCfoGa.lottie"
              loop
              autoplay
            />
          </div>
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 mb-8 backdrop-blur-xl hover:bg-white/10 transition-colors cursor-pointer hover:border-blue-500/30 group">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Versi 2.0 Beta Kini Tersedia</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
              The Voice of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-gradient-x">Hands</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Menghadirkan jembatan komunikasi yang inklusif melalui kekuatan AI. Menerjemahkan bahasa isyarat secara <span className="text-white font-medium">real-time</span>, memahami <span className="text-white font-medium">konteks</span>, dan menangkap <span className="text-white font-medium">emosi</span>.
            </p>

            <div className="hidden md:flex flex-col sm:flex-row items-center justify-center gap-5 mb-16 sm:mb-0">
              <button
                onClick={() => handleAuthNavigation('/sign-up', 'signup')}
                className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-white shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Mulai Gratis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button className="w-full sm:w-auto px-8 py-4 bg-white/[0.05] border border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 group active:scale-95">
                <PlayCircle className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors group-hover:scale-110 duration-300" />
                Lihat Demo
              </button>
            </div>

            <div className="flex md:hidden flex-col gap-4 max-w-sm mx-auto mt-8">
              <div className="grid grid-cols-1 gap-3">
                <StoreBadge type="google" onClick={handleDownload} />
                <StoreBadge type="apple" onClick={() => {}} />
              </div>
            </div>

            <div className="mt-10 sm:mt-20 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto relative">
              {[
                { val: "98%", label: "Akurasi AI" },
                { val: "22Jt+", label: "Komunitas" },
                { val: "<0.5s", label: "Latensi" },
                { val: "2 Arah", label: "Komunikasi" }
              ].map((stat, i) => (
                <div key={i} className="hover:bg-white/5 p-4 rounded-2xl transition-colors cursor-default border border-transparent hover:border-white/5">
                  <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="hidden md:block">
        <section id="fitur" className="py-24 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="Inovasi Teknologi Inklusif." subtitle="FITUR UTAMA" emoji="⚡️" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
              <GlassCard className="md:col-span-2 md:row-span-2 p-6 md:p-10 rounded-[2.5rem] flex flex-col justify-between group" hoverEffect={true}>
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
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-600/20 transition-colors" />
              </GlassCard>

              <GlassCard className="p-6 md:p-8 rounded-[2.5rem] group" hoverEffect={true}>
                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 text-pink-400 border border-pink-500/20 group-hover:scale-110 transition-transform duration-300 group-hover:bg-pink-500 group-hover:text-white">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-pink-300 transition-colors">Deteksi Emosi & Ekspresi</h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200">
                  Komunikasi lebih dari sekadar kata. AI kami menangkap nuansa emosi agar avatar merepresentasikan perasaan Anda.
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

        <section id="manfaat" className="py-24 px-6 bg-gradient-to-b from-transparent to-black/20">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="Mengapa Memilih Lisan?" subtitle="KEUNGGULAN" emoji="💎" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Komunikasi Natural", desc: "Interaksi yang mengalir dan tidak kaku. Algoritma canggih kami memahami konteks kalimat dan intonasi bicara.", icon: MessageCircle },
                { title: "Aksesibilitas Tanpa Batas", desc: "Jembatan penghubung antara Teman Tuli dan Teman Dengar untuk berinteraksi di mana saja dan kapan saja.", icon: ShieldCheck },
                { title: "Fleksibilitas Belajar", desc: "Akses modul pembelajaran komprehensif kapan saja langsung dari smartphone Anda dengan antarmuka intuitif.", icon: Smartphone },
                { title: "Komunitas Inklusif", desc: "Bergabunglah dengan jaringan ribuan pengguna yang peduli pada kesetaraan, empati, dan inklusivitas.", icon: Globe },
                { title: "Umpan Balik Instan", desc: "AI Coach pribadi memberikan koreksi langsung jika gerakan isyarat Anda kurang tepat, mempercepat proses belajar.", icon: CheckCircle2 },
                { title: "Privasi Terjamin", desc: "Keamanan data adalah prioritas utama kami. Seluruh percakapan diproses dengan standar enkripsi tingkat tinggi.", icon: Zap },
              ].map((item, i) => (
                <GlassCard key={i} className="p-6 md:p-8 rounded-3xl group" hoverEffect={true}>
                  <item.icon className="w-10 h-10 text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:text-blue-300" />
                  <h3 className="text-lg font-bold mb-3 text-white group-hover:text-blue-200">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200">{item.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section id="cara-kerja" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title="Mulai dalam Hitungan Detik." subtitle="CARA KERJA" emoji="⚙️" />

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 border-t border-dashed border-slate-700" />

              {[
                { step: "01", title: "Input Media", desc: "Cukup nyalakan kamera untuk menangkap bahasa isyarat, atau gunakan mikrofon untuk input suara Anda.", icon: Zap },
                { step: "02", title: "Pemrosesan AI", desc: "Engine cerdas kami mendeteksi 21 titik landmark tangan dan melakukan analisis ekspresi wajah secara real-time.", icon: Brain },
                { step: "03", title: "Hasil Instan", desc: "Terima terjemahan dalam bentuk teks, suara, atau animasi avatar yang akurat dan ekspresif seketika.", icon: MessageCircle },
              ].map((item, i) => (
                <GlassCard key={i} className="relative p-6 md:p-10 rounded-[2.5rem] text-center group" hoverEffect={true}>
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

        <section id="social-proof" className="py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="Dipercaya oleh Komunitas." subtitle="TESTIMONI" emoji="💙" />

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Andi Saputra", role: "Teman Tuli", text: "Sebuah terobosan! Sekarang saya bisa memesan kopi dan mengobrol santai dengan barista tanpa perlu menulis di kertas.", color: "bg-blue-500" },
                { name: "Siti Aminah", role: "Manajer HRD", text: "Lisan sangat membantu proses wawancara kerja untuk kandidat disabilitas. Komunikasi berjalan lancar dan profesional.", color: "bg-purple-500" },
                { name: "Budi Santoso", role: "Mahasiswa", text: "Belajar BISINDO jadi serasa main game. Fitur rank dan XP bikin saya termotivasi untuk latihan setiap hari.", color: "bg-cyan-500" }
              ].map((testi, i) => (
                <GlassCard key={i} className="p-6 md:p-8 rounded-3xl group" hoverEffect={true}>
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

        <section id="investasi" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <SectionTitle title="Investasi Cerdas untuk Masa Depan Inklusif." subtitle="INVESTASI" emoji="💳" />

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <GlassCard className="p-6 md:p-10 rounded-[2.5rem] opacity-90 hover:opacity-100 transition-all hover:scale-[1.02]">
                <h3 className="text-2xl font-bold mb-2 text-white">Akses Dasar</h3>
                <p className="text-slate-400 mb-6">Solusi tepat untuk pemula & penggunaan harian</p>
                <div className="text-4xl font-bold text-white mb-8">Rp 0</div>
                <ul className="space-y-4 mb-8 text-slate-300">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Penerjemah Teks/Suara Dasar</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Akses Modul Pembelajaran Awal</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Avatar Standar</li>
                </ul>
                <button
                  onClick={() => handleAuthNavigation('/sign-up', 'signup')}
                  className="w-full py-4 rounded-xl border border-white/20 font-bold hover:bg-white/10 hover:border-white/40 transition-all active:scale-95"
                >
                  Mulai Gratis
                </button>
              </GlassCard>

              <GlassCard className="p-6 md:p-10 rounded-[2.5rem] border-blue-500/30 bg-blue-500/5 relative overflow-hidden hover:border-blue-500/60 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:scale-[1.03] transition-all">
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
                <button
                  onClick={() => handleAuthNavigation('/sign-up', 'signup')}
                  className="w-full py-4 rounded-xl bg-blue-600 font-bold hover:bg-blue-500 hover:shadow-lg transition-all active:scale-95 shadow-blue-500/25"
                >
                  Berlangganan Sekarang
                </button>
              </GlassCard>
            </div>
          </div>
        </section>

        <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
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
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
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

        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen">
            <div className="absolute top-50 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px]">
              <DotLottieReact
                src="https://lottie.host/15a13e42-201c-4c0e-bff5-2d1743eb8db4/mh2ui6OOID.lottie"
                loop
                autoplay
              />
            </div>
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <GlassCard className="relative rounded-[3rem] p-8 md:p-24 text-center overflow-hidden border-blue-500/20 group hover:border-blue-500/40 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-4xl md:text-7xl font-bold mb-8 text-white">
                  Jadilah Bagian dari Revolusi Inklusi.
                </h2>

                <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                  Jangan biarkan perbedaan bahasa menjadi penghalang. Mulai langkah kecil Anda hari ini untuk Indonesia yang lebih setara.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                  <StoreBadge type="apple" onClick={() => {}} />
                  <StoreBadge type="google" onClick={() => {}} />
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

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
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 active:scale-95">
                    <Icon size={18} />
                  </a>
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
                      <a href={link.href} className="hover:text-blue-400 transition-colors block hover:translate-x-1 duration-200">
                        {link.label}
                      </a>
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
      </div>
    </div>
  )
}