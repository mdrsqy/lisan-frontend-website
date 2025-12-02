"use client";

import React from "react";
import { Sidebar } from "../../../components/Sidebar";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  Megaphone, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  MoreHorizontal,
  Clock,
  Calendar,
  ChevronRight
} from "lucide-react";

// --- Mock Data ---
const stats = [
  { 
    title: "Total Pengguna", 
    value: "1,234", 
    change: "+12%", 
    isPositive: true, 
    icon: Users,
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    bgGlow: "bg-blue-500/20"
  },
  { 
    title: "Modul Pembelajaran", 
    value: "42", 
    change: "+4 Baru", 
    isPositive: true, 
    icon: BookOpen,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bgGlow: "bg-emerald-500/20"
  },
  { 
    title: "Pengumuman Aktif", 
    value: "8", 
    change: "Update", 
    isPositive: true, 
    icon: Megaphone,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    bgGlow: "bg-orange-500/20"
  },
  { 
    title: "Traffic Harian", 
    value: "845", 
    change: "+18%", 
    isPositive: true, 
    icon: TrendingUp,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    bgGlow: "bg-pink-500/20"
  },
];

const recentActivities = [
  { user: "Budi Santoso", action: "Mendaftar akun baru", time: "2 menit lalu", avatar: "B", color: "bg-blue-500" },
  { user: "Siti Aminah", action: "Menyelesaikan Modul 1", time: "15 menit lalu", avatar: "S", color: "bg-emerald-500" },
  { user: "Admin System", action: "Memposting pengumuman", time: "1 jam lalu", avatar: "A", color: "bg-orange-500" },
  { user: "Rudi Hartono", action: "Login ke aplikasi", time: "2 jam lalu", avatar: "R", color: "bg-purple-500" },
  { user: "Lina Marpaung", action: "Mengunduh sertifikat", time: "3 jam lalu", avatar: "L", color: "bg-pink-500" },
];

export default function AdminMyClient() {
  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar Integration */}
      <Sidebar activeTab="/admin/dashboard" />

      {/* Main Content Area */}
      <main className="ml-80 p-8 min-h-screen relative overflow-hidden">
        
        {/* --- Advanced Background Effects --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           {/* Noise Texture */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
           
           {/* Ambient Glows */}
           <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
           <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-10">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/5">
             <div className="space-y-1">
               <h1 className="text-4xl font-bold text-white tracking-tight">
                 Dashboard
               </h1>
               <p className="text-slate-400 text-sm font-medium">
                 Ringkasan aktivitas dan performa platform Lisan hari ini.
               </p>
             </div>
             
             <div className="flex items-center gap-3">
               <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 text-sm text-slate-300">
                 <Calendar className="w-4 h-4 text-blue-400" />
                 <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
               </div>
             </div>
          </header>

          {/* Stats Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-[2rem] bg-[#0A0F1C]/40 backdrop-blur-xl border border-white/5 overflow-hidden transition-all duration-300 hover:bg-[#0A0F1C]/60 hover:border-white/10 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                {/* Inner Glow Effect */}
                <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${stat.bgGlow}`}></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-black/20 text-white transform group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${stat.isPositive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                      {stat.change}
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-slate-400 text-sm font-medium tracking-wide">{stat.title}</h3>
                    <p className="text-3xl font-bold text-white tracking-tight tabular-nums group-hover:text-blue-200 transition-colors">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart / Analytics Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 relative p-8 rounded-[2.5rem] bg-[#0A0F1C]/40 backdrop-blur-xl border border-white/5 flex flex-col min-h-[400px]"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    Statistik Aktivitas User
                  </h3>
                  <p className="text-slate-500 text-sm mt-1 ml-12">Data aktivitas pengguna dalam 7 hari terakhir</p>
                </div>
                
                <button className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              {/* Chart Visualization */}
              <div className="flex-1 w-full flex items-end justify-between gap-3 sm:gap-6 px-4 pb-2 relative">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                  <div className="w-full h-px bg-white border-dashed"></div>
                  <div className="w-full h-px bg-white border-dashed"></div>
                  <div className="w-full h-px bg-white border-dashed"></div>
                  <div className="w-full h-px bg-white border-dashed"></div>
                </div>

                {/* Bars */}
                {[45, 72, 58, 85, 63, 92, 78].map((h, i) => (
                  <div key={i} className="relative w-full h-full flex items-end group">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600/80 to-indigo-500/80 rounded-2xl relative overflow-hidden transition-all duration-500 group-hover:from-blue-500 group-hover:to-cyan-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-[#0A0F1C] text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                      {h}%
                    </div>
                  </div>
                ))}
              </div>
              
              {/* X-Axis Labels */}
              <div className="flex justify-between mt-4 text-xs font-medium text-slate-500 px-4">
                <span>Senin</span><span>Selasa</span><span>Rabu</span><span>Kamis</span><span>Jumat</span><span>Sabtu</span><span>Minggu</span>
              </div>
            </motion.div>

            {/* Recent Activity Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative p-8 rounded-[2.5rem] bg-[#0A0F1C]/40 backdrop-blur-xl border border-white/5 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Update Terbaru</h3>
                {/* <Link href="/admin/notifications" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Lihat Semua
                </Link> */}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                {recentActivities.map((activity, i) => (
                  <div 
                    key={i} 
                    className="group flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] border border-transparent hover:border-white/5"
                  >
                    <div className="relative mt-1">
                      <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
                        {activity.avatar}
                      </div>
                      {/* Connection Line */}
                      {i !== recentActivities.length - 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white/5 -z-10 group-hover:bg-white/10 transition-colors"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-blue-200 transition-colors">
                          {activity.user}
                        </p>
                        <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-4 rounded-2xl border border-white/5 bg-white/[0.02] text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white hover:border-white/10 transition-all flex items-center justify-center gap-2 group">
                Lihat Log Aktivitas
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}