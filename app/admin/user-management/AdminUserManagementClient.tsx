"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { useUsersStore } from "@/lib/usersStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  ShieldCheck, 
  UserX, 
  UserCog, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Crown, 
  Calendar,
  RotateCcw,
  List,
  Home,
  Loader2,
  ArrowLeft,
  LayoutDashboard
} from "lucide-react";
import { notify } from "@/components/Notification";

export default function AdminUserManagementClient() {
  const { 
    users, 
    stats, 
    isLoading, 
    pagination, 
    search, 
    filters,
    setSearch, 
    setFilter, 
    setPage,
    fetchUsers, 
    fetchStats,
    togglePremium,
    toggleVerified,
    deleteUser
  } = useUsersStore();

  const [viewMode, setViewMode] = useState<"dashboard" | "list">("dashboard");

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (viewMode === "list") {
      fetchUsers();
    }
  }, [viewMode, pagination.page, search, filters]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna ${name}? Tindakan ini tidak dapat dibatalkan.`)) {
      await deleteUser(id);
      notify("success", "Pengguna berhasil dihapus");
    }
  };

  const handleTogglePremium = async (id: string, currentStatus: boolean) => {
    await togglePremium(id, !currentStatus);
    notify("success", `Status Premium berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
  };

  const handleToggleVerified = async (id: string, currentStatus: boolean) => {
    await toggleVerified(id, !currentStatus);
    notify("success", `Status Verifikasi berhasil ${!currentStatus ? 'diaktifkan' : 'dicabut'}`);
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilter('role', "");
    setFilter('verified', "");
    setFilter('premium', "");
    setPage(1);
    notify("info", "Filter direset.");
  };

  const totalPages = pagination.total_pages || 1;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const statCards = [
    {
      title: "Total Pengguna",
      value: stats?.users || 0,
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-500",
      border: "border-sky-200",
      shadow: "shadow-sky-500/20"
    },
    {
      title: "Administrator",
      value: stats?.admins || 0,
      icon: UserCog,
      color: "text-violet-600",
      bg: "bg-violet-500",
      border: "border-violet-200",
      shadow: "shadow-violet-500/20"
    },
    {
      title: "User Premium",
      value: stats?.premium || 0,
      icon: Crown,
      color: "text-amber-600",
      bg: "bg-amber-500",
      border: "border-amber-200",
      shadow: "shadow-amber-500/20"
    },
    {
      title: "Belum Verifikasi",
      value: stats?.unverified || 0,
      icon: UserX,
      color: "text-rose-600",
      bg: "bg-rose-500",
      border: "border-rose-200",
      shadow: "shadow-rose-500/20"
    }
  ];

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border ${item.border} shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} opacity-[0.05] rounded-bl-[4rem] transition-transform group-hover:scale-110`}></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                 <div className={`p-3.5 rounded-2xl ${item.bg} text-white shadow-lg ${item.shadow} group-hover:rotate-6 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                 </div>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 opacity-80 ${item.color}`}>{item.title}</p>
                {isLoading ? (
                    <div className="h-9 w-20 bg-slate-200/70 rounded-lg animate-pulse mt-1"></div>
                ) : (
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight">{item.value.toLocaleString('id-ID')}</h3>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-2xl group border border-slate-700/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/30 transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] group-hover:bg-purple-500/30 transition-colors"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Kelola Daftar Pengguna</h3>
            <p className="text-slate-300 text-sm max-w-lg leading-relaxed font-medium">
              Akses tabel lengkap untuk melakukan pencarian, penyortiran, verifikasi, atau manajemen hak akses pengguna.
            </p>
          </div>
          <button 
            onClick={() => setViewMode("list")}
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg hover:shadow-white/20"
          >
            <List className="w-5 h-5" />
            Lihat Semua List
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderList = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white/70 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/60 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama, username, atau email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-sm"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
          <div className="relative min-w-[140px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={filters.role}
              onChange={(e) => setFilter('role', e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer hover:bg-white transition-colors shadow-sm"
            >
              <option value="">Semua Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <select 
            value={filters.verified}
            onChange={(e) => setFilter('verified', e.target.value)}
            className="px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white transition-colors shadow-sm"
          >
            <option value="">Status Verifikasi</option>
            <option value="true">Terverifikasi</option>
            <option value="false">Belum Verifikasi</option>
          </select>

          <select 
            value={filters.premium}
            onChange={(e) => setFilter('premium', e.target.value)}
            className="px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white transition-colors shadow-sm"
          >
            <option value="">Tipe Akun</option>
            <option value="true">Premium</option>
            <option value="false">Free</option>
          </select>

          {(search || filters.role || filters.verified || filters.premium) && (
             <button 
               onClick={handleResetFilters}
               className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors shadow-sm bg-white"
               title="Reset Filter"
             >
                <RotateCcw className="w-5 h-5" />
             </button>
           )}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-white/60 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/60 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 rounded-tl-[1.5rem]">Pengguna</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Paket</th>
                <th className="px-6 py-4">Bergabung</th>
                <th className="px-6 py-4 text-right rounded-tr-[1.5rem]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {users.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400 font-medium">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-slate-100">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <span>Tidak ada pengguna ditemukan.</span>
                      <button onClick={handleResetFilters} className="text-indigo-600 font-bold hover:underline">
                          Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 p-0.5 flex-shrink-0 shadow-sm">
                          <div className="w-full h-full rounded-full bg-white overflow-hidden relative flex items-center justify-center">
                            {u.avatar_url ? (
                              <Image src={u.avatar_url} alt={u.name} fill className="object-cover" />
                            ) : (
                              <span className="font-bold text-slate-400 text-lg">{u.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-700 truncate max-w-[180px]">{u.name}</p>
                          <p className="text-xs text-slate-500 truncate">@{u.username}</p>
                          <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize border shadow-sm ${
                        u.role === 'admin' 
                          ? 'bg-violet-100 text-violet-700 border-violet-200' 
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${
                        u.is_verified 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-100 text-rose-700 border-rose-200'
                      }`}>
                        {u.is_verified ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${
                        u.is_premium 
                          ? 'bg-amber-100 text-amber-700 border-amber-200' 
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}>
                        {u.is_premium && <Crown className="w-3 h-3 fill-current" />}
                        {u.is_premium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                              <Calendar className="w-3.5 h-3.5" />
                          </div>
                          {new Date(u.created_at).toLocaleDateString("id-ID", {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                          })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => handleToggleVerified(u.id, u.is_verified)}
                          className={`p-2 rounded-xl transition-colors ${u.is_verified ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                          title={u.is_verified ? "Cabut Verifikasi" : "Verifikasi Akun"}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleTogglePremium(u.id, u.is_premium)}
                          className={`p-2 rounded-xl transition-colors ${u.is_premium ? 'text-slate-500 hover:bg-slate-100' : 'text-amber-500 hover:bg-amber-50'}`}
                          title={u.is_premium ? "Batalkan Premium" : "Jadikan Premium"}
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id, u.name)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-auto px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            Halaman {pagination.page} dari {totalPages} ({pagination.total} Data)
          </span>
          <div className="flex gap-2">
            <button 
              disabled={pagination.page === 1}
              onClick={() => setPage(pagination.page - 1)}
              className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={pagination.page >= totalPages}
              onClick={() => setPage(pagination.page + 1)}
              className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-sky-200/40 rounded-full mix-blend-multiply filter blur-[128px]"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 -right-20 w-[600px] h-[600px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[128px]"
        />
      </div>

      <Sidebar activeTab="/admin/user-management" />

      <main className="ml-80 p-8 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Enhanced Header Area */}
          <header className="flex flex-col gap-5 pb-6 border-b border-slate-200/60">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Link href="/admin/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 group">
                    <div className="p-1 rounded-md group-hover:bg-indigo-50 transition-colors">
                        <Home className="w-4 h-4" />
                    </div>
                    Dashboard
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <button 
                  onClick={() => setViewMode('dashboard')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${
                    viewMode === 'dashboard' 
                        ? 'bg-white border-slate-200 text-indigo-600 font-semibold shadow-sm' 
                        : 'border-transparent hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Manajemen Pengguna
                </button>
                {viewMode === 'list' && (
                  <>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-slate-200 text-indigo-600 font-semibold shadow-sm text-xs">
                        <List className="w-3.5 h-3.5" />
                        Daftar Pengguna
                    </span>
                  </>
                )}
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  key={viewMode} // Re-animate text change
                >
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                        {viewMode === 'dashboard' ? (
                            <>
                                <LayoutDashboard className="w-8 h-8 text-indigo-600" />
                                Dashboard Pengguna
                            </>
                        ) : (
                            <>
                                <List className="w-8 h-8 text-indigo-600" />
                                Daftar Semua Pengguna
                            </>
                        )}
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">
                        {viewMode === 'dashboard' 
                          ? 'Ringkasan statistik, manajemen hak akses role, status verifikasi, dan keanggotaan premium.' 
                          : 'Tabel lengkap data pengguna dengan fitur pencarian lanjutan dan filter status.'}
                    </p>
                </motion.div>

                <div className="flex items-center gap-3">
                    {/* Back Button di Mode List */}
                    {viewMode === 'list' && (
                      <motion.button 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setViewMode('dashboard')}
                        className="p-3 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-sm transition-all"
                        title="Kembali ke Dashboard"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </motion.button>
                    )}

                    <div className="group relative overflow-hidden rounded-2xl bg-white p-1 pr-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Hari ini
                                </span>
                                <span className="text-sm font-bold text-slate-700">
                                    {formattedDate}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {viewMode === 'dashboard' ? (
               <motion.div key="dashboard" exit={{ opacity: 0, y: -20 }}>
                 {renderDashboard()}
               </motion.div>
            ) : (
               <motion.div key="list" exit={{ opacity: 0, y: 20 }}>
                 {renderList()}
               </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 bg-white/90 backdrop-blur-md border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full text-slate-600"
          >
            <div className="relative flex items-center justify-center">
               <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
               <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-md animate-pulse"></div>
            </div>
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-800">Sinkronisasi Data...</span>
               <span className="text-[10px] font-medium text-slate-400">Mohon tunggu sebentar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}