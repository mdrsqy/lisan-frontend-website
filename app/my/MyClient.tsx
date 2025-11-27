"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { LayoutDashboard, Activity, Users, TrendingUp, AlertCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import GlobalLoader from "@/components/GlobalLoader";
import MenuBar from "@/components/MenuBar";

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] ${className}`}>
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    {children}
  </div>
);

export default function MyClient() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const displayUser =
    user ||
    JSON.parse(
      typeof window !== "undefined"
        ? localStorage.getItem("user") || "{}"
        : "{}"
    );

  const userName = displayUser.name || "Pengguna";
  const userRole: "admin" | "user" = displayUser.role === "admin" ? "admin" : "user";
  const userRoleLabel = userRole === "admin" ? "Administrator" : "Member Lisan";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser && !user) {
      toast.error("Sesi habis, silakan masuk kembali.");
      router.push("/sign-in");
    } else {
      setTimeout(() => setIsLoading(false), 1500);
    }
  }, [user, router]);

  const UserDashboardContent = () => (
    <div className="space-y-8">
      <GlassCard className="p-8 rounded-[2rem] relative overflow-hidden border-blue-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <BookOpen size={120} className="text-blue-400" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Halo, {userName}! 👋</h1>
          <p className="text-slate-400 max-w-xl text-lg">Siap melanjutkan pembelajaran hari ini? Ada modul baru bahasa isyarat yang menunggu untuk diselesaikan.</p>
          <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95">Lanjut Belajar</button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Jam Belajar", value: "12.5 Jam", color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Modul Selesai", value: "8/20", color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "XP Diperoleh", value: "2,450", color: "text-yellow-400", bg: "bg-yellow-500/10" },
        ].map((stat, idx) => (
          <GlassCard key={idx} className="p-6 rounded-3xl flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              <Activity size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 rounded-3xl h-64 flex flex-col items-center justify-center border-dashed border-white/10 group hover:border-blue-500/30 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Lihat Grafik Progress</p>
        </GlassCard>

        <GlassCard className="p-6 rounded-3xl h-64 flex flex-col items-center justify-center border-dashed border-white/10 group hover:border-blue-500/30 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">Komunitas Belajar</p>
        </GlassCard>
      </div>
    </div>
  );

  const AdminDashboardContent = () => (
    <div className="space-y-8">
      <GlassCard className="p-8 rounded-[2rem] relative overflow-hidden border-red-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 to-orange-900/10 opacity-50" />
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <LayoutDashboard size={120} className="text-red-400" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-4 border border-red-500/30">ADMINISTRATOR MODE</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Selamat Datang, Admin!</h1>
          <p className="text-slate-400 max-w-xl text-lg">Pantau kinerja sistem, kelola pengguna, dan tinjau laporan keamanan dari panel ini.</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Pengguna", value: "15,234", color: "text-blue-400", bg: "bg-blue-500/10", icon: Users },
          { label: "Pengguna Aktif", value: "1,042", color: "text-green-400", bg: "bg-green-500/10", icon: Activity },
          { label: "Laporan Baru", value: "24", color: "text-red-400", bg: "bg-red-500/10", icon: AlertCircle },
          { label: "Server Load", value: "34%", color: "text-orange-400", bg: "bg-orange-500/10", icon: LayoutDashboard },
        ].map((stat, idx) => (
          <GlassCard key={idx} className="p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">+12%</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6 rounded-3xl min-h-[300px]">
          <h3 className="text-lg font-bold text-white mb-6">Aktivitas Sistem Terkini</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Backup Database Berhasil</p>
                  <p className="text-xs text-slate-500">System • 2 jam yang lalu</p>
                </div>
                <button className="text-xs text-blue-400 hover:text-white">Detail</button>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 rounded-3xl min-h-[300px] flex flex-col items-center justify-center text-center border-dashed border-white/10">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Users size={24} className="text-slate-400" />
          </div>
          <h4 className="text-white font-bold mb-2">Manajemen User</h4>
          <p className="text-slate-500 text-sm mb-6">Kelola akses dan data pengguna Lisan AI.</p>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors">Buka Panel User</button>
        </GlassCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-100 flex flex-col md:flex-row overflow-hidden">
      <AnimatePresence>
        {isLoading && <GlobalLoader />}
      </AnimatePresence>

      <MenuBar role={userRole} userName={userName} userRoleLabel={userRoleLabel} />

      <main className="flex-1 relative z-10 h-screen overflow-y-auto flex flex-col pt-16 md:pt-0">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 15, repeat: Infinity, delay: 2 }} className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10">
          {userRole === "admin" ? <AdminDashboardContent /> : <UserDashboardContent />}
        </div>
      </main>
    </div>
  );
}