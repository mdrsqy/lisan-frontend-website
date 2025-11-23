import { create } from "zustand";
import api from "../lib/api";

interface User {
  id: string;
  name: string;               // backend pakai 'name'
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
  signin: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  signout: () => void;
  setUser: (data: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  setUser: (data) => set({ user: data }),

  signin: async (emailOrUsername, password) => {
    set({ loading: true });

    try {
      const response = await api.post("/users/signin", {
        emailOrUsername,
        password,
      });

      const rawUser = response.data?.user;
      const token = response.data?.token;

      if (!rawUser || !token) {
        throw new Error("Data login tidak valid");
      }

      // ❗ Normalisasi user — hapus password untuk keamanan
      const user: User = {
        id: rawUser.id,
        name: rawUser.name,
        username: rawUser.username,
        email: rawUser.email,
        role: rawUser.role,
        score: rawUser.score,
        is_premium: rawUser.is_premium,
        profile_picture: rawUser.profile_picture,
        created_at: rawUser.created_at,
        updated_at: rawUser.updated_at,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      set({ user, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw new Error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Gagal login, periksa kembali data Anda"
      );
    }
  },

  signup: async (data) => {
    set({ loading: true });

    try {
      const response = await api.post("/users/signup", data);

      const rawUser = response.data?.user;
      const token = response.data?.token;

      if (!rawUser || !token) {
        throw new Error("Data signup tidak valid");
      }

      const user: User = {
        id: rawUser.id,
        name: rawUser.name,
        username: rawUser.username,
        email: rawUser.email,
        role: rawUser.role,
        score: rawUser.score,
        is_premium: rawUser.is_premium,
        profile_picture: rawUser.profile_picture,
        created_at: rawUser.created_at,
        updated_at: rawUser.updated_at,
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      set({ user, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw new Error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Gagal signup, periksa kembali data Anda"
      );
    }
  },

  signout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },
}));