"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
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
  Calendar
} from "lucide-react";
import { notify } from "@/components/Notification"; 
import { useAnnouncementStore, Announcement, AnnouncementFormData } from "@/lib/announcementStore";
import { Sidebar } from "@/components/Sidebar";

interface Stats {
  total: number;
  active: number;
  pinned: number;
}

export default function AdminAnnouncementManagementClient() {
  const { 
    announcements, 
    loading, 
    pagination, 
    search, 
    setAnnouncements, 
    setLoading, 
    setPagination, 
    setSearch 
  } = useAnnouncementStore();

  const [viewMode, setViewMode] = useState<"dashboard" | "list">("dashboard");
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, pinned: 0 });
  const [sort, setSort] = useState("latest"); 
  const [categoryFilter, setCategoryFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const initialForm: AnnouncementFormData = {
    title: "",
    content: "",
    category: "news",
    is_pinned: false,
    publish_at: new Date().toISOString().slice(0, 16),
    image: null
  };
  
  const [formData, setFormData] = useState<AnnouncementFormData>(initialForm);

  const totalPages = Math.ceil((pagination.total || 0) / pagination.limit) || 1;

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/announcement/admin/stats");
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        q: search,
        sort: sort,
        category: categoryFilter
      });
      
      const res = await fetch(`/api/announcement/admin/list?${query}`);
      const data = await res.json();
      
      if (res.ok) {
        setAnnouncements(data.data);
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total
        });
      }
    } catch (error) {
      notify("error", "Gagal mengambil data pengumuman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (viewMode === "list") {
      fetchAnnouncements();
    }
  }, [viewMode, pagination.page, search, sort, categoryFilter]); 

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

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("category", formData.category);
    data.append("publish_at", new Date(formData.publish_at).toISOString());
    data.append("is_pinned", String(formData.is_pinned));
    
    if (!isEditing) {
        data.append("user_id", "admin-id-placeholder"); 
    }

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const url = isEditing 
        ? `/api/announcement/update/${selectedId}` 
        : `/api/announcement/create`;
      
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, { method, body: data });
      const result = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        notify("success", result.message);
        fetchStats(); 
        if (viewMode === "list") fetchAnnouncements();
      } else {
        notify("error", result.message || "Terjadi kesalahan");
      }
    } catch (error) {
      notify("error", "Gagal menghubungi server");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengumuman ini secara permanen?")) return;

    try {
      const res = await fetch(`/api/announcement/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        notify("success", "Pengumuman dihapus");
        fetchStats();
        fetchAnnouncements();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/announcement/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      fetchStats();
      fetchAnnouncements();
      notify("success", `Status diubah menjadi ${!currentStatus ? 'Aktif' : 'Nonaktif'}`);
    } catch (error) {
      notify("error", "Gagal mengubah status");
    }
  };

  const handleTogglePin = async (id: string, currentPin: boolean) => {
    try {
      await fetch(`/api/announcement/pin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_pinned: !currentPin })
      });
      fetchStats();
      fetchAnnouncements();
      notify("info", currentPin ? "Pin dilepas" : "Pengumuman disematkan");
    } catch (error) {
      notify("error", "Gagal mengubah pin");
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Pengumuman</h1>
          <p className="text-gray-500 mt-1">Ringkasan aktivitas dan statistik publikasi Lisan.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition-all hover:scale-105 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Buat Pengumuman
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Pengumuman", value: stats.total, icon: Megaphone, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Sedang Aktif", value: stats.active, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Disematkan (Pinned)", value: stats.pinned, icon: Pin, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{item.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Kelola Daftar Pengumuman</h3>
          <p className="text-gray-300 text-sm max-w-md">
            Akses tabel lengkap untuk melakukan pencarian, penyortiran, pengeditan, atau penghapusan pengumuman yang ada.
          </p>
        </div>
        <button 
          onClick={() => setViewMode("list")}
          className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <ListIcon className="w-5 h-5" />
          Lihat Semua List
        </button>
      </div>
    </div>
  );

  const renderList = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setViewMode("dashboard")}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Pengumuman</h1>
          <p className="text-sm text-gray-500">Manajemen data lengkap</p>
        </div>
        <div className="ml-auto">
             <button 
                onClick={openCreateModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Baru
              </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari judul..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
           <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Semua Kategori</option>
            <option value="news">Berita</option>
            <option value="update">Update</option>
            <option value="event">Event</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="latest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="a-z">Judul A-Z</option>
            <option value="z-a">Judul Z-A</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Info Pengumuman</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Prioritas</th>
                <th className="px-6 py-4">Tanggal Terbit</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">Memuat data...</td></tr>
              ) : announcements.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">Tidak ada data ditemukan.</td></tr>
              ) : (
                announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden relative border border-gray-200">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                          ) : (
                            <LayoutGrid className="w-5 h-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{item.title}</p>
                          <p className="text-xs text-gray-500">Oleh: {item.created_by?.name || "Admin"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(item.id, item.is_active)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          item.is_active 
                          ? "bg-green-50 text-green-700 hover:bg-green-100" 
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => handleTogglePin(item.id, item.is_pinned)}
                            title={item.is_pinned ? "Lepas Pin" : "Sematkan"}
                            className={`p-2 rounded-lg transition-all ${
                                item.is_pinned 
                                ? "bg-orange-50 text-orange-600 shadow-sm" 
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                        >
                           <Pin className={`w-4 h-4 ${item.is_pinned ? 'fill-current' : ''}`} />
                        </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                         <Calendar className="w-3.5 h-3.5" />
                         {new Date(item.publish_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => openEditModal(item)}
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-500">
                Halaman {pagination.page} dari {totalPages} ({pagination.total} Data)
            </span>
            <div className="flex gap-2">
                <button 
                    disabled={pagination.page === 1}
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Sebelumnya
                </button>
                <button 
                    disabled={pagination.page >= totalPages}
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Selanjutnya
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar activeTab="/admin/announcements" /> {/* Sidebar Integrasi */}
      
      <main className="ml-80 p-6 md:p-8">
        {viewMode === "dashboard" ? renderDashboard() : renderList()}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h2 className="text-lg font-bold text-gray-900">
                          {isEditing ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
                      </h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
                  </div>
                  
                  <div className="overflow-y-auto p-6 space-y-5 custom-scrollbar">
                      <form id="announcementForm" onSubmit={handleSubmit} className="space-y-5">
                          
                          <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">Gambar Cover</label>
                              <div className="flex gap-5">
                                  <div className="w-32 h-32 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden flex-shrink-0 group">
                                      {previewImage ? (
                                          <>
                                              <Image src={previewImage} alt="Preview" fill className="object-cover" />
                                              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-xs">Ubah</div>
                                          </>
                                      ) : (
                                          <div className="text-center p-2">
                                              <div className="mx-auto w-8 h-8 text-gray-400 mb-1"><LayoutGrid /></div>
                                              <span className="text-xs text-gray-500">Upload</span>
                                          </div>
                                      )}
                                      <input 
                                          type="file" 
                                          accept="image/*"
                                          onChange={handleFileChange}
                                          className="absolute inset-0 opacity-0 cursor-pointer"
                                      />
                                  </div>
                                  <div className="flex-1 space-y-2 text-sm text-gray-500 pt-2">
                                      <p>Format yang didukung: JPG, PNG, WEBP.</p>
                                      <p>Ukuran maksimal 5MB. Gambar ini akan muncul di halaman detail dan thumbnail list.</p>
                                  </div>
                              </div>
                          </div>

                          <div className="space-y-1">
                              <label className="block text-sm font-semibold text-gray-700">Judul Pengumuman</label>
                              <input 
                                  name="title"
                                  type="text"
                                  required
                                  placeholder="Contoh: Pembaruan Sistem Versi 2.0"
                                  value={formData.title}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                              />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="space-y-1">
                                  <label className="block text-sm font-semibold text-gray-700">Kategori</label>
                                  <select 
                                      name="category"
                                      value={formData.category}
                                      onChange={handleInputChange}
                                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                  >
                                      <option value="news">Berita</option>
                                      <option value="update">Update Aplikasi</option>
                                      <option value="maintenance">Maintenance</option>
                                      <option value="event">Event</option>
                                  </select>
                              </div>
                              <div className="space-y-1">
                                  <label className="block text-sm font-semibold text-gray-700">Jadwal Terbit</label>
                                  <input 
                                      name="publish_at"
                                      type="datetime-local"
                                      required
                                      value={formData.publish_at}
                                      onChange={handleInputChange}
                                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                  />
                              </div>
                          </div>

                          <div className="space-y-1">
                              <label className="block text-sm font-semibold text-gray-700">Isi Konten</label>
                              <textarea 
                                  name="content"
                                  required
                                  rows={6}
                                  placeholder="Tuliskan detail pengumuman di sini..."
                                  value={formData.content}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                              />
                          </div>

                          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                      type="checkbox" 
                                      name="is_pinned"
                                      id="is_pinned"
                                      checked={formData.is_pinned}
                                      onChange={handleCheckboxChange}
                                      className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                              </div>
                              <div>
                                  <label htmlFor="is_pinned" className="block text-sm font-medium text-gray-900 cursor-pointer">Sematkan di Atas (Pin)</label>
                                  <p className="text-xs text-gray-500">Pengumuman ini akan muncul paling atas di halaman user.</p>
                              </div>
                          </div>

                      </form>
                  </div>

                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                      <button 
                          onClick={() => setIsModalOpen(false)}
                          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                          Batal
                      </button>
                      <button 
                          type="submit" 
                          form="announcementForm"
                          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:scale-[1.02]"
                      >
                          {isEditing ? "Simpan Perubahan" : "Publikasikan"}
                      </button>
                  </div>
              </div>
          </div>
        )}
      </main>
    </div>
  );
}