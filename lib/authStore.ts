import { create } from "zustand";
import api from "@/lib/api";

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
  sendCode: (email: string) => Promise<void>;
  verifyCode: (email: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  signout: () => Promise<void>;
  setUser: (data: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
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
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "Login berhasil" },
        })
      );
    } catch (error: any) {
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: error?.response?.data?.message || "Login gagal",
          },
        })
      );
      throw error;
    }
  },

  signup: async (data) => {
    set({ loading: true });
    try {
      await api.post("/api/auth/register", data);

      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "Registrasi berhasil" },
        })
      );
    } catch (error: any) {
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: error?.response?.data?.message || "Registrasi gagal",
          },
        })
      );
      throw error;
    }
  },

  sendCode: async (email) => {
    set({ loading: true });
    try {
      await api.post("/api/auth/otp/send", { email });

      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "Kode OTP dikirim" },
        })
      );
    } catch (error: any) {
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: error?.response?.data?.message || "Gagal mengirim kode",
          },
        })
      );
      throw error;
    }
  },

  verifyCode: async (email, otp) => {
    set({ loading: true });
    try {
      await api.post("/api/auth/verify-otp", { email, otp });

      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "OTP berhasil diverifikasi" },
        })
      );
    } catch (error: any) {
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: error?.response?.data?.message || "OTP salah",
          },
        })
      );
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true });
    try {
      await api.post("/api/auth/forgot-password", { email });

      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "Email reset dikirim" },
        })
      );
    } catch (error: any) {
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: error?.response?.data?.message || "Gagal mengirim email",
          },
        })
      );
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ loading: true });
    try {
      await api.post("/api/auth/reset-password", {
        token,
        newPassword,
      });

      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "Password berhasil direset" },
        })
      );
    } catch (error: any) {
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: error?.response?.data?.message || "Reset gagal",
          },
        })
      );
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      const r = await api.post("/api/auth/refresh-token", { refreshToken });
      const newAccessToken = r.data.accessToken;

      localStorage.setItem("accessToken", newAccessToken);
    } catch {}
  },

  signout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/api/auth/logout", { refreshToken });
      }
    } catch {}

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    set({ user: null });

    window.dispatchEvent(
      new CustomEvent("notify", {
        detail: { type: "success", message: "Berhasil logout" },
      })
    );
  },
}));