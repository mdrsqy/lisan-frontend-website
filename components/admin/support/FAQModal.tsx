"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { ChangeEvent, FormEvent } from "react";
import { FAQFormData } from "@/lib/supportStore";

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: FAQFormData;
  setFormData: React.Dispatch<React.SetStateAction<FAQFormData>>;
  onSubmit: (e: FormEvent) => void;
}

export function FAQModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSubmit
}: FAQModalProps) {
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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">{isEditing ? "Edit FAQ" : "Buat FAQ Baru"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Pertanyaan <span className="text-red-500">*</span></label>
                <input 
                    type="text" name="question" required value={formData.question}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    placeholder="Misal: Bagaimana cara mengganti password?"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Jawaban <span className="text-red-500">*</span></label>
                <textarea 
                    name="answer" rows={4} required value={formData.answer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                    placeholder="Tulis jawaban lengkap di sini..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">Kategori</label>
                    <select 
                        name="category" value={formData.category} onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    >
                        <option value="general">Umum</option>
                        <option value="account">Akun</option>
                        <option value="payment">Pembayaran</option>
                        <option value="technical">Teknis</option>
                    </select>
                </div>
                <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative inline-flex items-center">
                            <input 
                                type="checkbox" name="is_published" 
                                checked={formData.is_published} onChange={handleCheckboxChange} 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">Publikasikan Langsung</span>
                    </label>
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