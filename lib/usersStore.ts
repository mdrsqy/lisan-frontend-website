"use client";

import { create } from "zustand";
import api from "@/lib/api";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_premium: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface UserStats {
  users: number;
  admins: number;
  premium: number;
  unverified: number;
}

interface UsersState {
  users: User[];
  stats: UserStats | null;
  currentUser: User | null;
  isLoading: boolean;
  
  // Pagination & Filters State
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  search: string;
  filters: {
    role: string;
    verified: string; // "true", "false", or ""
    premium: string;  // "true", "false", or ""
  };

  // Actions
  setSearch: (query: string) => void;
  setFilter: (key: keyof UsersState["filters"], value: string) => void;
  setPage: (page: number) => void;

  fetchUsers: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchUserDetail: (id: string) => Promise<void>;
  
  togglePremium: (id: string, status: boolean) => Promise<void>;
  toggleVerified: (id: string, status: boolean) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  stats: null,
  currentUser: null,
  isLoading: false,
  
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  },
  search: "",
  filters: {
    role: "",
    verified: "",
    premium: "",
  },

  setSearch: (search) => set({ search }),
  
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
    pagination: { ...state.pagination, page: 1 } // Reset ke page 1 saat filter berubah
  })),

  setPage: (page) => set((state) => ({
    pagination: { ...state.pagination, page }
  })),

  fetchUsers: async () => {
    const { pagination, search, filters } = get();
    set({ isLoading: true });

    try {
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      if (search) params.append("q", search);
      if (filters.role) params.append("role", filters.role);
      if (filters.verified) params.append("verified", filters.verified);
      if (filters.premium) params.append("premium", filters.premium);

      const res = await api.get(`/api/users/list?${params.toString()}`);

      set({
        users: res.data.data,
        pagination: res.data.pagination,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await api.get("/api/users/count");
      set({ stats: res.data });
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  },

  fetchUserDetail: async (id: string) => {
    set({ isLoading: true, currentUser: null });
    try {
      const res = await api.get(`/api/users/detail/${id}`);
      set({ currentUser: res.data.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
      set({ isLoading: false });
    }
  },

  togglePremium: async (id: string, status: boolean) => {
    try {
      await api.patch(`/api/users/${id}/premium`, { is_premium: status });
      
      // Optimistic Update
      set((state) => ({
        users: state.users.map((u) => 
          u.id === id ? { ...u, is_premium: status } : u
        ),
        currentUser: state.currentUser?.id === id 
          ? { ...state.currentUser, is_premium: status } 
          : state.currentUser
      }));
      
      // Refresh stats karena jumlah premium berubah
      get().fetchStats();
    } catch (error) {
      console.error("Failed to toggle premium:", error);
    }
  },

  toggleVerified: async (id: string, status: boolean) => {
    try {
      await api.patch(`/api/users/${id}/verified`, { is_verified: status });
      
      set((state) => ({
        users: state.users.map((u) => 
          u.id === id ? { ...u, is_verified: status } : u
        ),
        currentUser: state.currentUser?.id === id 
          ? { ...state.currentUser, is_verified: status } 
          : state.currentUser
      }));

      get().fetchStats();
    } catch (error) {
      console.error("Failed to toggle verified:", error);
    }
  },

  deleteUser: async (id: string) => {
    try {
      await api.delete(`/api/users/${id}`);
      get().fetchUsers();
      get().fetchStats();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }
}));