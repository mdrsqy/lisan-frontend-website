"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { 
  LayoutGrid, 
  List as ListIcon, 
  CheckCircle2, 
  Pin, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  RotateCcw, 
  Megaphone,
  Plus,
  Search,
  X
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { notify } from "@/components/Notification"; 
import { useAnnouncementStore, Announcement, AnnouncementFormData } from "@/lib/announcementStore"; 
import { Sidebar } from "@/components/Sidebar"; 
import { HeaderManagement } from "@/components/ui/HeaderManagement";
import { ManagementBanner } from "@/components/ui/ManagementBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AnnouncementTable } from "@/components/admin/announcement/AnnouncementTable";
import { AnnouncementModal } from "@/components/admin/announcement/AnnouncementModal";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 }
  }
};

const tabVariants: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2, ease: "easeIn" } }
};

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
    image: null,
    video_url: "",
  };
  
  const [formData, setFormData] = useState<AnnouncementFormData>(initialForm);
  const totalPages = pagination.total_pages || 1;

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
      image: null,
      video_url: item.video_url || "",
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
    <div className="space-y-8">
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
            variants={itemVariants}
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
                <h3 className="text-4xl font-black text-slate-800 tracking-tight">{item.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants}>
          <ManagementBanner 
            badgeText="Manajemen Pengumuman"
            badgeIcon={<Megaphone className="w-3.5 h-3.5" />}
            title="Kelola Daftar Pengumuman"
            description={
              <span>
                Akses tabel lengkap untuk melakukan pencarian, penyortiran, pengeditan, atau penghapusan pengumuman.
              </span>
            }
            actionText="Lihat Semua List"
            actionIcon={<ListIcon className="w-5 h-5 text-indigo-600" />}
            onAction={() => setViewMode("list")}
          />
      </motion.div>
    </div>
  );

  const renderList = () => (
    <div className="space-y-6">
      <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/60 shadow-sm flex flex-col lg:flex-row gap-4">
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
      </motion.div>

      <motion.div variants={itemVariants}>
          <AnnouncementTable 
            data={announcements}
            loading={loading}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onTogglePin={handleTogglePin}
          />
      </motion.div>
        
      <motion.div variants={itemVariants} className="mt-auto px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-xl">
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
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* Animated Background (Static) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[128px]" />
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-300/30 rounded-full mix-blend-multiply filter blur-[128px]" />
         <div className="absolute -bottom-40 left-1/2 w-[600px] h-[600px] bg-cyan-300/30 rounded-full mix-blend-multiply filter blur-[128px]" />
         <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-rose-300/30 rounded-full mix-blend-multiply filter blur-[128px]" />
      </div>

      <Sidebar activeTab="/admin/announcement-management" />
      
      <main className="ml-80 p-8 relative z-10 min-h-screen">
        <motion.div 
            className="max-w-7xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <HeaderManagement 
                    title={viewMode === 'dashboard' ? 'Dashboard Pengumuman' : 'Daftar Semua Pengumuman'}
                    subtitle={viewMode === 'dashboard' 
                        ? 'Ringkasan statistik, manajemen konten, serta publikasi informasi penting.' 
                        : 'Tabel lengkap pengumuman dengan fitur filter, pencarian, dan penyuntingan.'}
                    breadcrumbs={[
                        { label: "Manajemen", onClick: () => setViewMode('dashboard'), active: viewMode === 'dashboard' },
                        { label: "Pengumuman", active: true }
                    ]}
                    actions={
                        <div className="flex items-center gap-4 self-start xl:self-center">
                            {viewMode === "list" && (
                                <button 
                                    onClick={() => setViewMode("dashboard")}
                                    className="p-3 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 shadow-sm transition-all"
                                    title="Kembali ke Dashboard"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            <button 
                                onClick={openCreateModal}
                                className="group relative px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <Plus className="w-5 h-5 relative z-10" /> 
                                <span className="relative z-10">Buat Baru</span>
                            </button>
                        </div>
                    }
                />
            </motion.div>

           <AnimatePresence mode="wait">
             <motion.div
               key={viewMode}
               variants={tabVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
             >
                {viewMode === "dashboard" ? renderDashboard() : renderList()}
             </motion.div>
           </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <AnnouncementModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onFileChange={handleFileChange}
                previewImage={previewImage}
            />
          )}
        </AnimatePresence>
      </main>

      <LoadingSpinner isLoading={loading} />
    </div>
  );
}