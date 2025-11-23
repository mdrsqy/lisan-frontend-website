"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/sidebar";
import { useAuthStore } from "../../../lib/authStore";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import { Pencil, Trash2, ArrowUp } from "lucide-react";
import NotificationStack from "../../../components/ui/notification";

interface Announcement {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  is_active: "active" | "inactive";
}

export default function AnnouncementManagementClient() {
  const { user, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    video_url: "",
    is_active: "active" as "active" | "inactive",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
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

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal mengambil data pengumuman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) fetchAnnouncements();
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const payload = { ...formData };
      if (editingId) {
        await api.put(`/announcements/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Pengumuman berhasil diperbarui!");
      } else {
        await api.post("/announcements", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Pengumuman berhasil dibuat!");
      }
      setFormData({
        title: "",
        description: "",
        image_url: "",
        video_url: "",
        is_active: "active",
      });
      setEditingId(null);
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menyimpan pengumuman");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/announcements/${deleteModal.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Pengumuman berhasil dihapus!");
      setDeleteModal({ open: false, id: null });
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal menghapus pengumuman");
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#e7e9ea]">
      <NotificationStack />
      <Sidebar activeTab="/admin/announcement-management" />
      <main className="flex-1 p-8 space-y-8 relative">
        <h1 className="text-3xl font-bold text-white mb-6">Manajemen Pengumuman</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0d1117] border border-[#64b5f6]/40 rounded-2xl shadow-xl p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-[#64b5f6]">
            {editingId ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Judul"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="p-3 rounded-lg bg-[#10161d] border border-[#64b5f6]/30 text-white focus:ring-2 focus:ring-[#64b5f6]/60"
            />
            <input
              type="text"
              placeholder="URL Gambar"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="p-3 rounded-lg bg-[#10161d] border border-[#64b5f6]/30 text-white focus:ring-2 focus:ring-[#64b5f6]/60"
            />
            <input
              type="text"
              placeholder="URL Video"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="p-3 rounded-lg bg-[#10161d] border border-[#64b5f6]/30 text-white focus:ring-2 focus:ring-[#64b5f6]/60"
            />
            <textarea
              placeholder="Deskripsi"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="p-3 rounded-lg bg-[#10161d] border border-[#64b5f6]/30 text-white focus:ring-2 focus:ring-[#64b5f6]/60 md:col-span-2"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: "active" })}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                  formData.is_active === "active"
                    ? "bg-green-500 text-white shadow-[0_0_10px_#22c55e]/60"
                    : "bg-[#222] text-gray-400 hover:bg-green-600/40 hover:text-white"
                }`}
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: "inactive" })}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                  formData.is_active === "inactive"
                    ? "bg-red-500 text-white shadow-[0_0_10px_#ef4444]/60"
                    : "bg-[#222] text-gray-400 hover:bg-red-600/40 hover:text-white"
                }`}
              >
                Nonaktif
              </button>
            </div>

            <button
              type="submit"
              className="bg-[#64b5f6] text-black px-6 py-2 rounded-xl font-semibold hover:bg-[#74c0fa] transition-all hover:shadow-[0_0_15px_#64b5f6]/60"
            >
              {editingId ? "Perbarui" : "Buat"}
            </button>
          </div>
        </form>

        <div className="bg-[#0d1117] border border-[#64b5f6]/40 rounded-2xl shadow-xl p-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#10161d] text-[#64b5f6]">
                <th className="px-4 py-3 text-left rounded-tl-xl">Judul</th>
                <th className="px-4 py-3 text-left">Deskripsi</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-[#64b5f6]">
                    Memuat...
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-400">
                    Tidak ada pengumuman
                  </td>
                </tr>
              ) : (
                announcements.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-[#64b5f6]/10 hover:bg-[#64b5f6]/10 transition"
                  >
                    <td className="px-4 py-3 font-medium">{a.title}</td>
                    <td className="px-4 py-3 text-gray-300">{a.description}</td>
                    <td className="px-4 py-3 text-center">
                      {a.is_active === "active" ? (
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-medium">
                          Aktif
                        </span>
                      ) : (
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm font-medium">
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setFormData({
                              title: a.title,
                              description: a.description,
                              image_url: a.image_url || "",
                              video_url: a.video_url || "",
                              is_active: a.is_active,
                            });
                            setEditingId(a.id);
                          }}
                          className="bg-[#64b5f6]/20 hover:bg-[#64b5f6]/40 text-[#64b5f6] px-3 py-1.5 rounded-lg transition-all hover:shadow-[0_0_10px_#64b5f6]/40"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: a.id })}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg transition-all hover:shadow-[0_0_10px_#ff4d4d]/40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-[#64b5f6] hover:bg-[#74c0fa] text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_#64b5f6]/60"
            aria-label="Back to top"
          >
            <ArrowUp size={22} />
          </button>
        )}

        {deleteModal.open && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#0d1117] border border-[#64b5f6]/40 rounded-2xl p-6 w-[90%] max-w-sm text-center space-y-4">
              <h3 className="text-lg font-semibold text-white">Konfirmasi Hapus</h3>
              <p className="text-gray-300">Apakah kamu yakin ingin menghapus pengumuman ini?</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setDeleteModal({ open: false, id: null })}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}