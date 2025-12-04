"use client";

import Image from "next/image";
import { X, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { ChangeEvent, FormEvent } from "react";
import { LevelFormData } from "@/lib/gamificationStore";

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: LevelFormData;
  setFormData: React.Dispatch<React.SetStateAction<LevelFormData>>;
  onSubmit: (e: FormEvent) => void;
  previewImage: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function LevelModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSubmit,
  previewImage,
  onFileChange
}: LevelModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">{isEditing ? "Edit Level" : "Buat Level Baru"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
            {/* Icon Upload */}
            <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 hover:border-indigo-400 flex items-center justify-center overflow-hidden group cursor-pointer bg-slate-50">
                    {previewImage ? (
                        <Image src={previewImage} alt="Icon" fill className="object-cover" />
                    ) : (
                        <Upload className="w-8 h-8 text-slate-400" />
                    )}
                    <input type="file" accept="image/*" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Nama Level <span className="text-red-500">*</span></label>
                <input 
                    type="text" required value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    placeholder="Contoh: Pejuang Isyarat"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Level No <span className="text-red-500">*</span></label>
                    <input 
                        type="number" required value={formData.level_number}
                        onChange={e => setFormData({...formData, level_number: Number(e.target.value)})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Min Score <span className="text-red-500">*</span></label>
                    <input 
                        type="number" required value={formData.min_score}
                        onChange={e => setFormData({...formData, min_score: Number(e.target.value)})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 border">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">Simpan</button>
            </div>
        </form>
      </motion.div>
    </motion.div>
  );
}