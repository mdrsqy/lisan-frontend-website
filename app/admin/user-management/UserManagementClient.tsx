"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Sidebar } from "@/components/Sidebar";
import NotificationStack from "@/components/ui/notification";
import Modal from "@/components/ui/modal";

import { useAuthStore } from "@/lib/authStore";
import api from "@/lib/api";

import { useRouter } from "next/navigation";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  score: number;
  is_premium: boolean;
  created_at: string;
}

export default function UserManagementsClient() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update" | "delete">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [password, setPassword] = useState("");

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [sortBy, setSortBy] = useState<"name" | "username" | "email" | "role" | "created_at">(
    "created_at"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    setMounted(true);
    if (!user) {
      const u = localStorage.getItem("user");
      const t = localStorage.getItem("token");
      if (u && t) setUser(JSON.parse(u));
      else router.push("/authentication/signin");
    }
  }, [user, router, setUser]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) setUsers(res.data);
    } catch {
      toast.error("Gagal mengambil data users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) fetchUsers();
  }, [mounted]);

  const handleOpenCreate = () => {
    setMode("create");
    setName("");
    setUserName("");
    setEmail("");
    setPassword("");
    setRole("user");
    setSelectedUser(null);
    setOpen(true);
  };

  const handleOpenUpdate = (u: User) => {
    setMode("update");
    setSelectedUser(u);
    setName(u.name);
    setUserName(u.username);
    setEmail(u.email);
    setRole(u.role as "user" | "admin");
    setPassword("");
    setOpen(true);
  };

  const handleOpenDelete = (u: User) => {
    setMode("delete");
    setSelectedUser(u);
    setOpen(true);
  };

  const submitCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/users/signup",
        { name, username, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User dibuat");
      setOpen(false);
      fetchUsers();
    } catch {
      toast.error("Gagal membuat user");
    }
  };

  const submitUpdate = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/users/${selectedUser.id}`,
        {
          name,
          username,
          email,
          role,
          ...(password ? { password } : {}),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User diupdate");
      setOpen(false);
      fetchUsers();
    } catch {
      toast.error("Gagal update user");
    }
  };

  const submitDelete = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User dihapus");
      setOpen(false);
      fetchUsers();
    } catch {
      toast.error("Gagal hapus user");
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = users.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const va = (a as any)[sortBy];
      const vb = (b as any)[sortBy];
      if (sortBy === "created_at") {
        return (new Date(va).getTime() - new Date(vb).getTime()) * dir;
      }
      if (typeof va === "string" && typeof vb === "string") {
        return va.localeCompare(vb) * dir;
      }
      return 0;
    });
    return list;
  }, [users, query, roleFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = (asExcel = false) => {
    const header = ["id", "name", "username", "email", "role", "is_premium", "created_at"];
    const rows = filtered.map((u) =>
      header.map((h) => {
        const v = (u as any)[h];
        if (typeof v === "string") return `"${v.replace(/"/g, '""')}"`;
        return v === null || v === undefined ? "" : `"${String(v)}"`;
      }).join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = asExcel ? `users_${Date.now()}.xlsx` : `users_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeTab="/admin/user-management" />
      <NotificationStack />

      <main className="flex-1 p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <h1 className="text-3xl font-bold text-[#027dda] drop-shadow-sm">User Management</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white border border-[#e6f2ff] rounded-full px-3 py-2 shadow-sm">
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search name, username, email..."
                className="outline-none px-2 w-56 sm:w-72 text-sm bg-transparent"
              />
              <button
                onClick={() => { setQuery(""); setPage(1); }}
                className="text-sm text-[#027dda] px-2"
              >
                Clear
              </button>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value as any); setPage(1); }}
              className="p-2 rounded-full border border-[#e6f2ff] bg-white text-sm"
            >
              <option value="all">All roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => exportCSV(false)}
                className="px-4 py-2 bg-[#f3f7ff] text-[#027dda] rounded-full text-sm border border-[#e6f2ff]"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportCSV(true)}
                className="px-4 py-2 bg-[#fff6f4] text-[#c82131] rounded-full text-sm border border-[#f6d2d2]"
              >
                Export Excel
              </button>
            </div>

            <button
              onClick={() => {
                setMode("create");
                setName(""); setUserName(""); setEmail(""); setPassword(""); setRole("user");
                setSelectedUser(null); setOpen(true);
              }}
              className="ml-auto sm:ml-0 flex items-center gap-2 bg-[#027dda] text-white px-5 py-2 rounded-full shadow-lg hover:shadow-xl"
            >
              <UserPlus size={16} /> Add User
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#e8f4ff] rounded-3xl p-4 sm:p-6 shadow-[0_12px_40px_rgba(2,125,218,0.06)]">
          <div className="hidden md:block overflow-x-auto rounded-2xl">
            <table className="w-full text-left border-collapse animate-fadeSlide">
              <thead className="bg-[#f2f8ff]">
                <tr className="text-[#027dda] font-semibold">
                  <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort("name")}>
                    Name {sortBy === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort("username")}>
                    Username {sortBy === "username" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort("email")}>
                    Email {sortBy === "email" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-5 py-4 cursor-pointer" onClick={() => handleSort("role")}>
                    Role {sortBy === "role" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6">Loading...</td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">No users</td>
                  </tr>
                ) : (
                  paginated.map((u) => (
                    <tr key={u.id} className="border-t border-[#e8f4ff] hover:bg-[#f7fbff] transition-all">
                      <td className="px-5 py-4">{u.name}</td>
                      <td className="px-5 py-4">{u.username}</td>
                      <td className="px-5 py-4">{u.email}</td>
                      <td className="px-5 py-4 capitalize">{u.role}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-3 justify-center">
                          <button onClick={() => handleOpenUpdate(u)} className="p-3 bg-[#fff7e6] rounded-2xl hover:bg-[#fff3d1]">
                            <Pencil size={16} className="text-[#f6bf4b]" />
                          </button>
                          <button onClick={() => handleOpenDelete(u)} className="p-3 bg-[#fff0f0] rounded-2xl hover:bg-[#ffdede]">
                            <Trash2 size={16} className="text-[#c82131]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden grid gap-4">
            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-6 text-gray-500">No users</div>
            ) : (
              paginated.map((u) => (
                <div key={u.id} className="bg-white border border-[#eaf6ff] rounded-3xl p-4 shadow-sm animate-fadeSlide">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{u.name}</div>
                      <div className="text-sm text-gray-500">@{u.username}</div>
                      <div className="text-sm text-gray-600 mt-2">{u.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 rounded-full bg-[#f2f8ff] text-[#027dda] text-xs font-medium">{u.role}</div>
                      <div className="mt-3 flex flex-col gap-2">
                        <button onClick={() => handleOpenUpdate(u)} className="px-3 py-2 rounded-lg bg-[#fff7e6] text-sm">Edit</button>
                        <button onClick={() => handleOpenDelete(u)} className="px-3 py-2 rounded-lg bg-[#fff0f0] text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 rounded-full bg-white border border-[#e6f2ff]">Prev</button>
              <div className="px-3 py-2 bg-[#f3f9ff] text-[#027dda] rounded-full">{page} / {totalPages}</div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-2 rounded-full bg-white border border-[#e6f2ff]">Next</button>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeSlide { animation: fadeSlide 0.32s ease-out; }
        `}</style>
      </main>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={mode === "create" ? "Create User" : mode === "update" ? "Update User" : "Delete User"}
        width="max-w-md"
        actions={
          mode === "delete" ? (
            <>
              <button className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300" onClick={() => setOpen(false)}>Cancel</button>
              <button className="px-6 py-2 rounded-full bg-[#c82131] text-white hover:bg-[#a21828]" onClick={submitDelete}>Delete</button>
            </>
          ) : (
            <>
              <button className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300" onClick={() => setOpen(false)}>Cancel</button>
              <button className="px-6 py-2 rounded-full bg-[#027dda] text-white hover:bg-[#0466b3]" onClick={mode === "create" ? submitCreate : submitUpdate}>{mode === "create" ? "Create" : "Update"}</button>
            </>
          )
        }
      >
        {mode === "delete" ? (
          <p className="text-center">Hapus user <span className="font-semibold">{selectedUser?.username}</span>?</p>
        ) : (
          <div className="space-y-4">
            <input placeholder="Full Name" className="w-full p-3 bg-gray-100 rounded-2xl outline-[#027dda]" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Username" className="w-full p-3 bg-gray-100 rounded-2xl outline-[#027dda]" value={username} onChange={(e) => setUserName(e.target.value)} />
            <input placeholder="Email" className="w-full p-3 bg-gray-100 rounded-2xl outline-[#027dda]" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" className="w-full p-3 bg-gray-100 rounded-2xl outline-[#027dda]" value={password} onChange={(e) => setPassword(e.target.value)} />
            <select className="w-full p-3 bg-gray-100 rounded-2xl outline-[#027dda]" value={role} onChange={(e) => setRole(e.target.value as any)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
      </Modal>
    </div>
  );
}