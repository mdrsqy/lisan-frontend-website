"use client";

import Image from "next/image";
import { LayoutGrid, Video, Edit, Trash2, Calendar, Pin } from "lucide-react";
import { Announcement } from "@/lib/announcementStore";

interface AnnouncementTableProps {
  data: Announcement[];
  loading: boolean;
  onEdit: (item: Announcement) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onTogglePin: (id: string, currentPin: boolean) => void;
}

export function AnnouncementTable({ 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onTogglePin 
}: AnnouncementTableProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-white/60 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/60 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 rounded-tl-[1.5rem]">Info Pengumuman</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Prioritas</th>
                <th className="px-6 py-4">Tanggal Terbit</th>
                <th className="px-6 py-4 text-right rounded-tr-[1.5rem]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {data.length === 0 && !loading ? (
                <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-medium">Tidak ada data ditemukan.</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-white/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden relative border border-slate-200 shadow-sm group-hover:border-indigo-200 transition-colors">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                          ) : (
                            <LayoutGrid className="w-6 h-6 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                          
                          {item.video_url && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="p-1 bg-white/20 backdrop-blur-sm rounded-full">
                                    <Video className="w-4 h-4 text-white fill-white" />
                                </div>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-700 truncate max-w-[200px]">{item.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Oleh: {item.created_by?.name || "Admin"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-600 capitalize shadow-sm">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onToggleStatus(item.id, item.is_active)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                          item.is_active 
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200" 
                          : "bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => onTogglePin(item.id, item.is_pinned)}
                            title={item.is_pinned ? "Lepas Pin" : "Sematkan"}
                            className={`p-2 rounded-xl transition-all ${
                                item.is_pinned 
                                ? "bg-orange-100 text-orange-600 shadow-sm border border-orange-200" 
                                : "text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                            }`}
                        >
                           <Pin className={`w-4 h-4 ${item.is_pinned ? 'fill-current' : ''}`} />
                        </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-medium text-xs">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                             <Calendar className="w-3.5 h-3.5" />
                          </div>
                          {new Date(item.publish_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <button 
                                onClick={() => onEdit(item)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => onDelete(item.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
    </div>
  );
}