import { create } from "zustand";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profile_picture?: string | null;
  role: string;
  is_premium?: boolean;
  is_verified?: boolean;
  score?: number;
  created_at?: string;
  deleted_at?: string | null;
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
  }) => Promise<string>;
  sendCode: (email: string) => Promise<void>;
  verifyCode: (user_id: string, otp: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (user_id: string, otp: string, newPassword: string) => Promise<void>;
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
      const r = await api.post("/api/auth/register", data);
      
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "Registrasi berhasil, silakan verifikasi OTP" },
        })
      );
      return r.data.user_id;
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

  verifyCode: async (user_id, otp) => {
    set({ loading: true });
    try {
      await api.post("/api/auth/verify-otp", { user_id, otp });

      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "Akun berhasil diverifikasi" },
        })
      );
    } catch (error: any) {
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: error?.response?.data?.message || "OTP salah atau kadaluarsa",
          },
        })
      );
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true });
    try {
      const r = await api.post("/api/auth/forgot-password", { email });

      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "OTP reset password dikirim" },
        })
      );
      return r.data.user_id;
    } catch (error: any) {
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: error?.response?.data?.message || "Gagal mengirim OTP",
          },
        })
      );
      throw error;
    }
  },

  resetPassword: async (user_id, otp, newPassword) => {
    set({ loading: true });
    try {
      await api.post("/api/auth/reset-password", {
        user_id,
        otp,
        new_password: newPassword,
      });

      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: { type: "success", message: "Password berhasil diubah" },
        })
      );
    } catch (error: any) {
      set({ loading: false });
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            type: "error",
            message: error?.response?.data?.message || "Reset password gagal",
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
    } catch (error) {
      const refreshToken = localStorage.getItem("refreshToken");
      if(refreshToken) {
         await api.post("/api/auth/logout", { refreshToken });
      }
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ user: null });
    }
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