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

  useEffect(() => {
    const typingSpeed = deleting ? 60 : 120;
    const delay = deleting && index === 0 ? 1500 : typingSpeed;

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

  const handleSignInClick = () => router.push("/authentication/signin");
  const handleSignUpClick = () => router.push("/authentication/signup");

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#f5f7fa] text-black overflow-hidden">

      {/* NEW LIGHT THEME BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#f5f7fa] to-[#eef2f6]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(2,125,218,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(246,191,75,0.10),transparent_70%)]" />
      </div>

      {/* HEADER */}
      <header className="flex items-center justify-between px-50 py-6 bg-white/80 backdrop-blur-md border-b border-[#027dda]/20 z-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <img
            src="/lisan-logo.png"
            alt="Lisan Logo"
            className="w-10 h-10 object-contain drop-shadow-[0_0_10px_#027dda]"
          />
          <span className="text-lg font-semibold hover:text-[#027dda] transition">
            Lisan
          </span>
        </motion.div>

        <nav className="flex items-center space-x-8 text-sm font-medium">
          <span
            onClick={handleSignInClick}
            className="text-gray-700 hover:text-black cursor-pointer transition-all"
          >
            Masuk
          </span>

          <span
            onClick={handleSignUpClick}
            className="text-black relative 
              before:absolute before:bottom-[-3px] before:left-0 before:w-full before:h-[2px]
              before:bg-[#f6bf4b] before:scale-x-0 hover:before:scale-x-100
              before:transition-transform before:duration-300 cursor-pointer"
          >
            Daftar
          </span>
        </nav>
      </header>

      {/* HERO */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 relative z-10 py-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto p-10 rounded-2xl bg-white/90 backdrop-blur-xl shadow-lg border border-[#027dda]/10"
        >
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            {text.includes("Lisan") ? (
              <>
                {text.split("Lisan")[0]}
                <span className="font-semibold text-[#027dda] drop-shadow-[0_0_10px_#027dda]">Lisan</span>
                {text.split("Lisan")[1]}
              </>
            ) : text}
            <span className="animate-pulse text-[#027dda]">|</span>
          </h1>

          <p className="text-gray-700 mt-4 leading-relaxed">
            Lisan menghubungkan dunia melalui Bahasa Isyarat dengan kekuatan AI dengan menjadikan komunikasi dua arah lebih inklusif, emosional, dan natural.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-8 justify-center">
            <button
              onClick={handleSignUpClick}
              className="px-10 py-3 bg-[#027dda] text-white font-semibold rounded-xl shadow-[0_0_25px_#027dda]/40 hover:scale-105 transition-all"
            >
              Mulai Sekarang
            </button>

            <button
              onClick={handleSignInClick}
              className="px-10 py-3 bg-white border border-[#f6bf4b] rounded-xl text-black font-medium hover:bg-[#fff8e2] transition-all"
            >
              Sudah Punya Akun?
            </button>
          </div>
        </motion.div>
      </main>

      {/* FITUR UTAMA */}
      <section className="relative py-24 px-8 z-10 bg-white/70 backdrop-blur-sm border-t border-[#027dda]/10">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-semibold text-center mb-14">
          Fitur Utama <span className="text-[#027dda]">Lisan</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {[
            { icon: Brain, title: "AI Translation", desc: "Terjemahan dua arah real-time antara Bahasa Isyarat dan suara menggunakan AI multimodal.", color: "#027dda" },
            { icon: Heart, title: "Emotion Detection", desc: "Teknologi pengenal emosi menjaga ekspresi dan makna komunikasi tetap natural.", color: "#f6bf4b" },
            { icon: Gamepad2, title: "Gamified Learning", desc: "Belajar Bahasa Isyarat jadi menyenangkan dengan tantangan, level, dan AI coach interaktif.", color: "#c82131" },
            { icon: Accessibility, title: "Inklusif & Aksesibel", desc: "Desain ramah pengguna, mudah diakses oleh siapa pun.", color: "#027dda" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl bg-white border border-gray-200 shadow hover:shadow-xl transition-all"
            >
              <feature.icon className="w-10 h-10 mb-4" style={{ color: feature.color }} />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="relative py-24 px-8 bg-white border-t border-[#027dda]/10 z-10">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-semibold text-center mb-14">
          Apa Kata Pengguna Kami
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            { name: "Dewi", role: "Guru Sekolah Inklusi", text: "Lisan membantu saya berinteraksi dengan murid tunarungu dengan lebih percaya diri dan natural!" },
            { name: "Rafi", role: "Mahasiswa Tuli", text: "Aplikasinya keren banget! Saya bisa komunikasi dua arah tanpa hambatan, rasanya setara." },
            { name: "Andi", role: "Relawan Komunitas", text: "Belajar Bahasa Isyarat di Lisan seperti main game — seru, cepat paham, dan bikin nagih." },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-white rounded-2xl border border-[#f6bf4b]/30 shadow hover:shadow-xl transition-all"
            >
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

      {/* CTA */}
      <section className="relative py-28 px-6 text-center bg-gradient-to-b from-white to-[#f7f7f7] border-t border-[#027dda]/20 z-10">
        <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" className="text-4xl font-bold mb-6">
          Bergabunglah dalam <span className="text-[#c82131] drop-shadow-[0_0_10px_#c82131]">Gerakan Inklusi Digital</span>
        </motion.h2>

        <p className="text-gray-700 max-w-2xl mx-auto mb-10">
          Jadilah bagian dari komunitas yang menjembatani komunikasi dengan AI. Ciptakan dunia yang lebih terbuka untuk semua.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignUpClick}
          className="px-12 py-4 bg-[#c82131] text-white rounded-xl font-semibold shadow-[0_0_30px_#c82131]/40 hover:shadow-[0_0_40px_#c82131]/60 transition-all"
        >
          Mulai Sekarang Gratis
        </motion.button>
      </section>

      {/* FOOTER */}
      <footer className="px-50 py-10 bg-white/80 backdrop-blur-md border-t border-[#027dda]/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/lisan-logo.png"
                alt="Lisan Logo"
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_#027dda]"
              />
              <span className="font-semibold text-lg">Lisan</span>
            </div>

            <p className="text-gray-700 text-sm">
              © 2025 Lisan — Membangun komunikasi inklusif dengan AI.
            </p>

            <div className="flex space-x-4 text-gray-600">
              {[Twitter, Instagram, Facebook, Globe].map((Icon, i) => (
                <Icon
                  key={i}
                  className="w-5 h-5 cursor-pointer hover:text-[#f6bf4b] transition-all"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 text-sm">
            {[
              { title: "Produk", links: ["Fitur", "Harga & Paket", "Pembaruan", "Metode Kami"] },
              { title: "Perusahaan", links: ["Tentang Kami", "Keberagaman & Inklusi"] },
              { title: "Sumber Daya", links: ["Komunitas", "Syarat Layanan", "Laporkan Bug"] },
              { title: "Legalitas", links: ["Syarat & Ketentuan", "Kebijakan Privasi"] },
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="font-semibold mb-3">{section.title}</h3>
                <ul className="space-y-2 text-gray-700">
                  {section.links.map((link, i) => (
                    <li key={i} className="hover:text-[#027dda] cursor-pointer transition-colors">{link}</li>
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