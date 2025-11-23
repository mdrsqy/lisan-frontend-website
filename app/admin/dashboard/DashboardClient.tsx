"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";

export default function DashboardClient() {
  const { user, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [counts, setCounts] = useState({ users: 0, admins: 0 });

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

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${API}/users/count`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Invalid API response");

        const data = await res.json();
        setCounts(data);
      } catch (err) {
        console.error("Failed to fetch counts: ", err);
      }
    };

    fetchCounts();
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-gray-900">
      <Sidebar activeTab="/admin/dashboard" />

      <main className="flex-1 px-10 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          Welcome, {user?.name || "User"}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <h2 className="text-base font-medium text-gray-600">Total Users</h2>
            <p className="text-4xl font-bold text-[#027dda] mt-2">
              {counts.users}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <h2 className="text-base font-medium text-gray-600">Total Admins</h2>
            <p className="text-4xl font-bold text-[#027dda] mt-2">
              {counts.admins}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
