"use client";

import Image from "next/image";
import { X, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { ChangeEvent, FormEvent } from "react";
import { BadgeFormData } from "@/lib/gamificationStore";

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: BadgeFormData;
  setFormData: React.Dispatch<React.SetStateAction<BadgeFormData>>;
  onSubmit: (e: FormEvent) => void;
  previewImage: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function BadgeModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSubmit,
  previewImage,
  onFileChange
}: BadgeModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">{isEditing ? "Edit Badge" : "Buat Badge Baru"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh] custom-scrollbar">
            <div className="flex gap-4">
                {/* Image Upload */}
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 flex items-center justify-center overflow-hidden group cursor-pointer bg-slate-50 relative flex-shrink-0">
                    {previewImage ? (
                        <Image src={previewImage} alt="Icon" fill className="object-cover" />
                    ) : (
                        <div className="text-center">
                            <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                            <span className="text-[10px] text-slate-400">Upload</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Nama Badge <span className="text-red-500">*</span></label>
                        <input 
                            type="text" required value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Tier <span className="text-red-500">*</span></label>
                        <select 
                            value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        >
                            <option value="bronze">Bronze</option>
                            <option value="silver">Silver</option>
                            <option value="gold">Gold</option>
                            <option value="platinum">Platinum</option>
                            <option value="diamond">Diamond</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Deskripsi</label>
                <textarea 
                    rows={3} required value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Target Score/Count</label>
                    <input 
                        type="number" required value={formData.target_value}
                        onChange={e => setFormData({...formData, target_value: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Activity ID (Optional)</label>
                    <input 
                        type="text" value={formData.activity_id}
                        onChange={e => setFormData({...formData, activity_id: e.target.value})}
                        placeholder="UUID Activity"
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
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