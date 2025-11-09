'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Twitter, Instagram, Facebook, Globe } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const fullText = "Selamat Datang di Lisan";
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const typingSpeed = deleting ? 60 : 120;
    const delay = deleting && index === 0 ? 1000 : typingSpeed;

    const timeout = setTimeout(() => {
      if (!deleting && index < fullText.length) {
        setText(fullText.slice(0, index + 1));
        setIndex(index + 1);
      } else if (!deleting && index === fullText.length) {
        setTimeout(() => setDeleting(true), 2000);
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

  return (
    <div className="relative flex flex-col min-h-screen bg-[oklch(0.145_0_0)] text-[oklch(0.985_0_0)] overflow-hidden">
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-45 py-6 bg-[oklch(0.145_0_0)/0.85] backdrop-blur-xl shadow-[0_0_25px_oklch(0.922_0_0)/0.15]">
        <div className="flex items-center space-x-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[oklch(0.922_0_0)] to-pink-500 flex items-center justify-center text-[oklch(0.205_0_0)] font-bold text-lg shadow-md shadow-[oklch(0.922_0_0)/0.4]">
            H
          </div>
          <span className="text-lg font-semibold hover:text-[oklch(0.922_0_0)] transition-colors cursor-default">
            Lisan
          </span>
        </div>

        <nav className="flex items-center space-x-12">
          <span
            onClick={handleSignInClick}
            className="text-[oklch(0.922_0_0)/0.8] hover:text-[oklch(0.985_0_0)] cursor-pointer transition-all duration-300"
          >
            Masuk
          </span>
          <span
            onClick={handleSignUpClick}
            className="text-[oklch(0.985_0_0)] font-medium relative cursor-pointer hover:before:scale-x-100 before:content-[''] before:absolute before:bottom-[-4px] before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-[oklch(0.922_0_0)] before:to-pink-500 before:scale-x-0 before:origin-left before:transition-transform before:duration-300"
          >
            Daftar
          </span>
        </nav>
      </header>

      {/* MAIN / ISI */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 relative z-10 shadow-[0_0_40px_oklch(0.985_0_0)/0.05] bg-[oklch(0.145_0_0)]/80 backdrop-blur-sm">
        <div className="p-10 rounded-2xl bg-[oklch(0.205_0_0)/0.05] shadow-[0_0_50px_oklch(0.922_0_0)/0.15]">
          <h1 className="text-4xl md:text-5xl font-light mb-4 whitespace-pre">
            {text.includes("Lisan") ? (
              <>
                {text.split("Lisan")[0]}
                <span className="font-semibold bg-gradient-to-r from-[oklch(0.922_0_0)] to-pink-400 bg-clip-text text-transparent">
                  Lisan
                </span>
                {text.split("Lisan")[1]}
              </>
            ) : (
              text
            )}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="text-[oklch(0.922_0_0)/0.8] max-w-xl mx-auto">
            Platform cerdas untuk berbagi ide, membangun koneksi, dan menjelajahi inspirasi digital bersama komunitas kreatif.
          </p>

          <div className="mt-8 flex space-x-8 justify-center">
            <div
              onClick={handleSignUpClick}
              className="px-8 py-3 bg-gradient-to-r from-[oklch(0.922_0_0)] to-pink-500 rounded-xl text-[oklch(0.205_0_0)] font-medium cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_oklch(0.922_0_0)/0.5] transition-all duration-300"
            >
              Mulai Sekarang
            </div>
            <div
              onClick={handleSignInClick}
              className="px-8 py-3 rounded-xl bg-[oklch(0.205_0_0)/0.1] text-[oklch(0.922_0_0)] cursor-pointer hover:bg-[oklch(0.205_0_0)/0.2] hover:text-[oklch(0.985_0_0)] shadow-[0_0_15px_oklch(0.205_0_0)/0.4] transition-all duration-300"
            >
              Sudah Punya Akun?
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-45 py-8 text-sm bg-[oklch(0.145_0_0)/0.85] backdrop-blur-xl shadow-[0_-0_25px_oklch(0.922_0_0)/0.15] relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[oklch(0.922_0_0)] to-pink-500 flex items-center justify-center text-[oklch(0.205_0_0)] font-bold text-lg">
                H
              </div>
              <span className="font-semibold">Lisan</span>
            </div>
            <p className="text-[oklch(0.922_0_0)/0.7]">© 2025 Lisan.com — Semua hak dilindungi.</p>
            <div className="flex space-x-4 mt-2 text-[oklch(0.922_0_0)/0.8]">
              <Twitter className="w-5 h-5 cursor-pointer hover:text-[oklch(0.985_0_0)] transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-[oklch(0.985_0_0)] transition-colors" />
              <Facebook className="w-5 h-5 cursor-pointer hover:text-[oklch(0.985_0_0)] transition-colors" />
              <Globe className="w-5 h-5 cursor-pointer hover:text-[oklch(0.985_0_0)] transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-20">
            <div>
              <h3 className="font-semibold mb-3">Produk</h3>
              <ul className="space-y-2 text-[oklch(0.922_0_0)/0.8]">
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Fitur</li>
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Harga & Paket</li>
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Catatan Pembaruan</li>
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Metode Kami</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Perusahaan</h3>
              <ul className="space-y-2 text-[oklch(0.922_0_0)/0.8]">
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Tentang Kami</li>
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Keberagaman & Inklusi</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Sumber Daya</h3>
              <ul className="space-y-2 text-[oklch(0.922_0_0)/0.8]">
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Komunitas</li>
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Syarat Layanan</li>
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Laporkan Kerentanan</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legalitas</h3>
              <ul className="space-y-2 text-[oklch(0.922_0_0)/0.8]">
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Syarat & Ketentuan</li>
                <li className="hover:text-[oklch(0.985_0_0)] cursor-pointer">Kebijakan Privasi</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}