import { create } from "zustand";
import api from "../lib/api";

interface User {
  id?: string;
  user_id?: number;
  full_name: string;
  email: string;
  username: string;
  role: string;
  profile_picture?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  signin: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (data: {
    full_name: string;
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

      const user = response.data?.user;
      const token = response.data?.token;

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      if (!user || !token) {
        throw new Error("Data login tidak valid");
      }

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

      const user = response.data?.user;
      const token = response.data?.token;

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      if (!user || !token) {
        throw new Error("Data signup tidak valid");
      }

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