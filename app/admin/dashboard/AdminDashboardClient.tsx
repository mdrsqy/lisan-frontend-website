"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { 
  Users, 
  Megaphone, 
  Calendar,
  ShieldCheck,
  UserX,
  ArrowRight,
  UserCog,
  LayoutDashboard,
  Pin,
  Loader2,
  Clock
} from "lucide-react";

import { useUsersStore } from "../../../lib/usersStore";
import { useAnnouncementStore } from "../../../lib/announcementStore";

export default function AdminMyClient() {
  const { 
    stats: userStats, 
    fetchStats: fetchUserStats 
  } = useUsersStore();

  const { 
    stats: announcementStats, 
    fetchStats: fetchAnnouncementStats 
  } = useAnnouncementStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchUserStats(),
          fetchAnnouncementStats()
        ]);
        await new Promise(resolve => setTimeout(resolve, 800)); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalUsers = (userStats?.users || 0) + (userStats?.admins || 0);

  const userCards = [
    { 
      title: "Total Pengguna", 
      value: totalUsers.toLocaleString("id-ID"), 
      detail: "Terdaftar",
      icon: Users,
      bgColor: "bg-sky-500",
      textColor: "text-sky-600",
      borderColor: "border-sky-200",
      shadow: "shadow-sky-500/20",
      badgeBg: "bg-sky-50 text-sky-700"
    },
    { 
      title: "Menunggu Verifikasi", 
      value: userStats?.unverified?.toString() || "0", 
      detail: "Perlu Tindakan", 
      icon: UserX,
      bgColor: "bg-rose-500",
      textColor: "text-rose-600",
      borderColor: "border-rose-200",
      shadow: "shadow-rose-500/20",
      badgeBg: "bg-rose-50 text-rose-700"
    },
    { 
      title: "User Premium", 
      value: userStats?.premium?.toString() || "0", 
      detail: "Berlangganan", 
      icon: ShieldCheck,
      bgColor: "bg-amber-500",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      shadow: "shadow-amber-500/20",
      badgeBg: "bg-amber-50 text-amber-700"
    },
    { 
      title: "Administrator", 
      value: userStats?.admins?.toString() || "0", 
      detail: "Staff", 
      icon: UserCog,
      bgColor: "bg-violet-500",
      textColor: "text-violet-600",
      borderColor: "border-violet-200",
      shadow: "shadow-violet-500/20",
      badgeBg: "bg-violet-50 text-violet-700"
    },
  ];

  const announcementCards = [
    { 
      title: "Pengumuman Aktif", 
      value: announcementStats?.active?.toString() || "0", 
      detail: "Tayang", 
      icon: Megaphone,
      bgColor: "bg-emerald-500",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      shadow: "shadow-emerald-500/20",
      badgeBg: "bg-emerald-50 text-emerald-700"
    },
    { 
      title: "Disematkan", 
      value: announcementStats?.pinned?.toString() || "0", 
      detail: "Prioritas", 
      icon: Pin,
      bgColor: "bg-pink-500",
      textColor: "text-pink-600",
      borderColor: "border-pink-200",
      shadow: "shadow-pink-500/20",
      badgeBg: "bg-pink-50 text-pink-700"
    },
  ];

  const currentDate = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('id-ID', dateOptions);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-sky-200/40 rounded-full mix-blend-multiply filter blur-[128px]"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 -right-20 w-[600px] h-[600px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[128px]"
        />
      </div>

      <Sidebar activeTab="/admin/dashboard" />

      <main className="ml-80 p-8 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-10">

          <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  Dasbor Utama
                </h1>
              </div>
              <p className="text-slate-500 font-medium pl-14 max-w-lg">
                Ringkasan aktivitas dan performa platform Lisan hari ini.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="group relative overflow-hidden rounded-2xl bg-white p-1 pr-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Hari ini
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 font-semibold text-sm">
                 <Clock className="w-4 h-4" />
                 <span>WIB</span>
              </div>
            </motion.div>
          </header>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                <Users className="w-6 h-6 text-sky-500" />
                Statistik Pengguna
              </h2>

              <Link href="/admin/user-management">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-200 shadow-sm text-sm font-semibold text-slate-600 hover:text-sky-600 transition-all"
                >
                  Kelola Data
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                </motion.button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`group relative p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border ${stat.borderColor} shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} opacity-[0.03] rounded-bl-[4rem] -mr-6 -mt-6 transition-transform group-hover:scale-125`}></div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                    <div className="flex justify-between items-start">
                      <div className={`p-3.5 rounded-2xl ${stat.bgColor} text-white shadow-lg ${stat.shadow} transform transition-transform duration-300 group-hover:rotate-6`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border border-black/5 ${stat.badgeBg}`}>
                        {stat.detail}
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 opacity-80 ${stat.textColor}`}>
                        {stat.title}
                      </h3>

                      {loading ? (
                        <div className="h-10 w-24 bg-slate-200/70 rounded-lg animate-pulse mt-1"></div>
                      ) : (
                        <p className="text-4xl font-black text-slate-800 tracking-tight">
                          {stat.value}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-emerald-500" />
                Statistik Pengumuman
              </h2>

              <Link href="/admin/announcement-management">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 shadow-sm text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-all"
                >
                  Kelola Data
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </motion.button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {announcementCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 0.4) * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`group relative p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border ${stat.borderColor} shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} opacity-[0.03] rounded-bl-[4rem] -mr-6 -mt-6 transition-transform group-hover:scale-125`}></div>

                  <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                    <div className="flex justify-between items-start">
                      <div className={`p-3.5 rounded-2xl ${stat.bgColor} text-white shadow-lg ${stat.shadow} transform transition-transform duration-300 group-hover:rotate-6`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border border-black/5 ${stat.badgeBg}`}>
                        {stat.detail}
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 opacity-80 ${stat.textColor}`}>
                        {stat.title}
                      </h3>

                      {loading ? (
                        <div className="h-10 w-24 bg-slate-200/70 rounded-lg animate-pulse mt-1"></div>
                      ) : (
                        <p className="text-4xl font-black text-slate-800 tracking-tight">
                          {stat.value}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="md:col-span-2 rounded-[2rem] bg-white/40 border-2 border-slate-200/60 border-dashed flex flex-col items-center justify-center p-6 text-slate-400 text-sm font-medium hover:bg-white/60 hover:border-slate-300 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-slate-200 transition-all">
                   <LayoutDashboard className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                </div>
                <span>Statistik lainnya akan tersedia segera.</span>
              </motion.div>
            </div>
          </section>

        </div>
      </main>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 bg-white/90 backdrop-blur-md border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full text-slate-600"
          >
            <div className="relative flex items-center justify-center">
               <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
               <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-md animate-pulse"></div>
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-800">Sinkronisasi Data...</span>
               <span className="text-[10px] font-medium text-slate-400">Mohon tunggu sebentar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}