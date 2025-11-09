'use client';

import React from "react";
import { useAuthStore } from "@/lib/authStore";
import { Sidebar } from "@/components/sidebar";
import { motion } from "framer-motion";
import { Users, BookOpen, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const bubbles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 40 + 20,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 25 + 15,
    opacity: Math.random() * 0.25 + 0.1,
  }));

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-[#070013] via-[#120028] to-[#260050] text-gray-100">
      {/* Bubble Background */}
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute bg-gradient-to-br from-purple-400/20 to-fuchsia-400/20 rounded-full blur-3xl"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: `-${b.size}px`,
            opacity: b.opacity,
          }}
          animate={{ y: ["0%", "-120vh"], opacity: [0, b.opacity, 0] }}
          transition={{
            repeat: Infinity,
            duration: b.duration,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <Sidebar activeTab="/admin/dashboard" />

      <main className="flex-1 p-10 relative z-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-400 to-pink-400 drop-shadow-lg">
            Halo, {user?.name || "Admin"} 👋
          </h1>
          <p className="text-purple-200/70 text-sm mt-1">
            Dashboard singkat & informatif
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <Card
            title="Pengguna"
            value="1,247"
            icon={<Users className="w-6 h-6 text-purple-400" />}
            border="border-purple-900/40"
            glow="shadow-[0_0_30px_rgba(150,80,255,0.25)]"
          />
          <Card
            title="Konten"
            value="87"
            icon={<BookOpen className="w-6 h-6 text-fuchsia-400" />}
            border="border-fuchsia-900/40"
            glow="shadow-[0_0_30px_rgba(220,90,255,0.25)]"
          />
          <Card
            title="Uptime"
            value="99.9%"
            icon={<TrendingUp className="w-6 h-6 text-pink-400" />}
            border="border-pink-900/40"
            glow="shadow-[0_0_30px_rgba(255,100,200,0.25)]"
          />
        </div>
      </main>
    </div>
  );
}

function Card({ title, value, icon, border, glow }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className={`bg-[#0C0020]/70 ${border} rounded-3xl p-6 backdrop-blur-xl ${glow} transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-purple-100">{title}</h3>
        {icon}
      </div>
      <p className="text-4xl font-bold text-white">{value}</p>
    </motion.div>
  );
}