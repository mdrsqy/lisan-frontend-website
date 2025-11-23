'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Twitter, Instagram, Facebook, Globe, Brain, Heart, Gamepad2, Accessibility } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const fullText = "Selamat Datang di Lisan";
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const mobile =
      /android|iphone|ipad|ipod|windows phone|mobile/i.test(ua);
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    const speed = deleting ? 60 : 120;
    const delay = deleting && index === 0 ? 1500 : speed;
    const timeout = setTimeout(() => {
      if (!deleting && index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        setIndex(index + 1);
      } else if (!deleting && index === fullText.length) {
        setTimeout(() => setDeleting(true), 2500);
      } else if (deleting && index > 0) {
        setText(fullText.slice(0, index - 1));
        setIndex(index - 1);
      } else if (deleting && index === 0) {
        setDeleting(false);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [index, deleting]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const goLogin = () => router.push("/authentication/signin");
  const goSignup = () => router.push("/authentication/signup");

  const downloadApp = () => {
    if (/android/i.test(navigator.userAgent)) {
      window.location.href = "https://play.google.com";
    } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      window.location.href = "https://apps.apple.com";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#f5f7fa] text-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#f5f7fa] to-[#eef2f6]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(2,125,218,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(246,191,75,0.10),transparent_70%)]" />
      </div>

      <header className="flex items-center justify-between px-6 md:px-20 py-5 bg-white/80 backdrop-blur-md border-b border-[#027dda]/20 z-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-3 cursor-pointer select-none">
          <img src="/lisan-logo.png" alt="Lisan Logo" className="w-10 h-10 drop-shadow-[0_0_10px_#027dda]" />
          <span className="text-lg font-semibold">Lisan</span>
        </motion.div>

        {!isMobile ? (
          <nav className="flex items-center space-x-8 text-sm font-medium">
            <span onClick={goLogin} className="text-gray-700 hover:text-black cursor-pointer">Masuk</span>
            <span onClick={goSignup} className="text-black relative before:absolute before:bottom-[-3px] before:left-0 before:w-full before:h-[2px] before:bg-[#f6bf4b] before:scale-x-0 hover:before:scale-x-100 before:transition-transform cursor-pointer">
              Daftar
            </span>
          </nav>
        ) : (
          <button
            onClick={downloadApp}
            className="px-5 py-2 bg-[#027dda] text-white rounded-xl shadow hover:scale-105 transition"
          >
            Download App
          </button>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 relative z-10 py-24 md:py-28">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-3xl mx-auto p-6 md:p-10 rounded-2xl bg-white/90 backdrop-blur-xl shadow-lg border border-[#027dda]/10">
          <h1 className="text-3xl md:text-5xl font-light mb-4 leading-snug">
            {text.includes("Lisan") ? (
              <>
                {text.split("Lisan")[0]}
                <span className="font-semibold text-[#027dda] drop-shadow-[0_0_10px_#027dda]">Lisan</span>
                {text.split("Lisan")[1]}
              </>
            ) : text}
            <span className="animate-pulse text-[#027dda]">|</span>
          </h1>

          <p className="text-gray-700 mt-4 text-sm md:text-base leading-relaxed">
            Lisan menghubungkan dunia melalui Bahasa Isyarat dengan kekuatan AI agar komunikasi dua arah menjadi lebih inklusif & natural.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-8 justify-center">
            {!isMobile ? (
              <>
                <button onClick={goSignup} className="px-10 py-3 bg-[#027dda] text-white rounded-xl shadow hover:scale-105 transition">Mulai Sekarang</button>
                <button onClick={goLogin} className="px-10 py-3 bg-white border border-[#f6bf4b] rounded-xl hover:bg-[#fff8e2] transition">Sudah Punya Akun?</button>
              </>
            ) : (
              <button onClick={downloadApp} className="px-10 py-3 bg-[#027dda] text-white rounded-xl shadow hover:scale-105 transition">
                Download Aplikasi
              </button>
            )}
          </div>
        </motion.div>
      </main>

      <section className="relative py-20 md:py-24 px-6 z-10 bg-white/70 backdrop-blur-sm border-t border-[#027dda]/10">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-semibold text-center mb-12">
          Fitur Utama <span className="text-[#027dda]">Lisan</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Brain, title: "AI Translation", desc: "Terjemahan real-time bahasa isyarat ↔ suara.", color: "#027dda" },
            { icon: Heart, title: "Emotion Detection", desc: "Ekspresi tetap natural dengan AI emosi.", color: "#f6bf4b" },
            { icon: Gamepad2, title: "Gamified Learning", desc: "Belajar isyarat seperti bermain game.", color: "#c82131" },
            { icon: Accessibility, title: "Aksesibel", desc: "Untuk semua kalangan tanpa hambatan.", color: "#027dda" },
          ].map((f, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }} className="p-8 rounded-2xl bg-white border shadow hover:shadow-xl transition">
              <f.icon className="w-10 h-10 mb-4" style={{ color: f.color }} />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-700 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-20 md:py-24 px-6 bg-white border-t border-[#027dda]/10 z-10">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-semibold text-center mb-12">
          Apa Kata Pengguna Kami
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Dewi", role: "Guru Inklusi", text: "Lisan membantu interaksi dengan murid tunarungu lebih percaya diri!" },
            { name: "Rafi", role: "Mahasiswa Tuli", text: "Komunikasi dua arah jadi setara dan lancar." },
            { name: "Andi", role: "Relawan", text: "Belajar Bahasa Isyarat jadi jauh lebih menyenangkan." },
          ].map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="p-8 bg-white rounded-2xl border border-[#f6bf4b]/30 shadow hover:shadow-xl transition">
              <p className="text-gray-700 italic mb-4">“{t.text}”</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#f6bf4b]/20 border border-[#f6bf4b]/50" />
                <div>
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-sm text-gray-600">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative py-20 md:py-28 px-6 text-center bg-gradient-to-b from-white to-[#f7f7f7] border-t border-[#027dda]/20 z-10">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" className="text-3xl md:text-4xl font-bold mb-6">
          Bergabunglah dalam <span className="text-[#c82131]">Gerakan Inklusi Digital</span>
        </motion.h2>

        <p className="text-gray-700 max-w-2xl mx-auto mb-10">
          Jadilah bagian dari komunitas yang membangun komunikasi tanpa hambatan.
        </p>

        {!isMobile ? (
          <motion.button whileHover={{ scale: 1.05 }} onClick={goSignup} className="px-12 py-4 bg-[#c82131] text-white rounded-xl shadow hover:shadow-xl transition">
            Mulai Sekarang
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale: 1.05 }} onClick={downloadApp} className="px-12 py-4 bg-[#027dda] text-white rounded-xl shadow hover:shadow-xl transition">
            Download Aplikasi
          </motion.button>
        )}
      </section>

      <footer className="px-6 md:px-20 py-10 bg-white/80 backdrop-blur-md border-t border-[#027dda]/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/lisan-logo.png" alt="Lisan Logo" className="w-10 h-10 drop-shadow-[0_0_10px_#027dda]" />
              <span className="font-semibold text-lg">Lisan</span>
            </div>

            <p className="text-gray-700 text-sm">© 2025 Lisan — Membangun komunikasi inklusif dengan AI.</p>

            <div className="flex space-x-4 text-gray-600">
              {[Twitter, Instagram, Facebook, Globe].map((Icon, i) => (
                <Icon key={i} className="w-5 h-5 cursor-pointer hover:text-[#f6bf4b]" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 text-sm">
            {[
              { title: "Produk", links: ["Fitur", "Pembaruan", "Metode Kami"] },
              { title: "Perusahaan", links: ["Tentang Kami", "Inklusi"] },
              { title: "Sumber", links: ["Komunitas", "Laporkan Bug"] },
              { title: "Legal", links: ["Ketentuan", "Privasi"] },
            ].map((s, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-3">{s.title}</h3>
                <ul className="space-y-2 text-gray-700">
                  {s.links.map((l, idx) => (
                    <li key={idx} className="hover:text-[#027dda] cursor-pointer">{l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}