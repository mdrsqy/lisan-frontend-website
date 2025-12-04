"use client";

import { FormEvent } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { LessonFormData, LearningModule } from "@/lib/learningStore";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: LessonFormData;
  setFormData: React.Dispatch<React.SetStateAction<LessonFormData>>;
  onSubmit: (e: FormEvent) => void;
  modules: LearningModule[];
}

export function LessonModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSubmit,
  modules
}: LessonModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">{isEditing ? "Edit Materi" : "Buat Materi Baru"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Pilih Modul <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select 
                            required value={formData.module_id}
                            onChange={e => setFormData({...formData, module_id: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
                        >
                            <option value="">-- Pilih Modul --</option>
                            {modules.map(m => (
                                <option key={m.id} value={m.id}>{m.title}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Tipe Materi</label>
                    <div className="relative">
                        <select 
                            required value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none"
                        >
                            <option value="video">Video Pembelajaran</option>
                            <option value="gesture_practice">Latihan Gestur (AI)</option>
                            <option value="quiz">Kuis Pilihan Ganda</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Judul Materi <span className="text-red-500">*</span></label>
                <input 
                    type="text" required value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    placeholder="Contoh: Gerakan Tangan A-E"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Konten / Deskripsi / Video URL</label>
                <textarea 
                    rows={4} required value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                    placeholder="Masukkan deskripsi materi atau link video youtube..."
                />
            </div>

            {formData.type === 'gesture_practice' && (
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Target Gestur (Label AI) <span className="text-red-500">*</span></label>
                    <input 
                        type="text" required value={formData.gesture_target}
                        onChange={e => setFormData({...formData, gesture_target: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-indigo-50 focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono text-sm"
                        placeholder="misal: letter_a"
                    />
                    <p className="text-[10px] text-slate-500">Label harus sesuai dengan model klasifikasi AI.</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">XP Reward</label>
                    <input 
                        type="number" required value={formData.xp_reward}
                        onChange={e => setFormData({...formData, xp_reward: Number(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Urutan Materi</label>
                    <input 
                        type="number" required value={formData.order_index}
                        onChange={e => setFormData({...formData, order_index: Number(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                </div>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 border">Batal</button>
                <button type="submit" className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">Simpan Materi</button>
            </div>
        </form>
      </motion.div>
    </motion.div>
  );
}