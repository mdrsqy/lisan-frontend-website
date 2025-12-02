"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/lib/profileStore";
import { useAuthStore } from "@/lib/authStore";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  AtSign, 
  Camera, 
  Save, 
  Lock, 
  Loader2, 
  Shield, 
  Sparkles,
  ArrowLeft
} from "lucide-react";
import Notification from "@/components/Notification"; 

const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  onClick,
  ...props
}: any) => {
  return (
    <Tag
      className={`relative flex content-center bg-black/20 hover:bg-black/10 transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit rounded-full cursor-pointer ${containerClassName}`}
      onClick={onClick}
      {...props}
    >
      <div className={`w-auto text-white z-10 bg-[#0A0F1C] px-4 py-2 rounded-[inherit] flex items-center gap-2 ${className}`}>
        {children}
      </div>
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: "conic-gradient(from 0deg at 50% 50%, #1e293b 0%, #3b82f6 50%, #1e293b 100%)" }}
        animate={{
          background: "conic-gradient(from 360deg at 50% 50%, #1e293b 0%, #3b82f6 50%, #1e293b 100%)",
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
};

export function AdminProfileClient() {
  const router = useRouter();
  const { user: profile } = useAuthStore();
  const { 
    fetchProfile,
    updateProfile, 
    uploadAvatar, 
    changePassword, 
    isLoading, 
    isUploading 
  } = useProfileStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"details" | "security">("details");
  const [isMounted, setIsMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setIsMounted(true);
    fetchProfile(); 
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        email: profile.email || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const notify = (type: "success" | "error" | "warning" | "info", message: string) => {
    window.dispatchEvent(new CustomEvent("notify", { detail: { type, message } }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      notify("success", "Changes saved successfully");
    } catch (error: any) {
      notify("error", error?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify("error", "New passwords do not match");
      return;
    }

    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      notify("success", "Password updated successfully");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      notify("error", error?.response?.data?.message || "Failed to update password");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar(file);
        notify("success", "Avatar updated successfully");
      } catch (error: any) {
        notify("error", "Failed to upload avatar");
      }
    }
  };

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="min-h-screen w-full bg-[#050b14] text-slate-200 p-8 flex flex-col justify-center">
      <Notification />
      
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      <div className="fixed top-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl w-full mx-auto space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between pb-6 border-b border-white/10"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-500" />
              My Profile
            </h1>
            <p className="text-slate-400 mt-2">Manage your account settings and preferences.</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "details" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "text-slate-400 hover:text-white"}`}
            >
              Details
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === "security" ? "bg-red-500/80 text-white shadow-lg shadow-red-500/25" : "text-slate-400 hover:text-white"}`}
            >
              Security
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="relative overflow-hidden rounded-3xl bg-[#0f1623]/60 backdrop-blur-xl border border-white/10 p-8 flex flex-col items-center text-center shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
              
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/20">
                  <div className="w-full h-full rounded-full bg-[#0A0F1C] overflow-hidden relative">
                    {profile?.profile_picture ? (
                      <img src={profile.profile_picture} alt="Avatar" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-3xl font-bold text-white">
                        {profile?.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                    >
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      ) : (
                        <Camera className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{profile?.name || "Loading..."}</h2>
              <p className="text-slate-400 text-sm mb-4">@{profile?.username}</p>
              
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                {profile?.role || "User"}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f1623]/60 backdrop-blur-xl border border-white/10 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 text-sm">Account Score</span>
                  <span className="text-white font-mono font-bold">{profile?.score || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400 text-sm">Joined Date</span>
                  <span className="text-white font-mono text-sm">
                    {profile?.created_at ? new Date(profile.created_at).getFullYear() : "2024"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8"
          >
            {activeTab === "details" ? (
              <motion.form 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                onSubmit={handleUpdateProfile}
                className="bg-[#0f1623]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#050b14]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
                      <div className="relative group">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full bg-[#050b14]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#050b14]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        placeholder="admin@lisan.app"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full bg-[#050b14]/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                      placeholder="Tell us a little about yourself..."
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                onSubmit={handleChangePassword}
                className="bg-[#0f1623]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-red-400 transition-colors" />
                      <input
                        type="password"
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                        className="w-full bg-[#050b14]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-red-400 transition-colors" />
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full bg-[#050b14]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-red-400 transition-colors" />
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full bg-[#050b14]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Update Password
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-8 left-8 z-50">
        <HoverBorderGradient 
            onClick={() => router.push("/admin/dashboard")} 
            containerClassName="shadow-2xl shadow-blue-900/20"
        >
            <ArrowLeft className="w-5 h-5 text-blue-400" />
            <span className="pr-1 text-sm font-semibold tracking-wide">Kembali</span>
        </HoverBorderGradient>
      </div>

    </div>
  );
}