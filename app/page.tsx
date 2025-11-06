"use client";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070014] overflow-hidden overscroll-none text-gray-300">
      {/* Header */}
      <header className="flex items-center justify-between px-45 py-5 border-b border-gray-800">
        {/* Logo */}
        <div className="flex items-center space-x-7">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <span className="text-lg font-semibold text-gray-50 hover:text-white transition-colors cursor-default">
            Lisan
          </span>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-15">
          <button className="text-gray-400 hover:text-white transition-colors">
            Masuk
          </button>
          <button className="px-6 py-2 rounded-2xl border border-gray-600 text-gray-300 hover:text-white hover:border-white transition-colors">
            Daftar
          </button>
        </div>
      </header>

      {/* Isi halaman */}
      <main className="flex-grow flex items-center justify-center text-gray-400">
        <h1 className="text-3xl font-light">Selamat datang di Landing Page 🌙</h1>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-45 py-10 text-sm">
        <div className="flex flex-wrap justify-between gap-8">
          {/* Kiri */}
          <div className="flex flex-col space-y-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            <p className="text-gray-500">© Lisan.com – All rights reserved.</p>
            <div className="flex space-x-4 mt-2 text-purple-400">
              <span className="cursor-pointer hover:text-white">𝕏</span>
              <span className="cursor-pointer hover:text-white">DEV</span>
              <span className="cursor-pointer hover:text-white">GH</span>
            </div>
          </div>

          {/* Kanan */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-25">
            <div>
              <h3 className="font-semibold text-gray-100 mb-3">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Features</li>
                <li className="hover:text-white cursor-pointer">Integrations</li>
                <li className="hover:text-white cursor-pointer">Pricing & Plans</li>
                <li className="hover:text-white cursor-pointer">Changelog</li>
                <li className="hover:text-white cursor-pointer">Our method</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 mb-3">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">About us</li>
                <li className="hover:text-white cursor-pointer">Diversity & Inclusion</li>
                <li className="hover:text-white cursor-pointer">Blog</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Financial statements</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 mb-3">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Community</li>
                <li className="hover:text-white cursor-pointer">Terms of service</li>
                <li className="hover:text-white cursor-pointer">Report a vulnerability</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-100 mb-3">Legals</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Refund policy</li>
                <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
                <li className="hover:text-white cursor-pointer">Privacy policy</li>
                <li className="hover:text-white cursor-pointer">Brand Kit</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}