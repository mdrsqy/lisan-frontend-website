"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  LayoutGrid, 
  List as ListIcon, 
  Crown,
  Gamepad2,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { notify } from "@/components/Notification"; 
import { Sidebar } from "@/components/Sidebar"; 
import { HeaderManagement } from "@/components/ui/HeaderManagement";
import { ManagementBanner } from "@/components/ui/ManagementBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"; 

import { useLearningStore, ModuleFormData, LessonFormData, LearningModule, Lesson } from "@/lib/learningStore";
import { ModuleModal } from "@/components/admin/learning/ModuleModal";
import { LessonModal } from "@/components/admin/learning/LessonModal";

export default function AdminLearningManagementClient() {
  const store = useLearningStore();
  const [activeTab, setActiveTab] = useState<'modules' | 'lessons'>('modules');
  
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const initialModuleForm: ModuleFormData = { title: "", description: "", difficulty_level: 1, is_premium: false, order_index: 1, thumbnail: null };
  const [moduleForm, setModuleForm] = useState<ModuleFormData>(initialModuleForm);

  const initialLessonForm: LessonFormData = { module_id: "", title: "", content: "", type: "video", gesture_target: "", xp_reward: 10, order_index: 1 };
  const [lessonForm, setLessonForm] = useState<LessonFormData>(initialLessonForm);

  useEffect(() => {
    store.fetchModules();
  }, []);

  const openCreateModule = () => {
    setModuleForm(initialModuleForm);
    setPreviewImage(null);
    setIsEditing(false);
    setIsModuleModalOpen(true);
  };

  const openEditModule = (item: LearningModule) => {
    setModuleForm({ 
        title: item.title, description: item.description, difficulty_level: item.difficulty_level, 
        is_premium: item.is_premium, order_index: item.order_index, thumbnail: null 
    });
    setPreviewImage(item.thumbnail_url);
    setSelectedId(item.id);
    setIsEditing(true);
    setIsModuleModalOpen(true);
  };

  const handleModuleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        if (isEditing && selectedId) {
            await store.updateModule(selectedId, moduleForm);
            notify("success", "Modul diperbarui");
        } else {
            await store.createModule(moduleForm);
            notify("success", "Modul dibuat");
        }
        setIsModuleModalOpen(false);
    } catch (e) { notify("error", "Gagal menyimpan modul"); }
  };

  const handleDeleteModule = async (id: string) => {
    if(!confirm("Hapus modul ini? Semua materi di dalamnya akan ikut terhapus.")) return;
    try { await store.deleteModule(id); notify("success", "Modul dihapus"); } catch { notify("error", "Gagal hapus"); }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setPreviewImage(URL.createObjectURL(file));
        setModuleForm(prev => ({ ...prev, thumbnail: file }));
    }
  };

  const openCreateLesson = () => {
    if(store.modules.length === 0) return notify("error", "Buat modul terlebih dahulu");
    
    setLessonForm({...initialLessonForm, module_id: store.currentModule?.id || store.modules[0]?.id || ""});
    setIsEditing(false);
    setIsLessonModalOpen(true);
  };

  const openEditLesson = (item: Lesson) => {
    setLessonForm({
        module_id: item.module_id, title: item.title, content: item.content, type: item.type,
        gesture_target: item.gesture_target || "", xp_reward: item.xp_reward, order_index: item.order_index
    });
    setSelectedId(item.id);
    setIsEditing(true);
    setIsLessonModalOpen(true);
  };

  const handleLessonSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        if (isEditing && selectedId) {
            await store.updateLesson(selectedId, lessonForm);
            notify("success", "Materi diperbarui");
        } else {
            await store.createLesson(lessonForm);
            notify("success", "Materi dibuat");
        }
        setIsLessonModalOpen(false);
        if(store.currentModule?.id === lessonForm.module_id) {
            store.fetchModuleDetail(lessonForm.module_id);
        }
    } catch (e) { notify("error", "Gagal menyimpan materi"); }
  };

  const handleDeleteLesson = async (id: string) => {
    if(!confirm("Hapus materi ini?")) return;
    try { 
        await store.deleteLesson(id); 
        notify("success", "Materi dihapus");
        if(store.currentModule) store.fetchModuleDetail(store.currentModule.id);
    } catch { notify("error", "Gagal hapus"); }
  };

  const handleViewModule = async (id: string) => {
    await store.fetchModuleDetail(id);
    setActiveTab('lessons');
  };

  const renderModules = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {store.modules.map((mod) => (
            <div key={mod.id} className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group flex flex-col relative z-10">
                <div 
                    className="relative h-48 w-full bg-slate-100 cursor-pointer" 
                    onClick={() => handleViewModule(mod.id)}
                >
                    {mod.thumbnail_url ? (
                        <Image src={mod.thumbnail_url} alt={mod.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-300"><LayoutGrid className="w-12 h-12" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    
                    {mod.is_premium && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-sm z-20">
                            <Crown className="w-3 h-3" /> PREMIUM
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-xs font-medium z-20">
                        Level {mod.difficulty_level}
                    </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 
                            className="text-lg font-bold text-slate-800 line-clamp-1 cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() => handleViewModule(mod.id)}
                        >
                            {mod.title}
                        </h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">#{mod.order_index}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">{mod.description}</p>
                    
                    <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => handleViewModule(mod.id)} 
                            className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <ListIcon className="w-4 h-4" /> Materi
                        </button>
                        <button onClick={() => openEditModule(mod)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteModule(mod.id)} className="p-2 text-slate-400 hover:bg-rose-50 rounded-xl hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        ))}
        <button onClick={openCreateModule} className="min-h-[300px] rounded-[2rem] border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-3 bg-white/50 backdrop-blur-sm">
            <div className="p-4 rounded-full bg-white shadow-sm"><Plus className="w-8 h-8" /></div>
            <span className="font-bold">Tambah Modul Baru</span>
        </button>
    </div>
  );

  const renderLessons = () => {
    const lessons = store.currentModule?.lessons || [];
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActiveTab('modules')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">{store.currentModule?.title || "Semua Materi"}</h3>
                        <p className="text-xs text-slate-500 font-medium">{lessons.length} Materi tersedia</p>
                    </div>
                </div>
                <button onClick={openCreateLesson} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105">
                    <Plus className="w-4 h-4" /> Tambah Materi
                </button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/80 border-b border-slate-200 font-semibold text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 text-center w-16">#</th>
                            <th className="px-6 py-4">Judul Materi</th>
                            <th className="px-6 py-4">Tipe</th>
                            <th className="px-6 py-4">Reward</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {lessons.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-20 text-slate-400">Belum ada materi di modul ini.</td></tr>
                        ) : (
                            lessons.map((lesson) => (
                                <tr key={lesson.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-center font-bold text-slate-400">{lesson.order_index}</td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{lesson.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase ${
                                            lesson.type === 'video' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            lesson.type === 'gesture_practice' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            'bg-orange-50 text-orange-700 border-orange-200'
                                        }`}>
                                            {lesson.type === 'video' && <Video className="w-3 h-3" />}
                                            {lesson.type === 'gesture_practice' && <Gamepad2 className="w-3 h-3" />}
                                            {lesson.type === 'quiz' && <FileText className="w-3 h-3" />}
                                            {lesson.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-amber-600">+{lesson.xp_reward} XP</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openEditLesson(lesson)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteLesson(lesson.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50">
            <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-fuchsia-200/40 rounded-full blur-[120px]" />
            <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] bg-cyan-200/40 rounded-full blur-[120px]" />
        </div>

        <Sidebar activeTab="/admin/learning-management" />
        
        <main className="ml-80 p-8 relative z-10 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                <HeaderManagement 
                    title="Manajemen Pembelajaran" 
                    subtitle="Atur kurikulum, modul, dan materi pembelajaran bahasa isyarat."
                    breadcrumbs={[{ label: "Learning", active: true }]}
                />

                <ManagementBanner 
                    badgeText="LMS System"
                    badgeIcon={<BookOpen className="w-3.5 h-3.5" />}
                    title="Kurikulum Terstruktur"
                    description="Kelola modul video, latihan gestur AI, dan kuis untuk pengguna."
                />

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'modules' ? renderModules() : renderLessons()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>

        <LoadingSpinner isLoading={store.loading} />

        <ModuleModal 
            isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)}
            isEditing={isEditing} formData={moduleForm} setFormData={setModuleForm}
            onSubmit={handleModuleSubmit} previewImage={previewImage} onFileChange={handleFileChange}
        />
        <LessonModal 
            isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)}
            isEditing={isEditing} formData={lessonForm} setFormData={setLessonForm}
            onSubmit={handleLessonSubmit} modules={store.modules}
        />
    </div>
  );
}