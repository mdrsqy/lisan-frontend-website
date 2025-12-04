"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Gamepad2,
  BookOpen,
  Bell,
  ShieldAlert,
  HelpCircle,
  LogOut,
  User,
  Settings,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../lib/authStore";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  colorClass: string;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export function Sidebar({ activeTab }: { activeTab: string }) {
  const { user, setUser, signout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user, setUser]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!mounted) return null;

  const menuGroups: MenuSection[] = [
    {
      items: [
        { name: "Dasbor", href: "/admin/dashboard", icon: LayoutDashboard, colorClass: "bg-gradient-to-r from-sky-500 to-blue-500" }
      ]
    },
    {
      title: "Pengelolaan",
      items: [
        { name: "Pengguna", href: "/admin/user-management", icon: Users, colorClass: "bg-gradient-to-r from-blue-500 to-indigo-500" },
        { name: "Pengumuman", href: "/admin/announcement-management", icon: Megaphone, colorClass: "bg-gradient-to-r from-emerald-400 to-teal-500" },
        { name: "Modul Belajar", href: "/admin/learning-management", icon: BookOpen, colorClass: "bg-gradient-to-r from-pink-500 to-rose-500" },
        { name: "Gamifikasi", href: "/admin/gamification-management", icon: Gamepad2, colorClass: "bg-gradient-to-r from-amber-400 to-orange-500" },
      ]
    },
    {
      title: "Laporan & Sistem",
      items: [
        { name: "Pembayaran", href: "/admin/payment-management", icon: CreditCard, colorClass: "bg-gradient-to-r from-violet-500 to-purple-500" },
        { name: "Notifikasi", href: "/admin/notifications", icon: Bell, colorClass: "bg-gradient-to-r from-rose-500 to-red-500" },
      ]
    },
    {
      title: "Keamanan & Support",
      items: [
        { name: "Log Aktivitas", href: "/admin/activity-logs", icon: ShieldAlert, colorClass: "bg-gradient-to-r from-orange-500 to-red-500" },
        { name: "FAQ & Masukkan", href: "/admin/support-management", icon: HelpCircle, colorClass: "bg-gradient-to-r from-teal-400 to-cyan-500" }
      ]
    }
  ];

  const profileMenu = [
    { name: "Profil Saya", href: "/admin/profile", icon: User },
    { name: "Pengaturan Akun", href: "/admin/settings", icon: Settings },
    { name: "Keluar", icon: LogOut, action: () => setShowLogoutModal(true), isDanger: true },
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-80 z-50 flex flex-col justify-between border-r border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(0,0,0,0.1)]">
        
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
            <div className="absolute -top-[10%] -left-[20%] w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-[100px]" />
            <div className="absolute top-[30%] -right-[20%] w-[400px] h-[400px] bg-fuchsia-200/50 rounded-full blur-[100px]" />
            <div className="absolute -bottom-[10%] left-[10%] w-[400px] h-[400px] bg-cyan-200/50 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="px-8 pt-8 pb-6 flex-shrink-0">
            <Link href="/admin/dashboard" className="group flex items-center gap-4">
              <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm" />
                <img 
                  src="/lisan.png" 
                  alt="Lisan Logo" 
                  className="w-8 h-8 object-contain relative z-10 invert brightness-0 drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight group-hover:from-indigo-600 group-hover:to-pink-600 transition-all duration-300">
                  Lisan Admin
                </h1>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    System Online
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex-1 px-5 py-2 overflow-y-auto custom-scrollbar space-y-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.title && (
                  <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 mt-4">
                    {groupIndex === 1 && <Sparkles className="w-3 h-3 text-indigo-400" />}
                    {group.title}
                  </p>
                )}
                <nav className="space-y-1.5">
                  {group.items.map((item) => {
                    const isActive = activeTab === item.href;
                    const Icon = item.icon;

                    return (
                      <Link key={item.name} href={item.href}>
                        <div 
                            className={`relative group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden ${
                                isActive 
                                ? `${item.colorClass} shadow-lg shadow-indigo-500/20` 
                                : "hover:bg-white hover:shadow-sm"
                            }`}
                        >
                          <div className={`relative z-10 p-1.5 rounded-lg transition-all duration-300 ${
                            isActive 
                              ? "bg-white/20 text-white" 
                              : `bg-white/50 text-slate-500 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm`
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <span className={`relative z-10 text-sm font-semibold transition-colors duration-200 ${
                            isActive ? "text-white tracking-wide" : "text-slate-600 group-hover:text-slate-900"
                          }`}>
                            {item.name}
                          </span>

                          {isActive && (
                            <div className="relative z-10 ml-auto">
                              <ChevronRight className="w-4 h-4 text-white/90" />
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
            <div className="h-24" />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-white/95 via-white/80 to-transparent z-20 pointer-events-none flex flex-col justify-end h-32">
            <div ref={profileRef} className="relative pointer-events-auto">
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-md ${
                  showProfileMenu 
                    ? "bg-white border-indigo-200 shadow-2xl shadow-indigo-500/20 scale-[1.02]" 
                    : "bg-white/60 border-white/50 hover:bg-white/90 hover:border-white/80 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-400 to-pink-500">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {user?.profile_picture ? (
                        <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600">
                          {user?.username?.[0]?.toUpperCase() || "A"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full ring-2 ring-emerald-500/20"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-[10px] font-medium text-slate-500 truncate group-hover:text-slate-600">
                    {user?.email || "admin@lisan.app"}
                  </p>
                </div>

                <div className={`transition-transform duration-300 ${showProfileMenu ? "rotate-180" : ""}`}>
                  <MoreHorizontal className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -12, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-0 w-full bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden z-50 p-2 ring-1 ring-black/5"
                  >
                    <div className="space-y-1">
                      {profileMenu.map((item) => (
                        item.action ? (
                          <button
                            key={item.name}
                            onClick={item.action}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group
                              ${item.isDanger 
                                ? "text-rose-500 hover:bg-rose-50 hover:text-rose-600" 
                                : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                              }`}
                          >
                            <div className={`p-1.5 rounded-lg ${item.isDanger ? "bg-rose-100/50" : "bg-slate-100/50 group-hover:bg-white"}`}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            {item.name}
                          </button>
                        ) : (
                          <Link key={item.name} href={item.href}>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 group">
                              <div className="p-1.5 rounded-lg bg-slate-100/50 group-hover:bg-white transition-colors">
                                <item.icon className="w-4 h-4" />
                              </div>
                              {item.name}
                            </div>
                          </Link>
                        )
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm bg-white/90 border border-white/60 rounded-[32px] p-8 shadow-2xl overflow-hidden backdrop-blur-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 via-orange-400 to-rose-400"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-rose-50 border-4 border-white flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10">
                  <LogOut className="w-8 h-8 text-rose-500 ml-1" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Keluar Akun?</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 px-4 font-medium">
                  Sesi anda akan diakhiri. Anda perlu login kembali untuk mengakses dashboard.
                </p>

                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold bg-white hover:bg-slate-50 transition-all duration-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      signout();
                      window.location.href = "/sign-in";
                    }}
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                  >
                    Ya, Keluar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}