"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/sidebar";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast from "react-hot-toast";

interface User {
  id: number;
  full_name: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export default function UserManagementsClient() {
  const { user, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check user & token
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

  // Fetch users
  useEffect(() => {
    if (!mounted) return;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users || []);
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Gagal mengambil data users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#000000] text-[#e7e9ea]">
      <Sidebar activeTab="/admin/user-management" />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#ffffff] mb-6">User Management</h1>

        <div className="overflow-x-auto bg-[#111111] rounded-2xl p-4 border border-[#1c9cf0]/30 shadow-lg">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b border-[#1c9cf0]/40">
                <th className="px-4 py-2 text-[#1c9cf0]">ID</th>
                <th className="px-4 py-2 text-[#1c9cf0]">Full Name</th>
                <th className="px-4 py-2 text-[#1c9cf0]">Username</th>
                <th className="px-4 py-2 text-[#1c9cf0]">Email</th>
                <th className="px-4 py-2 text-[#1c9cf0]">Role</th>
                <th className="px-4 py-2 text-[#1c9cf0]">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-[#1c9cf0]">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-[#e7e9ea]/60">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-[#1c9cf0]/20 hover:bg-[#1c9cf0]/10">
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">{u.full_name}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}