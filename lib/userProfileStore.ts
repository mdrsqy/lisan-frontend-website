import { create } from "zustand";
import api from "./api";

interface ProfileState {
  updateProfile: (data: { name?: string; username?: string; email?: string; bio?: string }) => Promise<any>;
  changePassword: (old_password: string, new_password: string) => Promise<any>;
  deleteAccount: () => Promise<any>;
}

export const useProfileStore = create<ProfileState>(() => ({
  updateProfile: async (data) => {
    const r = await api.put("/users/profile", data);
    return r.data;
  },

  changePassword: async (old_password, new_password) => {
    const r = await api.put("/users/change-password", { old_password, new_password });
    return r.data;
  },

  deleteAccount: async () => {
    const r = await api.delete("/users/delete");
    return r.data;
  }
}));