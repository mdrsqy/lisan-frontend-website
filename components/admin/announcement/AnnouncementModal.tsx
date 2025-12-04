"use client";

import { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { X, LayoutGrid, Video, Link as LinkIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { AnnouncementFormData } from "@/lib/announcementStore";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: AnnouncementFormData;
  setFormData: React.Dispatch<React.SetStateAction<AnnouncementFormData>>;
  onSubmit: (e: FormEvent) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
}

export function AnnouncementModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSubmit,
  onFileChange,
  previewImage
}: AnnouncementModalProps) {
  if (!isOpen) return null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  return (
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
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
            </button>
        </div>
        
        <div className="overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <form id="announcementForm" onSubmit={onSubmit} className="space-y-6">
                
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
                                    <div className="mx-auto w-10 h-10 text-slate-300 mb-2"><LayoutGrid /></div>
                                    <span className="text-xs font-semibold text-slate-400">Upload</span>
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={onFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex-1 space-y-2 text-sm text-slate-500 pt-2">
                            <p className="font-medium text-slate-600">Media Visual:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                                <li>Upload gambar (.jpg, .png) atau <strong>GIF</strong> disini.</li>
                                <li>Untuk video panjang, gunakan field Link Video di bawah.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700">
                        Judul Pengumuman <span className="text-red-500 ml-0.5">*</span>
                    </label>
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

                <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Video className="w-4 h-4 text-indigo-500" />
                        Link Video / GIF (Opsional)
                    </label>
                    <div className="relative">
                        <input 
                            name="video_url"
                            type="url"
                            placeholder="https://youtube.com/... atau link .mp4/.gif"
                            value={formData.video_url || ""}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-5 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-300"
                        />
                        <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1">Masukkan link YouTube, file MP4, atau link GIF eksternal.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">
                            Kategori <span className="text-red-500 ml-0.5">*</span>
                        </label>
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
                        <label className="block text-sm font-bold text-slate-700">
                            Jadwal Terbit <span className="text-red-500 ml-0.5">*</span>
                        </label>
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
                    <label className="block text-sm font-bold text-slate-700">
                        Isi Konten <span className="text-red-500 ml-0.5">*</span>
                    </label>
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
                onClick={onClose}
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
  );
}