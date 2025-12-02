import { create } from "zustand";
import api from "./api";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_premium?: boolean;
  avatar_url?: string;
  created_at: string;
}

interface UserStats {
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
  error: string | null;

  page: number;
  limit: number;

  fetchUsers: (params?: { page?: number; limit?: number }) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  filterUsers: (filters: { role?: string; premium?: boolean; verified?: boolean }) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchUserDetail: (id: string) => Promise<void>;

  setUserPremium: (id: string, status: boolean) => Promise<void>;
  setUserVerified: (id: string) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  stats: null,
  currentUser: null,
  isLoading: false,
  error: null,
  page: 1,
  limit: 10,

  fetchUsers: async (params) => {
    const page = params?.page || get().page;
    const limit = params?.limit || get().limit;

    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/api/users/paginate?page=${page}&limit=${limit}`);
      set({ users: data, page, limit });
    } catch (error: any) {
      console.error("Fetch users failed", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  searchUsers: async (query) => {
    if (!query) {
      return get().fetchUsers();
    }

    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/api/users/search?q=${query}`);
      set({ users: data });
    } catch (error: any) {
      console.error("Search failed", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  filterUsers: async ({ role, premium, verified }) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (role) params.append("role", role);
      if (premium !== undefined) params.append("premium", String(premium));
      if (verified !== undefined) params.append("verified", String(verified));

      const { data } = await api.get(`/api/users/filter?${params.toString()}`);
      set({ users: data });
    } catch (error: any) {
      console.error("Filter failed", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await api.get("/api/users/count");
      set({ stats: data });
    } catch (error) {
      console.error("Failed fetch stats", error);
    }
  },

  fetchUserDetail: async (id) => {
    set({ isLoading: true, currentUser: null, error: null });
    try {
      const { data } = await api.get(`/api/users/${id}`);
      set({ currentUser: data });
    } catch (error: any) {
      console.error("Fetch user detail failed", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setUserPremium: async (id, status) => {
    try {
      await api.put(`/api/users/${id}/premium`, { status });
      set((state) => ({
        users: state.users.map((u) => 
          u.id === id ? { ...u, is_premium: status } : u
        ),
        currentUser: state.currentUser?.id === id ? { ...state.currentUser, is_premium: status } : state.currentUser
      }));
    } catch (error: any) {
      console.error("Set premium failed", error);
      throw error;
    }
  },

  setUserVerified: async (id) => {
    try {
      await api.put(`/api/users/${id}/verified`);
      set((state) => ({
        users: state.users.map((u) => 
          u.id === id ? { ...u, is_verified: true } : u
        ),
        currentUser: state.currentUser?.id === id ? { ...state.currentUser, is_verified: true } : state.currentUser
      }));
    } catch (error: any) {
      console.error("Set verified failed", error);
      throw error;
    }
  }
}));