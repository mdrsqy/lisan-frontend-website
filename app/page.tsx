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
    <div className="relative flex flex-col min-h-screen bg-[#000000] text-[#e7e9ea] overflow-hidden">
      <header className="flex items-center justify-between px-45 py-6 bg-[#000000]/85 backdrop-blur-xl shadow-[0_0_25px_#1c9cf0]/20">
        <div className="flex items-center space-x-6">
          <div className="w-10 h-10 rounded-full bg-[#1c9cf0] flex items-center justify-center text-[#ffffff] font-bold text-lg shadow-md shadow-[#1c9cf0]/40">
            H
          </div>
          <span className="text-lg font-semibold hover:text-[#1c9cf0] transition-colors cursor-default">
            Lisan
          </span>
        </div>

        <nav className="flex items-center space-x-12">
          <span
            onClick={handleSignInClick}
            className="text-[#e7e9ea]/80 hover:text-[#ffffff] cursor-pointer transition-all duration-300"
          >
            Masuk
          </span>
          <span
            onClick={handleSignUpClick}
            className="text-[#ffffff] font-medium relative cursor-pointer hover:before:scale-x-100 before:content-[''] before:absolute before:bottom-[-4px] before:left-0 before:w-full before:h-[2px] before:bg-[#1c9cf0] before:scale-x-0 before:origin-left before:transition-transform before:duration-300"
          >
            Daftar
          </span>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 relative z-10 shadow-[0_0_40px_#1c9cf0]/10 bg-[#000000]/80 backdrop-blur-sm">
        <div className="p-10 rounded-2xl bg-[#000000]/30 shadow-[0_0_50px_#1c9cf0]/20">
          <h1 className="text-4xl md:text-5xl font-light mb-4 whitespace-pre">
            {text.includes("Lisan") ? (
              <>
                {text.split("Lisan")[0]}
                <span className="font-semibold text-[#1c9cf0]">
                  Lisan
                </span>
                {text.split("Lisan")[1]}
              </>
            ) : (
              text
            )}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="text-[#e7e9ea]/80 max-w-xl mx-auto">
            Platform cerdas untuk berbagi ide, membangun koneksi, dan menjelajahi inspirasi digital bersama komunitas kreatif.
          </p>

          <div className="mt-8 flex space-x-8 justify-center">
            <div
              onClick={handleSignUpClick}
              className="px-8 py-3 bg-[#1c9cf0] rounded-xl text-[#ffffff] font-medium cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_#1c9cf0]/70 transition-all duration-300"
            >
              Mulai Sekarang
            </div>
            <div
              onClick={handleSignInClick}
              className="px-8 py-3 rounded-xl bg-[#e7e9ea]/10 text-[#e7e9ea] cursor-pointer hover:bg-[#e7e9ea]/20 hover:text-[#ffffff] shadow-[0_0_15px_#1c9cf0]/20 transition-all duration-300"
            >
              Sudah Punya Akun?
            </div>
          </div>
        </div>
      </main>

      <footer className="px-45 py-8 text-sm bg-[#000000]/85 backdrop-blur-xl shadow-[0_-0_25px_#1c9cf0]/20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#1c9cf0] flex items-center justify-center text-[#ffffff] font-bold text-lg">
                H
              </div>
              <span className="font-semibold">Lisan</span>
            </div>
            <p className="text-[#e7e9ea]/70">© 2025 Lisan.com — Semua hak dilindungi.</p>
            <div className="flex space-x-4 mt-2 text-[#e7e9ea]/80">
              <Twitter className="w-5 h-5 cursor-pointer hover:text-[#1c9cf0] transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-[#1c9cf0] transition-colors" />
              <Facebook className="w-5 h-5 cursor-pointer hover:text-[#1c9cf0] transition-colors" />
              <Globe className="w-5 h-5 cursor-pointer hover:text-[#1c9cf0] transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-20">
            <div>
              <h3 className="font-semibold mb-3">Produk</h3>
              <ul className="space-y-2 text-[#e7e9ea]/80">
                <li className="hover:text-[#1c9cf0] cursor-pointer">Fitur</li>
                <li className="hover:text-[#1c9cf0] cursor-pointer">Harga & Paket</li>
                <li className="hover:text-[#1c9cf0] cursor-pointer">Catatan Pembaruan</li>
                <li className="hover:text-[#1c9cf0] cursor-pointer">Metode Kami</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Perusahaan</h3>
              <ul className="space-y-2 text-[#e7e9ea]/80">
                <li className="hover:text-[#1c9cf0] cursor-pointer">Tentang Kami</li>
                <li className="hover:text-[#1c9cf0] cursor-pointer">Keberagaman & Inklusi</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Sumber Daya</h3>
              <ul className="space-y-2 text-[#e7e9ea]/80">
                <li className="hover:text-[#1c9cf0] cursor-pointer">Komunitas</li>
                <li className="hover:text-[#1c9cf0] cursor-pointer">Syarat Layanan</li>
                <li className="hover:text-[#1c9cf0] cursor-pointer">Laporkan Kerentanan</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legalitas</h3>
              <ul className="space-y-2 text-[#e7e9ea]/80">
                <li className="hover:text-[#1c9cf0] cursor-pointer">Syarat & Ketentuan</li>
                <li className="hover:text-[#1c9cf0] cursor-pointer">Kebijakan Privasi</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}