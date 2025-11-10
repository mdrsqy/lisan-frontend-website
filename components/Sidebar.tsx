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
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../lib/authStore";

interface MenuItem {
  name: string;
  href?: string;
  icon: any;
  action?: () => void;
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
      if (savedUser) setUser(JSON.parse(savedUser));
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user, setUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const mainMenu: MenuItem[] = [
    { name: "Home", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users Management", href: "/admin/users", icon: Users },
    { name: "Announcement Management", href: "/admin/announcements", icon: Megaphone },
    { name: "Module Learning Management", href: "/admin/modules", icon: BookOpen },
    { name: "Notification Management", href: "/admin/notifications", icon: Bell },
  ];

  const profileMenu: MenuItem[] = [
    { name: "Account", href: "/admin/profile", icon: User },
    { name: "Log Out", icon: LogOut, action: () => setShowLogoutModal(true) },
  ];

  return (
    <>
      <aside className="flex flex-col justify-between h-screen w-72 bg-[#000000] text-[#e7e9ea] border-r border-[#1c9cf0]/30 rounded-tr-3xl rounded-br-3xl shadow-lg">
        <div className="p-2 flex justify-center mt-10 mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1c9cf0] to-[#ffffff] relative">
            Lisan
          </h1>
        </div>

        <div className="flex flex-col p-4 space-y-6 flex-1">
          <nav className="flex flex-col space-y-6">
            {mainMenu.map((item) => {
              const isActive = activeTab === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href || "#"}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-[#1c9cf0] text-[#ffffff] font-semibold"
                        : "hover:bg-[#1c9cf0]/20 text-[#e7e9ea] font-normal"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#ffffff]" : "text-[#1c9cf0]"}`} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col p-6 space-y-4 border-t border-[#1c9cf0]/30">
          <Link href="/admin/settings">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-[#1c9cf0]/20">
              <Settings className="h-4 w-4 text-[#1c9cf0]" />
              <span className="text-sm font-normal">Settings</span>
            </div>
          </Link>

          <div ref={profileRef} className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1c9cf0] flex items-center justify-center text-[#ffffff] font-bold text-sm">
                {user?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-xs font-normal">{user?.full_name || ""}</p>
                <p className="text-[10px] text-[#1c9cf0]/80">{user?.email || ""}</p>
              </div>
            </div>

            <div className="cursor-pointer relative" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <MoreHorizontal className="h-4 w-4 text-[#1c9cf0]" />
              {showProfileMenu && (
                <div className="absolute top-0 left-full ml-2 bg-[#111111] border border-[#1c9cf0]/40 rounded-xl p-2 w-40 flex flex-col z-50 animate-fadeIn">
                  {profileMenu.map((item) => (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className="flex items-center gap-2 px-3 py-2 text-[#e7e9ea] hover:bg-[#1c9cf0]/20 rounded-lg text-sm font-normal"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#000000] text-[#e7e9ea] p-6 rounded-xl w-96 border border-[#1c9cf0]/50">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-lg border border-[#1c9cf0] hover:bg-[#1c9cf0]/20"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#1c9cf0] text-[#ffffff] hover:bg-[#1c9cf0]/90"
                onClick={() => {
                  signout();
                  window.location.href = "/authentication/signin";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}