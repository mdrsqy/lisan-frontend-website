// src/app/app/admin/dashboard/page.tsx
'use client';

import React from "react";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, signout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    signout();
    router.push("/authentication/signin");
  };

  return (
    <div className="min-h-screen bg-[#100026] text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4">
        Halo Admin, {user?.name || "Superuser"} 🚀
      </h1>
      <p className="text-gray-400 mb-8">Anda sedang berada di dashboard admin.</p>
      <button
        onClick={handleLogout}
        className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all"
      >
        Keluar
      </button>
    </div>
  );
}