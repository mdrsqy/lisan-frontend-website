"use client";

import { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { ModuleFormData } from "@/lib/learningStore";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: ModuleFormData;
  setFormData: React.Dispatch<React.SetStateAction<ModuleFormData>>;
  onSubmit: (e: FormEvent) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
}

export function ModuleModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSubmit,
  onFileChange,
  previewImage
}: ModuleModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">{isEditing ? "Edit Modul" : "Buat Modul Baru"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
            {/* Thumbnail Upload */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Thumbnail Modul</label>
                <div className="relative w-full h-40 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 flex items-center justify-center overflow-hidden group cursor-pointer bg-slate-50 transition-colors">
                    {previewImage ? (
                        <Image src={previewImage} alt="Thumbnail" fill className="object-cover" />
                    ) : (
                        <div className="text-center text-slate-400">
                            <Upload className="w-8 h-8 mx-auto mb-2" />
                            <span className="text-xs">Upload Gambar</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Judul Modul <span className="text-red-500">*</span></label>
                <input 
                    type="text" required value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    placeholder="Contoh: Pengenalan Abjad"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Deskripsi</label>
                <textarea 
                    rows={3} required value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                    placeholder="Deskripsi singkat tentang modul ini..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Level Kesulitan (1-5)</label>
                    <input 
                        type="number" min="1" max="5" required value={formData.difficulty_level}
                        onChange={e => setFormData({...formData, difficulty_level: Number(e.target.value)})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Urutan</label>
                    <input 
                        type="number" required value={formData.order_index}
                        onChange={e => setFormData({...formData, order_index: Number(e.target.value)})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <input 
                    type="checkbox" id="is_premium" 
                    checked={formData.is_premium} 
                    onChange={e => setFormData({...formData, is_premium: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="is_premium" className="text-sm font-bold text-slate-700 cursor-pointer">Konten Premium (Berbayar)</label>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 border">Batal</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">Simpan Modul</button>
            </div>
        </form>
      </motion.div>
    </motion.div>
  );
}