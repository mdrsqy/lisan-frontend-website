"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List as ListIcon,
  ArrowLeft,
  Megaphone,
  CheckCircle2,
  Pin,
  Trash2,
  Edit,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  RotateCcw,
  Loader2,
  Home,
  LayoutDashboard
} from "lucide-react";

import { notify } from "@/components/Notification"; 
import { useAnnouncementStore, Announcement, AnnouncementFormData } from "@/lib/announcementStore"; 
import { Sidebar } from "@/components/Sidebar"; 
import { motion, AnimatePresence } from "framer-motion";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function AdminAnnouncementManagementClient() {
  const { 
    announcements, 
    stats,
    loading, 
    pagination, 
    search, 
    category,
    sort,
    setSearch, 
    setCategory,
    setSort,
    fetchAdminList,
    fetchStats,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleStatus,
    togglePin
  } = useAnnouncementStore();

  const [viewMode, setViewMode] = useState<"dashboard" | "list">("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 500);

  const initialForm: AnnouncementFormData = {
    title: "",
    content: "",
    category: "content",
    is_pinned: false,
    publish_at: new Date().toISOString().slice(0, 16),
    image: null
  };
  
  const [formData, setFormData] = useState<AnnouncementFormData>(initialForm);
  const totalPages = pagination.total_pages || 1;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
      useAnnouncementStore.setState(state => ({ 
        pagination: { ...state.pagination, page: 1 } 
      }));
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (viewMode === "list") {
      fetchAdminList();
    }
  }, [viewMode, search, category, sort, pagination.page]);

  const handleResetFilter = () => {
    setLocalSearch("");
    setSearch("");
    setCategory("");
    setSort("latest");
    useAnnouncementStore.setState(state => ({ 
        pagination: { ...state.pagination, page: 1 } 
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        useAnnouncementStore.setState(state => ({ 
            pagination: { ...state.pagination, page: newPage } 
        }));
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    useAnnouncementStore.setState(state => ({ 
        pagination: { ...state.pagination, page: 1 } 
    }));
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    useAnnouncementStore.setState(state => ({ 
        pagination: { ...state.pagination, page: 1 } 
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setPreviewImage(null);
    setIsEditing(false);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Announcement) => {
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      is_pinned: item.is_pinned,
      publish_at: new Date(item.publish_at).toISOString().slice(0, 16),
      image: null
    });
    setPreviewImage(item.image_url);
    setSelectedId(item.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      notify("error", "Judul dan konten wajib diisi");
      return;
    }

    try {
      if (isEditing && selectedId) {
        await updateAnnouncement(selectedId, formData);
        notify("success", "Pengumuman berhasil diperbarui");
      } else {
        await createAnnouncement(formData);
        notify("success", "Pengumuman berhasil dibuat");
      }
      setIsModalOpen(false);
      fetchStats(); 
      if (viewMode === 'list') fetchAdminList();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Terjadi kesalahan pada server";
      notify("error", msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengumuman ini secara permanen?")) return;
    try {
      await deleteAnnouncement(id);
      notify("success", "Pengumuman dihapus");
      fetchStats();
      if (viewMode === 'list') fetchAdminList();
    } catch (error) {
      notify("error", "Gagal menghapus data");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatus(id, !currentStatus);
      notify("success", `Status berhasil diubah`);
      fetchStats();
      if (viewMode === 'list') fetchAdminList();
    } catch (error) {
      notify("error", "Gagal mengubah status");
    }
  };

  const handleTogglePin = async (id: string, currentPin: boolean) => {
    try {
      await togglePin(id, !currentPin);
      notify("success", currentPin ? "Pin dilepas" : "Pengumuman disematkan");
      fetchStats();
      if (viewMode === 'list') fetchAdminList();
    } catch (error) {
      notify("error", "Gagal mengubah pin");
    }
  };

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "Total Pengumuman", 
            value: stats.total, 
            icon: Megaphone, 
            bgColor: "bg-blue-500", 
            textColor: "text-blue-600",
            shadow: "shadow-blue-500/20",
            borderColor: "border-blue-200"
          },
          { 
            label: "Sedang Aktif", 
            value: stats.active, 
            icon: CheckCircle2, 
            bgColor: "bg-emerald-500", 
            textColor: "text-emerald-600",
            shadow: "shadow-emerald-500/20",
            borderColor: "border-emerald-200"
          },
          { 
            label: "Disematkan", 
            value: stats.pinned, 
            icon: Pin, 
            bgColor: "bg-orange-500", 
            textColor: "text-orange-600",
            shadow: "shadow-orange-500/20",
            borderColor: "border-orange-200"
          },
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative p-6 rounded-[2rem] bg-white/70 backdrop-blur-xl border ${item.borderColor} shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${item.bgColor} opacity-[0.05] rounded-bl-[4rem] transition-transform group-hover:scale-110`}></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <div className={`p-3.5 rounded-2xl ${item.bgColor} text-white shadow-lg ${item.shadow} group-hover:rotate-6 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
              </div>
              
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${item.textColor} opacity-80`}>{item.label}</p>
                
                {loading ? (
                    <div className="h-10 w-24 bg-slate-200/60 rounded-lg animate-pulse mt-1"></div>
                ) : (
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight">{item.value}</h3>
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
            <h3 className="text-2xl font-bold tracking-tight">Kelola Daftar Pengumuman</h3>
            <p className="text-slate-300 text-sm max-w-lg leading-relaxed font-medium">
              Akses tabel lengkap untuk melakukan pencarian, penyortiran, pengeditan, atau penghapusan pengumuman.
            </p>
          </div>
          <button 
            onClick={() => setViewMode("list")}
            className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg hover:shadow-white/20"
          >
            <ListIcon className="w-5 h-5" />
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
            placeholder="Cari berdasarkan judul..." 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
           <div className="relative min-w-[160px]">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <select 
              value={category}
              onChange={handleCategoryChange}
              className="w-full pl-10 pr-8 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer hover:bg-white transition-colors shadow-sm"
            >
              <option value="">Semua Kategori</option>
              <option value="content">Konten / Berita</option>
              <option value="warning">Peringatan / Maintenance</option>
              <option value="update">Update Aplikasi</option>
              <option value="event">Event</option>
              <option value="tips">Tips</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
           </div>
          
           <div className="relative min-w-[140px]">
             <select 
              value={sort}
              onChange={handleSortChange}
              className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white transition-colors appearance-none shadow-sm"
            >
              <option value="latest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
           </div>

           {(search || category || sort !== 'latest') && (
             <button 
               onClick={handleResetFilter}
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
                <th className="px-6 py-4 rounded-tl-[1.5rem]">Info Pengumuman</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Prioritas</th>
                <th className="px-6 py-4">Tanggal Terbit</th>
                <th className="px-6 py-4 text-right rounded-tr-[1.5rem]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {announcements.length === 0 && !loading ? (
                <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-medium">Tidak ada data ditemukan.</td></tr>
              ) : (
                announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-white/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden relative border border-slate-200 shadow-sm">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                          ) : (
                            <LayoutGrid className="w-6 h-6 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-700 truncate max-w-[200px]">{item.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Oleh: {item.created_by?.name || "Admin"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-600 capitalize shadow-sm">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(item.id, item.is_active)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                          item.is_active 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200" 
                          : "bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => handleTogglePin(item.id, item.is_pinned)}
                            title={item.is_pinned ? "Lepas Pin" : "Sematkan"}
                            className={`p-2 rounded-xl transition-all ${
                                item.is_pinned 
                                ? "bg-orange-100 text-orange-600 shadow-sm border border-orange-200" 
                                : "text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                            }`}
                        >
                           <Pin className={`w-4 h-4 ${item.is_pinned ? 'fill-current' : ''}`} />
                        </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-medium text-xs">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                             <Calendar className="w-3.5 h-3.5" />
                          </div>
                          {new Date(item.publish_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <button 
                                onClick={() => openEditModal(item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Hapus"
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
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                    disabled={pagination.page >= totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
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
           className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[128px]"
         />
         <motion.div 
           animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-300/30 rounded-full mix-blend-multiply filter blur-[128px]"
         />
         <motion.div 
           animate={{ x: [0, 50, 0], y: [0, 50, 0], scale: [1, 1.5, 1] }}
           transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
           className="absolute -bottom-40 left-1/2 w-[600px] h-[600px] bg-cyan-300/30 rounded-full mix-blend-multiply filter blur-[128px]"
         />
      </div>

      <Sidebar activeTab="/admin/announcement-management" />
      
      <main className="ml-80 p-8 relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col gap-5 pb-6 border-b border-slate-200/60">
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
                    <Megaphone className="w-3.5 h-3.5" />
                    Manajemen Pengumuman
                  </button>
                  {viewMode === 'list' && (
                    <>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                      <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-slate-200 text-indigo-600 font-semibold shadow-sm text-xs">
                          <ListIcon className="w-3.5 h-3.5" />
                          Daftar Pengumuman
                      </span>
                    </>
                  )}
              </nav>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  key={viewMode}
                >
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                        {viewMode === 'dashboard' ? (
                            <>
                                <LayoutDashboard className="w-8 h-8 text-indigo-600" />
                                Dashboard Pengumuman
                            </>
                        ) : (
                            <>
                                <ListIcon className="w-8 h-8 text-indigo-600" />
                                Daftar Semua Pengumuman
                            </>
                        )}
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">
                       {viewMode === 'dashboard' 
                          ? 'Ringkasan statistik, manajemen konten, serta publikasi informasi penting.' 
                          : 'Tabel lengkap pengumuman dengan fitur filter, pencarian, dan penyuntingan.'}
                    </p>
                </motion.div>

                <div className="flex items-center gap-4 self-start xl:self-center">
                  {viewMode === "list" && (
                       <button 
                          onClick={() => setViewMode("dashboard")}
                          className="p-3 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-sm transition-all"
                          title="Kembali ke Dashboard"
                       >
                          <ArrowLeft className="w-5 h-5" />
                       </button>
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

                  <button 
                    onClick={openCreateModal}
                    className="group relative px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                     <Plus className="w-5 h-5 relative z-10" />
                     <span className="relative z-10">Buat Baru</span>
                  </button>
                </div>
              </div>
            </header>

           <AnimatePresence mode="wait">
             <motion.div
               key={viewMode}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
             >
                {viewMode === "dashboard" ? renderDashboard() : renderList()}
             </motion.div>
           </AnimatePresence>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white/95 backdrop-blur-xl rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/60 flex flex-col"
              >
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <div>
                       <h2 className="text-xl font-bold text-slate-800">
                           {isEditing ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
                       </h2>
                       <p className="text-xs text-slate-500 font-medium mt-0.5">Isi detail informasi di bawah ini</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    <form id="announcementForm" onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-slate-700">Gambar Cover</label>
                            <div className="flex gap-6 items-start">
                                <div className="w-36 h-36 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-400 flex items-center justify-center relative overflow-hidden flex-shrink-0 group transition-colors">
                                    {previewImage ? (
                                        <>
                                            <Image src={previewImage} alt="Preview" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-slate-900/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold backdrop-blur-sm transition-all">Ubah Gambar</div>
                                        </>
                                    ) : (
                                        <div className="text-center p-2">
                                            <LayoutGrid className="mx-auto w-10 h-10 text-slate-300 mb-2" />
                                            <span className="text-xs font-semibold text-slate-400">Upload</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1 space-y-2 text-sm text-slate-500 pt-2">
                                    <p className="font-medium text-slate-600">Ketentuan Gambar:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                                        <li>Format: JPG, PNG, WEBP</li>
                                        <li>Ukuran maksimal: 5MB</li>
                                        <li>Rasio disarankan: 16:9</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700">Judul Pengumuman</label>
                            <input 
                                name="title"
                                type="text"
                                required
                                placeholder="Contoh: Pembaruan Sistem Versi 2.0"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-300"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-slate-700">Kategori</label>
                                <div className="relative">
                                  <select 
                                      name="category"
                                      value={formData.category}
                                      onChange={handleInputChange}
                                      className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none font-medium text-slate-600"
                                  >
                                      <option value="content">Konten / Berita</option>
                                      <option value="warning">Peringatan / Maintenance</option>
                                      <option value="update">Update Aplikasi</option>
                                      <option value="event">Event</option>
                                      <option value="tips">Tips</option>
                                  </select>
                                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-slate-700">Jadwal Terbit</label>
                                <input 
                                    name="publish_at"
                                    type="datetime-local"
                                    required
                                    value={formData.publish_at}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700">Isi Konten</label>
                            <textarea 
                                name="content"
                                required
                                rows={6}
                                placeholder="Tuliskan detail pengumuman di sini..."
                                value={formData.content}
                                onChange={handleInputChange}
                                className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none font-medium placeholder:text-slate-300"
                            />
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="is_pinned"
                                    id="is_pinned"
                                    checked={formData.is_pinned}
                                    onChange={handleCheckboxChange}
                                    className="sr-only peer" 
                                />
                                <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-500 shadow-inner"></div>
                            </div>
                            <div>
                                <label htmlFor="is_pinned" className="block text-sm font-bold text-slate-800 cursor-pointer">Sematkan di Atas (Pin)</label>
                                <p className="text-xs text-slate-500 font-medium">Pengumuman ini akan muncul paling atas di halaman user sebagai prioritas.</p>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit" 
                        form="announcementForm"
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02]"
                    >
                        {isEditing ? "Simpan Perubahan" : "Publikasikan"}
                    </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {loading && (
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