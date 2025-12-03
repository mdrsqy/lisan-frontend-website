"use client";

import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  BookOpen,
  Bell,
  Settings,
  MoreHorizontal,
  LogOut,
  User,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../lib/authStore";
import { motion, AnimatePresence } from "framer-motion";

// Interface MenuItem tanpa properti badge
interface MenuItem {
  name: string;
  href?: string;
  icon: any;
  action?: () => void;
  isDanger?: boolean;
}

export function Sidebar({ activeTab }: { activeTab: string }) {
  const { user, setUser, signout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Logika sinkronisasi user dipertahankan
    if (!user) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user, setUser]);

  // Handle click outside
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

  const mainMenu: MenuItem[] = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users Management", href: "/admin/user-management", icon: Users },
    { name: "Announcements", href: "/admin/announcement-management", icon: Megaphone },
    { name: "Learning Modules", href: "/admin/module-managements", icon: BookOpen },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
  ];

  const profileMenu: MenuItem[] = [
    { name: "My Profile", href: "/admin/profile", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Log Out", icon: LogOut, action: () => setShowLogoutModal(true), isDanger: true },
  ];

  return (
    <>
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        // Glassmorphism yang lebih kuat
        className="fixed left-0 top-0 h-screen w-80 z-40 flex flex-col justify-between border-r border-white/10 bg-[#050b14]/50 backdrop-blur-[35px] shadow-[10px_0_50px_-10px_rgba(0,0,0,0.6)]"
      >
        {/* Efek noise dan blob dipertahankan untuk kedalaman */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay"></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="px-6 pt-10 pb-8">
            <Link href="/admin/dashboard" className="group flex items-center gap-4">
              <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.5)] transition-all duration-300 group-hover:scale-105 border border-white/15 backdrop-blur-sm overflow-hidden p-2">
                <img 
                  src="/lisan.png" 
                  alt="Lisan Logo" 
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-wider group-hover:to-white transition-all duration-300">
                  Lisan Admin
                </h1>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse"></div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold group-hover:text-slate-400 transition-colors">
                    Control Panel
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Main Menu */}
          <div className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar space-y-8">
            <div>
              <p className="px-4 text-xs font-bold text-slate-500/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-blue-400/50" />
                Menu Utama
              </p>
              <nav className="space-y-1.5">
                {mainMenu.map((item) => {
                  const isActive = activeTab === item.href;
                  const Icon = item.icon;

                  return (
                    <Link key={item.name} href={item.href || "#"}>
                      <div className="group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300">
                        {isActive && (
                          <motion.div
                            layoutId="active-nav-bg"
                            // Efek aktif lebih glass
                            className="absolute inset-0 bg-blue-700/15 border border-blue-500/20 rounded-xl shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          />
                        )}

                        <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${isActive ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30" : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"}`}>
                          <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-current"}`} />
                        </div>

                        <span className={`relative z-10 text-sm font-medium transition-colors duration-200 ${isActive ? "text-white font-semibold tracking-wide" : "text-slate-400 group-hover:text-white"}`}>
                          {item.name}
                        </span>

                        {/* Chevron Indicator hanya untuk tab aktif */}
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ml-auto"
                          >
                            <ChevronRight className="w-4 h-4 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
                          </motion.div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-4 bg-gradient-to-t from-[#050b14]/80 to-transparent">
            <div ref={profileRef} className="relative">
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 border backdrop-blur-xl ${
                  showProfileMenu 
                    ? "bg-white/10 border-white/20 shadow-xl shadow-black/30" 
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                    <div className="w-full h-full rounded-full bg-[#0A0F1C] flex items-center justify-center overflow-hidden relative">
                      {user?.profile_picture ? (
                        <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-white bg-gradient-to-br from-slate-700 to-slate-900 w-full h-full flex items-center justify-center">
                          {user?.username?.[0]?.toUpperCase() || "A"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0A0F1C] rounded-full"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate group-hover:text-slate-300 transition-colors">
                    {user?.email || "admin@lisan.app"}
                  </p>
                </div>

                <motion.div animate={{ rotate: showProfileMenu ? 180 : 0 }}>
                  <MoreHorizontal className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
                </motion.div>
              </div>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: -12, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    // Menu Profile lebih glass
                    className="absolute bottom-full left-0 w-full bg-[#0f1623]/80 backdrop-blur-[40px] border border-white/15 rounded-2xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-1.5"
                  >
                    <div className="space-y-1">
                      {profileMenu.map((item) => (
                        item.action ? (
                          <button
                            key={item.name}
                            onClick={item.action}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                              ${item.isDanger 
                                ? "text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]" 
                                : "text-slate-300 hover:bg-white/10 hover:text-white"
                              }`}
                          >
                            <item.icon className={`w-4 h-4 ${item.isDanger ? "group-hover:animate-pulse" : ""}`} />
                            {item.name}
                          </button>
                        ) : (
                          <Link key={item.name} href={item.href || "#"}>
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200">
                              <item.icon className="w-4 h-4" />
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

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              // Backdrop lebih gelap dan blur
              className="absolute inset-0 bg-[#050b14]/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              // Modal lebih glass
              className="relative w-full max-w-sm bg-[#0e1420]/70 border border-white/10 rounded-[32px] p-8 shadow-[0_0_80px_-10px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-[50px]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-70"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/15 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/10 flex items-center justify-center mb-6 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]">
                  <LogOut className="w-9 h-9 text-red-500 ml-1" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Konfirmasi Logout</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 px-4">
                  Sesi anda akan diakhiri. Anda harus login kembali untuk mengakses dashboard admin.
                </p>

                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3.5 rounded-2xl border border-white/20 text-slate-300 font-medium bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      signout();
                      window.location.href = "/sign-in";
                    }}
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-red-500/20"
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