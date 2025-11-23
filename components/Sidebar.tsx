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
import Image from "next/image";
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
    { name: "Home", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users Management", href: "/admin/user-management", icon: Users },
    { name: "Announcement Management", href: "/admin/announcement-management", icon: Megaphone },
    { name: "Module Learning Management", href: "/admin/module-managements", icon: BookOpen },
    { name: "Notification Management", href: "/admin/notifications", icon: Bell },
  ];

  const profileMenu: MenuItem[] = [
    { name: "Account", href: "/admin/profile", icon: User },
    { name: "Log Out", icon: LogOut, action: () => setShowLogoutModal(true) },
  ];

  return (
    <>
      <aside className="flex flex-col justify-between h-screen w-80 bg-white text-[#1a1a1a] border-r border-gray-200 shadow-md">

        {/* LOGO + GRADIENT TEXT */}
        <div className="p-2 flex flex-col items-center mt-8 mb-6">
          <img
            src="/lisan-logo.png"
            alt="Lisan Logo"
            className="w-14 h-14 mb-2"
          />

          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#027dda] via-[#f6bf4b] to-[#c82131] tracking-wide">
            Lisan
          </h1>
        </div>


        {/* Navigation */}
        <div className="flex flex-col p-4 space-y-4 flex-1">
          <nav className="flex flex-col space-y-3">
            {mainMenu.map((item) => {
              const isActive = activeTab === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.name} href={item.href || "#"}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${isActive
                        ? "bg-[#027dda] text-white shadow-md"
                        : "hover:bg-gray-100 text-[#1a1a1a]"
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-white" : "text-[#027dda]"
                        }`}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom profile */}
        <div className="flex flex-col p-5 space-y-4 border-t border-gray-200 bg-white">
          <Link href="/admin/settings">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition">
              <Settings className="h-5 w-5 text-[#027dda]" />
              <span className="text-sm font-medium">Settings</span>
            </div>
          </Link>

          <div ref={profileRef} className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#027dda] flex items-center justify-center text-white font-bold text-sm">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-sm font-semibold">{user?.name || ""}</p>
                <p className="text-xs text-gray-500">{user?.email || ""}</p>
              </div>
            </div>

            <div className="cursor-pointer relative" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <MoreHorizontal className="h-5 w-5 text-[#027dda]" />

              {showProfileMenu && (
                <div className="absolute -top-24 -left-10 bg-white border border-gray-200 rounded-xl p-2 w-40 shadow-lg z-50 animate-fadeIn">
                  {profileMenu.map((item) =>
                    item.action ? (
                      <button
                        key={item.name}
                        onClick={item.action}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </button>
                    ) : (
                      <Link key={item.name} href={item.href || "#"}>
                        <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm">
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl w-96 border border-gray-200 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-[#027dda] text-white hover:bg-[#027dda]/90 transition"
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
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </>
  );
}