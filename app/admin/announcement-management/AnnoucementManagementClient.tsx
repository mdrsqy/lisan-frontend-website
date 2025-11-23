"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../../components/sidebar";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import { Pencil, Trash2, ArrowUp, Plus } from "lucide-react";
import NotificationStack from "../../../components/ui/notification";

interface Announcement {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

export default function AnnouncementManagementClient() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null as string | null });

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    is_active: true,
  });

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "created_at">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (savedUser && token) setUser(JSON.parse(savedUser));
      else router.push("/authentication/signin");
    }
  }, [user, setUser, router]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/announcements", { headers: { Authorization: `Bearer ${token}` } });
      setAnnouncements(Array.isArray(res.data) ? res.data : res.data || []);
    } catch {
      toast.error("Gagal mengambil pengumuman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) fetchAnnouncements();
  }, [mounted]);

  const openCreateModal = () => {
    setFormData({ title: "", message: "", is_active: true });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (a: Announcement) => {
    setFormData({ title: a.title, message: a.message, is_active: a.is_active });
    setEditingId(a.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = {
      user_id: user?.id,
      title: formData.title,
      message: formData.message,
      is_active: formData.is_active,
    };

    try {
      if (editingId) {
        await api.put(`/announcements/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Pengumuman diperbarui");
      } else {
        await api.post(`/announcements`, payload, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Pengumuman dibuat");
      }
      setModalOpen(false);
      fetchAnnouncements();
    } catch {
      toast.error("Gagal menyimpan");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/announcements/${deleteModal.id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Pengumuman dihapus");
      setDeleteModal({ open: false, id: null });
      fetchAnnouncements();
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const toggleActive = async (a: Announcement) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(`/announcements/${a.id}`, { ...a, is_active: !a.is_active }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAnnouncements();
    } catch {
      toast.error("Gagal mengubah status");
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
    let list = announcements.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((u) => u.title.toLowerCase().includes(q) || u.message.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "created_at") {
        return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
      }
      return a.title.localeCompare(b.title) * dir;
    });
    return list;
  }, [announcements, query, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <NotificationStack />
      <Sidebar activeTab="/admin/announcement-management" />

      <main className="flex-1 p-8 relative space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#027dda] drop-shadow-sm">Manajemen Pengumuman</h1>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white border border-[#e6f2ff] rounded-full px-3 py-2 shadow-sm">
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search title or message..."
                className="outline-none px-2 w-44 md:w-72 text-sm bg-transparent"
              />
              <button onClick={() => { setQuery(""); setPage(1); }} className="text-sm text-[#027dda] px-2">Clear</button>
            </div>

            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <div className="flex gap-2">
                <button onClick={() => handleSort("title")} className="px-3 py-2 rounded-full bg-[#f3f7ff] text-[#027dda] border border-[#e6f2ff] text-sm">Sort Title</button>
                <button onClick={() => handleSort("created_at")} className="px-3 py-2 rounded-full bg-[#fff6f4] text-[#c82131] border border-[#f6d2d2] text-sm">Sort Date</button>
              </div>

              <button onClick={openCreateModal} className="flex items-center gap-2 bg-[#027dda] text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl">
                <Plus size={16} /> Buat
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-[#e8f4ff] rounded-3xl p-4 shadow-[0_12px_40px_rgba(2,125,218,0.06)] overflow-hidden">
          <div className="hidden md:block overflow-x-auto rounded-2xl">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-[#f2f8ff] text-[#027dda] text-xs font-semibold">
                  <th className="px-6 py-4 text-left">Judul</th>
                  <th className="px-6 py-4 text-left">Pesan</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e8f4ff]">
                {loading ? (
                  <tr><td colSpan={4} className="py-10 text-center text-[#027dda]">Memuat data...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="py-12 text-center text-gray-400">Belum ada pengumuman</td></tr>
                ) : (
                  paginated.map((a) => (
                    <tr key={a.id} className="hover:bg-[#f5faff] transition-all">
                      <td className="px-6 py-4 font-medium">{a.title}</td>
                      <td className="px-6 py-4">{a.message}</td>

                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(a)}
                            className={`relative w-12 h-6 rounded-full transition-all ${a.is_active ? "bg-[#027dda]" : "bg-gray-200"}`}
                            aria-label="toggle"
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition ${a.is_active ? "translate-x-6" : "translate-x-0"}`} />
                          </button>
                          <span className={`text-xs font-semibold ${a.is_active ? "text-[#027dda]" : "text-gray-500"}`}>{a.is_active ? "Aktif" : "Nonaktif"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => openEditModal(a)} className="p-3 bg-[#fff7e6] rounded-2xl hover:bg-[#fff3d1]">
                            <Pencil size={16} className="text-[#f6bf4b]" />
                          </button>

                          <button onClick={() => setDeleteModal({ open: true, id: a.id })} className="p-3 bg-[#fff0f0] rounded-2xl hover:bg-[#ffdede]">
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
              <div className="text-center py-6 text-[#027dda]">Memuat data...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-6 text-gray-400">Belum ada pengumuman</div>
            ) : (
              paginated.map((a) => (
                <div key={a.id} className="bg-white border border-[#eaf6ff] rounded-3xl p-4 shadow animate-fadeSlide">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900">{a.title}</div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-3">{a.message}</div>
                      <div className="mt-3 flex items-center gap-3">
                        <button onClick={() => toggleActive(a)} className={`relative w-12 h-6 rounded-full transition ${a.is_active ? "bg-[#027dda]" : "bg-gray-200"}`}>
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition ${a.is_active ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                        <span className={`text-xs font-semibold ${a.is_active ? "text-[#027dda]" : "text-gray-500"}`}>{a.is_active ? "Aktif" : "Nonaktif"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="px-3 py-1 rounded-full bg-[#f2f8ff] text-[#027dda] text-xs font-medium">Announcement</div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => openEditModal(a)} className="px-3 py-2 rounded-lg bg-[#fff7e6] text-sm">Edit</button>
                        <button onClick={() => setDeleteModal({ open: true, id: a.id })} className="px-3 py-2 rounded-lg bg-[#fff0f0] text-sm">Delete</button>
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

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const active = p === page;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-full transition ${active ? "bg-[#027dda] text-white shadow-lg" : "bg-white border border-[#e6f2ff] text-[#027dda]"}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-2 rounded-full bg-white border border-[#e6f2ff]">Next</button>
            </div>
          </div>
        </div>

        {showScrollTop && (
          <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-[#027dda] hover:bg-[#0466b3] text-white p-4 rounded-full shadow-xl">
            <ArrowUp size={22} />
          </button>
        )}

        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeSlide">
            <div className="bg-white w-full max-w-xl p-8 rounded-3xl shadow-2xl border space-y-6">
              <h2 className="text-2xl font-semibold">{editingId ? "Edit Pengumuman" : "Buat Pengumuman"}</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Judul" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="p-3 rounded-2xl bg-gray-100 w-full outline-[#027dda]" />
                <textarea placeholder="Isi Pesan" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} required className="p-3 rounded-2xl bg-gray-100 w-full outline-[#027dda]" />

                <div className="flex gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, is_active: true })} className={`px-5 py-2 rounded-2xl font-semibold w-full ${formData.is_active ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}>Aktif</button>
                  <button type="button" onClick={() => setFormData({ ...formData, is_active: false })} className={`px-5 py-2 rounded-2xl font-semibold w-full ${!formData.is_active ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"}`}>Nonaktif</button>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300">Batal</button>
                  <button type="submit" className="px-5 py-2 rounded-2xl bg-[#027dda] hover:bg-[#0466b3] text-white font-semibold">{editingId ? "Simpan" : "Buat"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteModal.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeSlide">
            <div className="bg-white p-6 rounded-3xl w-[90%] max-w-sm space-y-4 shadow-2xl border">
              <h3 className="text-lg font-semibold">Konfirmasi Hapus</h3>
              <p className="text-gray-600">Yakin ingin menghapus?</p>

              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteModal({ open: false, id: null })} className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300">Batal</button>
                <button onClick={handleDelete} className="px-4 py-2 rounded-2xl bg-[#c82131] hover:bg-[#a21828] text-white">Hapus</button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeSlide { animation: fadeSlide 0.32s ease-out; }
        `}</style>
      </main>
    </div>
  );
}