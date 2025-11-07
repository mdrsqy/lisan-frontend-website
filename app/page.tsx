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

  // 🧠 Efek typewriter yang loop
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
    <div className="relative flex flex-col min-h-screen bg-[#070014] text-gray-300 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-45 py-6 border-b border-gray-800 backdrop-blur-md bg-[#070014]/80">
        <div className="flex items-center space-x-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-900/30">
            H
          </div>
          <span className="text-lg font-semibold text-gray-50 hover:text-white transition-colors cursor-default">
            Lisan
          </span>
        </div>

        <div className="flex items-center space-x-15">
          <button
            onClick={handleSignInClick}
            className="text-gray-400 hover:text-white transition-colors font-medium"
          >
            Masuk
          </button>
          <button
            onClick={handleSignUpClick}
            className="px-6 py-2 rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-white transition-all duration-300"
          >
            Daftar
          </button>
        </div>
      </header>

      {/* Isi Halaman */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 relative z-10">
        <h1 className="text-4xl md:text-5xl font-light text-gray-100 mb-4 whitespace-pre">
          {text.includes("Lisan") ? (
            <>
              {text.split("Lisan")[0]}
              <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Lisan
              </span>
              {text.split("Lisan")[1]}
            </>
          ) : (
            text
          )}
          <span className="animate-pulse">|</span>
        </h1>

        <p className="text-gray-400 max-w-xl">
          Platform cerdas untuk berbagi ide, membangun koneksi, dan menjelajahi inspirasi digital bersama komunitas kreatif.
        </p>

        <div className="mt-8 flex space-x-4">
          <button
            onClick={handleSignUpClick}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:scale-105 hover:shadow-lg hover:shadow-pink-900/30 transition-transform duration-300"
          >
            Mulai Sekarang
          </button>
          <button
            onClick={handleSignInClick}
            className="px-6 py-3 border border-gray-600 rounded-xl hover:border-white hover:text-white transition-all duration-300"
          >
            Sudah Punya Akun?
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-45 py-8 text-sm bg-[#070014]/80 backdrop-blur-md relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                H
              </div>
              <span className="text-gray-100 font-semibold">Lisan</span>
            </div>
            <p className="text-gray-500">© 2025 Lisan.com — Semua hak dilindungi.</p>
            <div className="flex space-x-4 mt-2 text-purple-400">
              <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Facebook className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Globe className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-20">
            <div>
              <h3 className="font-semibold text-gray-100 mb-3">Produk</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Fitur</li>
                <li className="hover:text-white cursor-pointer">Harga & Paket</li>
                <li className="hover:text-white cursor-pointer">Catatan Pembaruan</li>
                <li className="hover:text-white cursor-pointer">Metode Kami</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 mb-3">Perusahaan</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Tentang Kami</li>
                <li className="hover:text-white cursor-pointer">Keberagaman & Inklusi</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 mb-3">Sumber Daya</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Komunitas</li>
                <li className="hover:text-white cursor-pointer">Syarat Layanan</li>
                <li className="hover:text-white cursor-pointer">Laporkan Kerentanan</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 mb-3">Legalitas</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Syarat & Ketentuan</li>
                <li className="hover:text-white cursor-pointer">Kebijakan Privasi</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}