"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Trophy,
  Bell,
  BarChart2,
  Settings2,
  ShieldAlert,
  HelpCircle,
  LogOut,
  User,
  Settings,
  MoreHorizontal,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../lib/authStore";
import { motion, AnimatePresence } from "framer-motion";

// Interface diperbarui dengan colorClass untuk tema Rainbow
interface MenuItem {
  name: string;
  href: string;
  icon: any;
  colorClass: string; // Class warna background solid (misal: bg-blue-500)
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
    // Sinkronisasi user dari localStorage saat mount
    if (!user) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Gagal parsing user data", e);
        }
      }
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user, setUser]);

  // Handle klik di luar profile menu untuk menutupnya
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

  // Konfigurasi Menu dengan Warna-warni (Rainbow Theme)
  const menuGroups: MenuSection[] = [
    {
      items: [
        { name: "Dasbor", href: "/admin/dashboard", icon: LayoutDashboard, colorClass: "bg-sky-500" }
      ]
    },
    {
      title: "Pengelolaan",
      items: [
        { name: "Pengguna", href: "/admin/user-management", icon: Users, colorClass: "bg-blue-500" },
        { name: "Pengumuman", href: "/admin/announcement-management", icon: Megaphone, colorClass: "bg-emerald-500" },
        { name: "Pencapaian", href: "/admin/achievement-management", icon: Trophy, colorClass: "bg-amber-500" },
        { name: "Notifikasi", href: "/admin/notifications", icon: Bell, colorClass: "bg-rose-500" },
      ]
    },
    {
      title: "Laporan",
      items: [
        { name: "Laporan & Analitik", href: "/admin/analytics", icon: BarChart2, colorClass: "bg-violet-500" }
      ]
    },
    {
      title: "Sistem",
      items: [
        { name: "Pengaturan Sistem", href: "/admin/system-settings", icon: Settings2, colorClass: "bg-slate-500" }
      ]
    },
    {
      title: "Keamanan & Support",
      items: [
        { name: "Log Aktivitas", href: "/admin/activity-logs", icon: ShieldAlert, colorClass: "bg-orange-500" },
        { name: "FAQ & Masukkan", href: "/admin/support", icon: HelpCircle, colorClass: "bg-teal-500" }
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
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 top-0 h-screen w-80 z-50 flex flex-col justify-between border-r border-white/60 bg-white/80 backdrop-blur-[40px] shadow-[0_0_40px_-15px_rgba(0,0,0,0.05)]"
      >
        {/* Background Blobs (Soft Rainbow) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
            <div className="absolute -top-[10%] -left-[10%] w-[300px] h-[300px] bg-sky-200 rounded-full blur-[100px]" />
            <div className="absolute top-[40%] -right-[20%] w-[250px] h-[250px] bg-fuchsia-200 rounded-full blur-[100px]" />
            <div className="absolute -bottom-[10%] left-[20%] w-[300px] h-[300px] bg-violet-200 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header / Logo */}
          <div className="px-8 pt-8 pb-6 flex-shrink-0">
            <Link href="/admin/dashboard" className="group flex items-center gap-4">
              <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm" />
                {/* Ganti src logo sesuai asset Anda */}
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
                    Online
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Menu Items */}
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
                        <div className="relative group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden">
                          
                          {/* Active Background (Solid Color with Animation) */}
                          {isActive && (
                            <motion.div
                              layoutId="active-nav-pill"
                              className={`absolute inset-0 ${item.colorClass} shadow-md`}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}

                          {/* Icon Container */}
                          <div className={`relative z-10 p-1.5 rounded-lg transition-all duration-300 ${
                            isActive 
                              ? "bg-white/20 text-white" 
                              : `bg-white/50 text-slate-500 group-hover:bg-white/80 group-hover:text-slate-800 group-hover:shadow-sm`
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Text */}
                          <span className={`relative z-10 text-sm font-semibold transition-colors duration-200 ${
                            isActive ? "text-white tracking-wide" : "text-slate-600 group-hover:text-slate-900"
                          }`}>
                            {item.name}
                          </span>

                          {/* Chevron Arrow */}
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="relative z-10 ml-auto"
                            >
                              <ChevronRight className="w-4 h-4 text-white/90" />
                            </motion.div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
            <div className="h-24" /> {/* Spacer untuk bottom content */}
          </div>

          {/* Profile Section (Fixed Bottom) */}
          <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-white/95 via-white/80 to-transparent z-20 pointer-events-none flex flex-col justify-end h-32">
            <div ref={profileRef} className="relative pointer-events-auto">
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-xl ${
                  showProfileMenu 
                    ? "bg-white border-indigo-200 shadow-xl shadow-indigo-500/10 scale-[1.02]" 
                    : "bg-white/60 border-white/60 hover:bg-white/90 hover:border-white/80 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-400 to-purple-500">
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

                <motion.div animate={{ rotate: showProfileMenu ? 180 : 0 }}>
                  <MoreHorizontal className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </motion.div>
              </div>

              {/* Profile Popup Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: -12, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute bottom-full left-0 w-full bg-white/95 backdrop-blur-3xl border border-white/60 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-50 p-2"
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
      </motion.aside>

      {/* Logout Confirmation Modal */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
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