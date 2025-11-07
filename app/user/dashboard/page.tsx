// src/app/app/user/dashboard/page.tsx
'use client';

import React from "react";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const { user, signout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    signout();
    router.push("/authentication/signin");
  };

  return (
    <div className="min-h-screen bg-[#070014] text-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4">
        Halo, {user?.name || "User"} 👋
      </h1>
      <p className="text-gray-400 mb-8">Selamat datang di dashboard pengguna.</p>
      <button
        onClick={handleLogout}
        className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 transition-all"
      >
        Keluar
      </button>
    </div>
  );
}