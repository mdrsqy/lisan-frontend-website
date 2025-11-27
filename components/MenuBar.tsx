"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Activity, 
  Award, 
  Settings, 
  Users, 
  FileText, 
  Shield,
  Menu,
  X,
  Bell,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuBarProps {
  role: "admin" | "user";
  userName: string;
  userRoleLabel: string;
}

export default function MenuBar({ role, userName, userRoleLabel }: MenuBarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/sign-in");
  };

  const userMenuItems = [
    { icon: LayoutDashboard, label: "Ringkasan", href: "/my" },
    { icon: BookOpen, label: "Pembelajaran", href: "/my/learning" },
    { icon: Activity, label: "Aktivitas", href: "/my/activity" },
    { icon: Award, label: "Pencapaian", href: "/my/achievements" },
    { icon: Settings, label: "Pengaturan", href: "/my/settings" },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard Admin", href: "/my" },
    { icon: Users, label: "Kelola Pengguna", href: "/my/users" },
    { icon: FileText, label: "Manajemen Konten", href: "/my/content" },
    { icon: Shield, label: "Log Keamanan", href: "/my/logs" },
    { icon: Settings, label: "Pengaturan Sistem", href: "/my/settings" },
  ];

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <>
      {role === "admin" && (
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
          )}
        </AnimatePresence>
      )}

      {role === "admin" && (
        <aside className={`
          fixed md:sticky top-0 left-0 h-screen w-72 bg-[#0A0F1C]/95 border-r border-white/5 z-50 
          transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-10 px-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                <img src="/lisan.png" alt="Lisan Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Lisan<span className="text-blue-500">.</span></span>
              <button onClick={() => setIsSidebarOpen(false)} className="ml-auto md:hidden text-slate-400">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              <div className="px-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Menu Administrator
              </div>
              {menuItems.map((item, idx) => (
                <button 
                  key={idx}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    idx === 0 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon size={20} className={idx === 0 ? "text-white" : "text-slate-500 group-hover:text-white"} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#0A0F1C] flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{userName}</p>
                  <p className="text-xs text-slate-500 truncate">{userRoleLabel}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium text-sm">Keluar</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      <div className="fixed top-0 left-0 right-0 p-4 bg-[#0A0F1C]/90 backdrop-blur-md border-b border-white/5 z-30 flex justify-between items-center md:hidden">
        <div className="flex items-center gap-3">
          {role === "admin" && (
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg bg-white/5 text-white">
              <Menu size={20} />
            </button>
          )}
          <span className="font-bold text-white">Lisan.</span>
        </div>

        <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
          <Bell size={16} />
        </button>
      </div>
    </>
  );
}