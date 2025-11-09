"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../lib/authStore";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Content Management", href: "/admin/content", icon: BookOpen },
];

export function Sidebar({ activeTab }: { activeTab: string }) {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <aside className="flex flex-col justify-between h-screen w-72 bg-[#0B0018]/90 backdrop-blur-md border-r border-purple-700/40 text-gray-100 rounded-tr-3xl rounded-br-3xl shadow-[0_0_40px_rgba(120,50,255,0.2)]">
        <div className="flex flex-col p-6 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500">
              LISAN Admin
            </h2>
            <div className="mt-1 text-xs text-purple-300/60 tracking-wider">
              Intelligent Dashboard
            </div>
          </motion.div>

          <nav className="flex flex-col space-y-2">
            {navigation.map((item, i) => {
              const isActive = activeTab === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-700 via-fuchsia-700 to-pink-700 text-white shadow-lg shadow-purple-800/40"
                        : "hover:bg-purple-900/30 text-gray-300 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive ? "text-pink-300" : "text-purple-300"
                      }`}
                    />
                    <span>{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative border-t border-purple-900/30 p-6 bg-gradient-to-t from-[#110028]/70 via-[#0D001E]/60 to-transparent">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <div className="absolute inset-0 blur-md bg-purple-600/30 rounded-full"></div>
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 flex items-center justify-center text-lg font-bold text-white border border-purple-700 shadow-md shadow-purple-800/40">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-purple-300">{user?.email || "admin@example.com"}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-700 via-fuchsia-700 to-pink-600 hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-500 font-medium text-white transition-all shadow-md shadow-purple-800/30"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-center mt-4 text-purple-400/70"
          >
            © 2025 LISAN Admin
          </motion.p>
        </div>
      </aside>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="bg-[#150028]/95 border border-purple-700/40 text-gray-100 rounded-2xl p-7 w-[90%] max-w-sm shadow-[0_0_40px_rgba(160,60,255,0.25)]"
            >
              <h3 className="text-lg font-semibold text-pink-400 mb-2">Konfirmasi Keluar</h3>
              <p className="text-sm text-gray-400 mb-6">
                Apakah kamu yakin ingin keluar dari akun admin ini?
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-xl bg-gray-700/40 hover:bg-gray-600/60 transition text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 via-fuchsia-700 to-pink-600 hover:from-purple-600 hover:to-pink-500 text-sm text-white"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/signin";
                  }}
                >
                  Keluar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}