import { create } from "zustand";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";

interface ProfileState {
  isLoading: boolean;
  isUploading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { name?: string; username?: string; email?: string; bio?: string }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  isLoading: false,
  isUploading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user?.id) return;

      const response = await api.get("/api/profile/me", {
        params: { user_id: user.id }
      });
      
      const updatedUser = response.data;
      useAuthStore.getState().setUser(updatedUser);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user?.id) throw new Error("User ID not found");

      const response = await api.put("/api/profile/update", {
        ...data,
        user_id: user.id
      });
      
      const updatedUser = response.data.user;
      useAuthStore.getState().setUser(updatedUser);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  uploadAvatar: async (file) => {
    set({ isUploading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user?.id) throw new Error("User ID not found");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user.id);

      const response = await api.put("/api/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { avatar_url } = response.data;
      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        const updatedUser = { ...currentUser, profile_picture: avatar_url };
        useAuthStore.getState().setUser(updatedUser);

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      throw error;
    } finally {
      set({ isUploading: false });
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user?.id) throw new Error("User ID not found");

      await api.put("/api/profile/change-password", {
        user_id: user.id,
        old_password: oldPassword,
        new_password: newPassword,
      });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));