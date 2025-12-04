"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { 
  Trophy, 
  Medal, 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Gamepad2
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { notify } from "@/components/Notification"; 
import { Sidebar } from "@/components/Sidebar"; 
import { HeaderManagement } from "@/components/ui/HeaderManagement";
import { ManagementBanner } from "@/components/ui/ManagementBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"; 
import { useGamificationStore, LevelFormData, BadgeFormData, Level, Badge } from "@/lib/gamificationStore";

import { LevelModal } from "@/components/admin/gamification/LevelModal";
import { BadgeModal } from "@/components/admin/gamification/BadgeModal";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 }
  }
};

const tabVariants: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2, ease: "easeIn" } }
};

export default function AdminGamificationManagementClient() {
  const store = useGamificationStore();
  const [activeTab, setActiveTab] = useState<'levels' | 'badges' | 'leaderboard'>('levels');

  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const initialLevelForm: LevelFormData = { name: "", level_number: 1, min_score: 0, icon: null };
  const [levelForm, setLevelForm] = useState<LevelFormData>(initialLevelForm);

  const initialBadgeForm: BadgeFormData = { name: "", description: "", tier: "bronze", target_value: 0, activity_id: "", image: null };
  const [badgeForm, setBadgeForm] = useState<BadgeFormData>(initialBadgeForm);

  useEffect(() => {
    if (activeTab === 'levels') store.fetchLevels();
    if (activeTab === 'badges') store.fetchBadges();
    if (activeTab === 'leaderboard') store.fetchLeaderboard();
  }, [activeTab]);

  const openCreateLevel = () => {
    setLevelForm(initialLevelForm);
    setPreviewImage(null);
    setIsEditing(false);
    setIsLevelModalOpen(true);
  };

  const openEditLevel = (item: Level) => {
    setLevelForm({ name: item.name, level_number: item.level_number, min_score: item.min_score, icon: null });
    setPreviewImage(item.icon_url);
    setSelectedId(item.id);
    setIsEditing(true);
    setIsLevelModalOpen(true);
  };

  const handleLevelSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        if (isEditing && selectedId) {
            await store.updateLevel(selectedId, levelForm);
            notify("success", "Level diperbarui");
        } else {
            await store.createLevel(levelForm);
            notify("success", "Level dibuat");
        }
        setIsLevelModalOpen(false);
    } catch (e) { notify("error", "Gagal menyimpan level"); }
  };

  const handleDeleteLevel = async (id: string) => {
    if(!confirm("Hapus level ini?")) return;
    try { await store.deleteLevel(id); notify("success", "Level dihapus"); } catch { notify("error", "Gagal hapus"); }
  };

  const openCreateBadge = () => {
    setBadgeForm(initialBadgeForm);
    setPreviewImage(null);
    setIsEditing(false);
    setIsBadgeModalOpen(true);
  };

  const openEditBadge = (item: Badge) => {
    setBadgeForm({ 
        name: item.name, description: item.description, tier: item.tier, 
        target_value: item.target_value, activity_id: item.activity_id || "", image: null 
    });
    setPreviewImage(item.image_url);
    setSelectedId(item.id);
    setIsEditing(true);
    setIsBadgeModalOpen(true);
  };

  const handleBadgeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        if (isEditing && selectedId) {
            await store.updateBadge(selectedId, badgeForm);
            notify("success", "Badge diperbarui");
        } else {
            await store.createBadge(badgeForm);
            notify("success", "Badge dibuat");
        }
        setIsBadgeModalOpen(false);
    } catch (e) { notify("error", "Gagal menyimpan badge"); }
  };

  const handleDeleteBadge = async (id: string) => {
    if(!confirm("Hapus badge ini?")) return;
    try { await store.deleteBadge(id); notify("success", "Badge dihapus"); } catch { notify("error", "Gagal hapus"); }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'level' | 'badge') => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setPreviewImage(URL.createObjectURL(file));
        if (type === 'level') setLevelForm(prev => ({ ...prev, icon: file }));
        else setBadgeForm(prev => ({ ...prev, image: file }));
    }
  };

  const renderLevels = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {store.levels.map((level) => (
            <div key={level.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                    <button onClick={() => openEditLevel(level)} className="p-2 bg-white text-indigo-600 rounded-full shadow-sm hover:bg-indigo-50"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteLevel(level.id)} className="p-2 bg-white text-rose-600 rounded-full shadow-sm hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center relative overflow-hidden border-2 border-indigo-100">
                        {level.icon_url ? <Image src={level.icon_url} alt={level.name} fill className="object-cover" /> : <Trophy className="w-8 h-8 text-indigo-400" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">{level.name}</h3>
                        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mt-1">Level {level.level_number}</p>
                    </div>
                    <div className="w-full pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Min. Score</span>
                            <span className="font-bold text-slate-800">{level.min_score} XP</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        <button onClick={openCreateLevel} className="flex flex-col items-center justify-center gap-3 min-h-[250px] rounded-[2rem] border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all bg-white/50 backdrop-blur-sm">
            <div className="p-4 rounded-full bg-white shadow-sm"><Plus className="w-8 h-8" /></div>
            <span className="font-bold">Tambah Level</span>
        </button>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-6">
        <div className="flex gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" placeholder="Cari badge..." 
                    value={store.badgeSearch} onChange={(e) => store.setBadgeSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                />
            </div>
            <button onClick={openCreateBadge} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700"><Plus className="w-4 h-4" /> Buat Badge</button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 font-semibold text-slate-500 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Badge Info</th>
                        <th className="px-6 py-4">Tier</th>
                        <th className="px-6 py-4">Target</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {store.badges.map((badge) => (
                        <tr key={badge.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 relative overflow-hidden border border-slate-200">
                                    {badge.image_url && <Image src={badge.image_url} alt={badge.name} fill className="object-cover" />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700">{badge.name}</p>
                                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{badge.description}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border 
                                    ${badge.tier === 'bronze' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                                      badge.tier === 'silver' ? 'bg-slate-100 text-slate-600 border-slate-300' : 
                                      badge.tier === 'gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                      'bg-cyan-50 text-cyan-700 border-cyan-200'}`}>
                                    {badge.tier}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-600">{badge.target_value} Actions</td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button onClick={() => openEditBadge(badge)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteBadge(badge.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm relative">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
                type="text" placeholder="Cari user..." 
                value={store.leaderboardSearch} onChange={(e) => store.setLeaderboardSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
            />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 font-semibold text-slate-500 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4 w-16 text-center">Rank</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Username</th>
                        <th className="px-6 py-4 text-right">Total Score</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {store.leaderboard.map((user, idx) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-center font-bold text-slate-400">
                                {idx + 1 + (store.leaderboardPagination.page - 1) * store.leaderboardPagination.limit}
                            </td>
                            <td className="px-6 py-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 relative overflow-hidden">
                                    {user.profile_picture ? (
                                        <Image src={user.profile_picture} alt={user.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-indigo-500 font-bold">{user.name[0]}</div>
                                    )}
                                </div>
                                <span className="font-bold text-slate-700">{user.name}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">@{user.username}</td>
                            <td className="px-6 py-4 text-right font-bold text-indigo-600">{user.score} XP</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-slate-50">
         <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px]" />
         <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-fuchsia-200/40 rounded-full blur-[120px]" />
         <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] bg-cyan-200/40 rounded-full blur-[120px]" />
      </div>

      <Sidebar activeTab="/admin/gamification-management" />
      
      <main className="ml-80 p-8 relative z-10 min-h-screen">
        <motion.div 
            className="max-w-7xl mx-auto space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <HeaderManagement 
                    title="Manajemen Gamifikasi" 
                    subtitle="Atur Level, Lencana (Badge), dan pantau Leaderboard pengguna."
                    breadcrumbs={[{ label: "Gamifikasi", active: true }]}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <ManagementBanner 
                    badgeText="Gamifikasi System"
                    badgeIcon={<Gamepad2 className="w-3.5 h-3.5" />}
                    title="Tingkatkan Engagement User"
                    description="Kelola elemen permainan untuk memotivasi pengguna belajar bahasa isyarat lebih giat."
                />
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-2 p-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 w-fit shadow-sm">
                {[
                    { id: 'levels', label: 'Level System', icon: Trophy },
                    { id: 'badges', label: 'Badges Collection', icon: Medal },
                    { id: 'leaderboard', label: 'Leaderboard', icon: Users },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.id 
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab}
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {activeTab === 'levels' && renderLevels()}
                    {activeTab === 'badges' && renderBadges()}
                    {activeTab === 'leaderboard' && renderLeaderboard()}
                </motion.div>
            </AnimatePresence>
        </motion.div>
      </main>

      <LoadingSpinner isLoading={store.loading} />

      <LevelModal 
        isOpen={isLevelModalOpen} onClose={() => setIsLevelModalOpen(false)}
        isEditing={isEditing} formData={levelForm} setFormData={setLevelForm}
        onSubmit={handleLevelSubmit} previewImage={previewImage} onFileChange={(e) => handleFileChange(e, 'level')}
      />
      <BadgeModal 
        isOpen={isBadgeModalOpen} onClose={() => setIsBadgeModalOpen(false)}
        isEditing={isEditing} formData={badgeForm} setFormData={setBadgeForm}
        onSubmit={handleBadgeSubmit} previewImage={previewImage} onFileChange={(e) => handleFileChange(e, 'badge')}
      />
    </div>
  );
}