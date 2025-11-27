import { create } from "zustand";
import api from "./api";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  score?: number;
  is_premium?: boolean;
  profile_picture?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signin: (identifier: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  signout: () => Promise<void>;
  setUser: (data: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  loading: false,

  setUser: (data) => set({ user: data }),

  signin: async (identifier, password) => {
    set({ loading: true });
    try {
      const r = await api.post("/api/auth/login", { identifier, password });

      const user: User = r.data.user;
      const accessToken = r.data.accessToken;
      const refreshToken = r.data.refreshToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }

      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signup: async (data) => {
    set({ loading: true });
    try {
      await api.post("/api/auth/register", data);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signout: async () => {
    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          await api.post("/api/auth/logout", { refreshToken });
        } catch {}
      }

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    set({ user: null });
  },
}));