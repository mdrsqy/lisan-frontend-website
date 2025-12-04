"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { 
  HelpCircle, 
  MessageSquare, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { notify } from "@/components/Notification"; 
import { Sidebar } from "@/components/Sidebar"; 
import { HeaderManagement } from "@/components/ui/HeaderManagement";
import { ManagementBanner } from "@/components/ui/ManagementBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useSupportStore, FAQFormData, FAQ } from "@/lib/supportStore";
import { FAQModal } from "@/components/admin/support/FAQModal";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function AdminSupportManagementClient() {
  const store = useSupportStore();
  const [activeTab, setActiveTab] = useState<'faq' | 'feedback'>('faq');

  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [localSearch, setLocalSearch] = useState("");
  const debouncedSearch = useDebounce(localSearch, 500);

  const initialFAQForm: FAQFormData = { question: "", answer: "", category: "general", is_published: true };
  const [faqForm, setFaqForm] = useState<FAQFormData>(initialFAQForm);

  useEffect(() => {
    if (activeTab === 'faq') {
      store.setFaqSearch(debouncedSearch);
      store.fetchAdminFaqs();
    } else {
      store.setFeedbackSearch(debouncedSearch);
      store.fetchAdminFeedbacks();
    }
  }, [activeTab, debouncedSearch]);

  const openCreateFAQ = () => {
    setFaqForm(initialFAQForm);
    setIsEditing(false);
    setIsFAQModalOpen(true);
  };

  const openEditFAQ = (item: FAQ) => {
    setFaqForm({ 
        question: item.question, 
        answer: item.answer, 
        category: item.category, 
        is_published: item.is_published 
    });
    setSelectedId(item.id);
    setIsEditing(true);
    setIsFAQModalOpen(true);
  };

  const handleFAQSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        if (isEditing && selectedId) {
            await store.updateFAQ(selectedId, faqForm);
            notify("success", "FAQ diperbarui");
        } else {
            await store.createFAQ(faqForm);
            notify("success", "FAQ dibuat");
        }
        setIsFAQModalOpen(false);
    } catch (e) { notify("error", "Gagal menyimpan FAQ"); }
  };

  const handleDeleteFAQ = async (id: string) => {
    if(!confirm("Hapus FAQ ini?")) return;
    try { await store.deleteFAQ(id); notify("success", "FAQ dihapus"); } catch { notify("error", "Gagal hapus"); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
        await store.updateFeedbackStatus(id, status);
        notify("success", "Status diperbarui");
    } catch { notify("error", "Gagal update status"); }
  };

  const handleDeleteFeedback = async (id: string) => {
    if(!confirm("Hapus masukan ini?")) return;
    try { await store.deleteFeedback(id); notify("success", "Masukan dihapus"); } catch { notify("error", "Gagal hapus"); }
  };

  const renderFAQTable = () => (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 font-semibold text-slate-500 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Pertanyaan</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                    {store.faqs.length === 0 && !store.loading ? (
                         <tr><td colSpan={4} className="text-center py-20 text-slate-400">Belum ada data FAQ.</td></tr>
                    ) : (
                        store.faqs.map((faq) => (
                            <tr key={faq.id} className="hover:bg-white/60 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-700 line-clamp-1 group-hover:text-indigo-600 transition-colors">{faq.question}</p>
                                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{faq.answer}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-600 capitalize shadow-sm">
                                        {faq.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm ${
                                        faq.is_published 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                        : 'bg-slate-50 text-slate-500 border-slate-200'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${faq.is_published ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                        {faq.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openEditFAQ(faq)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteFAQ(faq.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderFeedbackTable = () => (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 font-semibold text-slate-500 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Pesan</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                    {store.feedbacks.length === 0 && !store.loading ? (
                         <tr><td colSpan={4} className="text-center py-20 text-slate-400">Belum ada masukan.</td></tr>
                    ) : (
                        store.feedbacks.map((fb) => (
                            <tr key={fb.id} className="hover:bg-white/60 transition-colors group">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden text-indigo-600 font-bold text-xs border border-indigo-200 shadow-sm">
                                        {fb.users?.profile_picture ? (
                                            <Image src={fb.users.profile_picture} alt="" fill className="object-cover" />
                                        ) : (
                                            fb.users?.name?.[0] || "?"
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-xs group-hover:text-indigo-600 transition-colors">{fb.users?.name || "Anonim"}</p>
                                        <p className="text-[10px] text-slate-400">{fb.users?.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <p className="font-bold text-slate-700 text-xs mb-0.5">{fb.subject}</p>
                                    <p className="text-xs text-slate-500 line-clamp-2">{fb.message}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="relative">
                                        <select 
                                            value={fb.status}
                                            onChange={(e) => handleStatusChange(fb.id, e.target.value)}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer appearance-none pr-6 shadow-sm transition-colors focus:ring-2 focus:ring-offset-1 ${
                                                fb.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 focus:ring-emerald-500' :
                                                fb.status === 'read' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 focus:ring-blue-500' :
                                                'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 focus:ring-amber-500'
                                            }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="read">Dibaca</option>
                                            <option value="resolved">Selesai</option>
                                        </select>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDeleteFeedback(fb.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* Static Background for Better Performance */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50">
         <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px]" />
         <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-fuchsia-200/40 rounded-full blur-[120px]" />
         <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] bg-cyan-200/40 rounded-full blur-[120px]" />
      </div>

      <Sidebar activeTab="/admin/support-management" />
      
      <main className="ml-80 p-8 relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
            <HeaderManagement 
                title="FAQ & Masukkan" 
                subtitle="Kelola pertanyaan umum (FAQ) dan pantau masukan atau laporan dari pengguna."
                breadcrumbs={[{ label: "Support", active: true }]}
            />

            <ManagementBanner 
                badgeText="Pusat Bantuan"
                badgeIcon={<HelpCircle className="w-3.5 h-3.5" />}
                title="Layanan Dukungan Pengguna"
                description="Pastikan pengguna mendapatkan informasi yang jelas dan respon cepat atas kendala mereka."
            />

            {/* Tabs & Toolbar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-white/60 backdrop-blur-md p-2 rounded-3xl border border-white/50 shadow-sm sticky top-4 z-30">
                <div className="flex gap-1 bg-slate-100/50 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                            activeTab === 'faq' 
                            ? "bg-white text-indigo-600 shadow-md shadow-slate-200 scale-100" 
                            : "text-slate-500 hover:bg-white/50 hover:text-indigo-500 scale-95"
                        }`}
                    >
                        <HelpCircle className="w-4 h-4" />
                        FAQ Database
                    </button>
                    <button
                        onClick={() => setActiveTab('feedback')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                            activeTab === 'feedback' 
                            ? "bg-white text-indigo-600 shadow-md shadow-slate-200 scale-100" 
                            : "text-slate-500 hover:bg-white/50 hover:text-indigo-500 scale-95"
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Feedback User
                    </button>
                </div>

                <div className="flex gap-3 w-full md:w-auto px-2">
                    <div className="relative flex-1 md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" placeholder={activeTab === 'faq' ? "Cari pertanyaan..." : "Cari subjek..."}
                            value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
                        />
                    </div>
                    {activeTab === 'faq' && (
                        <button onClick={openCreateFAQ} className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105 active:scale-95">
                            <Plus className="w-4 h-4" /> Buat FAQ
                        </button>
                    )}
                </div>
            </div>

            <div className="transition-all duration-300">
                {activeTab === 'faq' ? renderFAQTable() : renderFeedbackTable()}
            </div>
        </div>
      </main>

      <LoadingSpinner isLoading={store.loading} />

      <FAQModal 
        isOpen={isFAQModalOpen} onClose={() => setIsFAQModalOpen(false)}
        isEditing={isEditing} formData={faqForm} setFormData={setFaqForm}
        onSubmit={handleFAQSubmit}
      />
    </div>
  );
}