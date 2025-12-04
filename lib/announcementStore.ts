"use client";

import { create } from "zustand";
import api from "@/lib/api";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null; // << Baru
  category: string;
  is_pinned: boolean;
  is_active: boolean;
  publish_at: string;
  created_at: string;
  created_by: {
    name: string;
    username: string;
  } | null;
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  publish_at: string;
  video_url: string; // << Baru
  image: File | null;
}

export interface AnnouncementStats {
  total: number;
  active: number;
  pinned: number;
}

interface AnnouncementStore {
  announcements: Announcement[];
  detail: Announcement | null;
  stats: AnnouncementStats;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  search: string;
  category: string;
  status: string;
  sort: string;

  setPage: (page: number) => void;
  setSearch: (v: string) => void;
  setCategory: (v: string) => void;
  setStatus: (v: string) => void;
  setSort: (v: string) => void;

  fetchAdminList: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchDetail: (id: string) => Promise<void>;
  createAnnouncement: (form: AnnouncementFormData) => Promise<any>;
  updateAnnouncement: (id: string, form: AnnouncementFormData) => Promise<any>;
  deleteAnnouncement: (id: string) => Promise<any>;
  toggleStatus: (id: string, is_active: boolean) => Promise<any>;
  togglePin: (id: string, is_pinned: boolean) => Promise<any>;
}

export const useAnnouncementStore = create<AnnouncementStore>((set, get) => ({
  announcements: [],
  detail: null,
  stats: { total: 0, active: 0, pinned: 0 },
  loading: false,
  pagination: { page: 1, limit: 10, total: 0, total_pages: 1 },
  search: "",
  category: "",
  status: "",
  sort: "latest",

  setPage: (page) => set((state) => ({ 
    pagination: { ...state.pagination, page: page < 1 ? 1 : page } 
  })),

  setSearch: (search) => set((state) => ({ 
    search, 
    pagination: { ...state.pagination, page: 1 } 
  })),

  setCategory: (category) => set((state) => ({ 
    category, 
    pagination: { ...state.pagination, page: 1 } 
  })),

  setStatus: (status) => set((state) => ({ 
    status, 
    pagination: { ...state.pagination, page: 1 } 
  })),

  setSort: (sort) => set((state) => ({ 
    sort, 
    pagination: { ...state.pagination, page: 1 } 
  })),

  fetchAdminList: async () => {
    const { pagination, search, category, status, sort } = get();
    set({ loading: true });

    try {
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      
      if (search) params.append("q", search);
      if (category) params.append("category", category);
      if (status) params.append("status", status);
      params.append("sort", sort || "latest");

      const res = await api.get(`/api/announcements/admin/list?${params.toString()}`);

      set({
        announcements: res.data.data,
        pagination: res.data.pagination,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching announcements list:", error);
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/api/announcements/admin/stats");
      set({ stats: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching announcements stats:", error);
      set({ loading: false });
    }
  },

  fetchDetail: async (id: string) => {
    set({ loading: true });
    try {
      const res = await api.get(`/api/announcements/detail/${id}`);
      set({ detail: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching detail:", error);
      set({ loading: false });
    }
  },

  createAnnouncement: async (form: AnnouncementFormData) => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    fd.append("category", form.category);
    fd.append("publish_at", form.publish_at);
    fd.append("is_pinned", String(form.is_pinned));
    
    if (form.video_url) fd.append("video_url", form.video_url);
    if (form.image) fd.append("image", form.image);

    const res = await api.post("/api/announcements/create", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await get().fetchAdminList();
    await get().fetchStats();
    return res.data;
  },

  updateAnnouncement: async (id: string, form: AnnouncementFormData) => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    fd.append("category", form.category);
    fd.append("publish_at", form.publish_at);
    fd.append("is_pinned", String(form.is_pinned));
    
    // Update: Kirim video_url jika ada (atau string kosong untuk menghapus)
    if (form.video_url !== undefined) fd.append("video_url", form.video_url);
    if (form.image) fd.append("image", form.image);

    const res = await api.put(`/api/announcements/update/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await get().fetchAdminList();
    await get().fetchStats();
    return res.data;
  },

  deleteAnnouncement: async (id: string) => {
    const res = await api.delete(`/api/announcements/delete/${id}`);
    await get().fetchAdminList();
    await get().fetchStats();
    return res.data;
  },

  toggleStatus: async (id: string, is_active: boolean) => {
    const res = await api.patch(`/api/announcements/status/${id}`, {
      is_active,
    });
    await get().fetchAdminList();
    await get().fetchStats();
    return res.data;
  },

  togglePin: async (id: string, is_pinned: boolean) => {
    const res = await api.patch(`/api/announcements/pin/${id}`, {
      is_pinned,
    });
    await get().fetchAdminList();
    await get().fetchStats();
    return res.data;
  },
}));