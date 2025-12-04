"use client";

import { create } from "zustand";
import api from "@/lib/api";

export interface Level {
  id: string;
  level_number: number;
  name: string;
  min_score: number;
  icon_url: string | null;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  target_value: number;
  activity_id: string | null;
  created_at: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  profile_picture: string | null;
  score: number;
  role: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface LevelFormData {
  name: string;
  level_number: number;
  min_score: number;
  icon: File | null;
}

export interface BadgeFormData {
  name: string;
  description: string;
  tier: string;
  target_value: number;
  activity_id: string;
  image: File | null;
}

interface GamificationStore {
  levels: Level[];
  badges: Badge[];
  leaderboard: LeaderboardUser[];
  
  loading: boolean;
  
  // Pagination State
  badgePagination: Pagination;
  leaderboardPagination: Pagination;
  
  // Filters
  badgeSearch: string;
  badgeSort: string;
  leaderboardSearch: string;

  // Actions
  setBadgeSearch: (v: string) => void;
  setBadgeSort: (v: string) => void;
  setBadgePage: (page: number) => void;
  
  setLeaderboardSearch: (v: string) => void;
  setLeaderboardPage: (page: number) => void;

  // API Calls
  fetchLevels: () => Promise<void>;
  createLevel: (data: LevelFormData) => Promise<any>;
  updateLevel: (id: string, data: LevelFormData) => Promise<any>;
  deleteLevel: (id: string) => Promise<any>;

  fetchBadges: () => Promise<void>;
  createBadge: (data: BadgeFormData) => Promise<any>;
  updateBadge: (id: string, data: BadgeFormData) => Promise<any>;
  deleteBadge: (id: string) => Promise<any>;

  fetchLeaderboard: () => Promise<void>;
}

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  levels: [],
  badges: [],
  leaderboard: [],
  loading: false,

  badgePagination: { page: 1, limit: 10, total: 0, total_pages: 1 },
  leaderboardPagination: { page: 1, limit: 10, total: 0, total_pages: 1 },

  badgeSearch: "",
  badgeSort: "latest",
  leaderboardSearch: "",

  setBadgeSearch: (search) => set((state) => ({ 
    badgeSearch: search, 
    badgePagination: { ...state.badgePagination, page: 1 } 
  })),

  setBadgeSort: (sort) => set((state) => ({ 
    badgeSort: sort, 
    badgePagination: { ...state.badgePagination, page: 1 } 
  })),

  setBadgePage: (page) => set((state) => ({ 
    badgePagination: { ...state.badgePagination, page: page < 1 ? 1 : page } 
  })),

  setLeaderboardSearch: (search) => set((state) => ({ 
    leaderboardSearch: search, 
    leaderboardPagination: { ...state.leaderboardPagination, page: 1 } 
  })),

  setLeaderboardPage: (page) => set((state) => ({ 
    leaderboardPagination: { ...state.leaderboardPagination, page: page < 1 ? 1 : page } 
  })),

  // --- LEVELS ---

  fetchLevels: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/api/gamification/levels");
      set({ levels: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching levels:", error);
      set({ loading: false });
    }
  },

  createLevel: async (form) => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("level_number", form.level_number.toString());
    fd.append("min_score", form.min_score.toString());
    if (form.icon) fd.append("icon", form.icon);

    const res = await api.post("/api/gamification/admin/levels", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await get().fetchLevels();
    return res.data;
  },

  updateLevel: async (id, form) => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("level_number", form.level_number.toString());
    fd.append("min_score", form.min_score.toString());
    if (form.icon) fd.append("icon", form.icon);

    const res = await api.put(`/api/gamification/admin/levels/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await get().fetchLevels();
    return res.data;
  },

  deleteLevel: async (id) => {
    const res = await api.delete(`/api/gamification/admin/levels/${id}`);
    await get().fetchLevels();
    return res.data;
  },

  // --- BADGES ---

  fetchBadges: async () => {
    const { badgePagination, badgeSearch, badgeSort } = get();
    set({ loading: true });

    try {
      const params = new URLSearchParams();
      params.append("page", badgePagination.page.toString());
      params.append("limit", badgePagination.limit.toString());
      if (badgeSearch) params.append("search", badgeSearch);
      params.append("sort", badgeSort);

      const res = await api.get(`/api/gamification/badges?${params.toString()}`);

      set({
        badges: res.data.data,
        badgePagination: res.data.pagination,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching badges:", error);
      set({ loading: false });
    }
  },

  createBadge: async (form) => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("tier", form.tier);
    fd.append("target_value", form.target_value.toString());
    fd.append("activity_id", form.activity_id);
    if (form.image) fd.append("image", form.image);

    const res = await api.post("/api/gamification/admin/badges", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await get().fetchBadges();
    return res.data;
  },

  updateBadge: async (id, form) => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("tier", form.tier);
    fd.append("target_value", form.target_value.toString());
    if (form.activity_id) fd.append("activity_id", form.activity_id);
    if (form.image) fd.append("image", form.image);

    const res = await api.put(`/api/gamification/admin/badges/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await get().fetchBadges();
    return res.data;
  },

  deleteBadge: async (id) => {
    const res = await api.delete(`/api/gamification/admin/badges/${id}`);
    await get().fetchBadges();
    return res.data;
  },

  fetchLeaderboard: async () => {
    const { leaderboardPagination, leaderboardSearch } = get();
    set({ loading: true });

    try {
      const params = new URLSearchParams();
      params.append("page", leaderboardPagination.page.toString());
      params.append("limit", leaderboardPagination.limit.toString());
      if (leaderboardSearch) params.append("search", leaderboardSearch);

      const res = await api.get(`/api/gamification/leaderboard?${params.toString()}`);

      set({
        leaderboard: res.data.data,
        leaderboardPagination: res.data.pagination,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      set({ loading: false });
    }
  },
}));