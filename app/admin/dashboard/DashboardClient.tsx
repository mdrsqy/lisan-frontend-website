"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/sidebar";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";

export default function DashboardClient() {
  const { user, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    if (!user) {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      } else {
        router.push("/authentication/signin");
      }
    }
  }, [user, setUser, router]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#000000] text-[#e7e9ea]">
      <Sidebar activeTab="/admin/dashboard" />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#ffffff] mb-6">Welcome, {user?.full_name || "User"}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-[#1c9cf0]/30">
            <h2 className="text-lg font-semibold mb-2">Total Users</h2>
            <p className="text-[#1c9cf0] text-2xl">125</p>
          </div>
          <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-[#1c9cf0]/30">
            <h2 className="text-lg font-semibold mb-2">Announcements</h2>
            <p className="text-[#1c9cf0] text-2xl">34</p>
          </div>
          <div className="bg-[#111111] p-6 rounded-2xl shadow-lg border border-[#1c9cf0]/30">
            <h2 className="text-lg font-semibold mb-2">Modules</h2>
            <p className="text-[#1c9cf0] text-2xl">12</p>
          </div>
        </div>
      </main>
    </div>
  );
}