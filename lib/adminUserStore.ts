import { create } from "zustand";
import api from "./api";

interface AdminUserState {
  searchUsers: (q: string) => Promise<any>;
  sortUsers: (by: string, order: string) => Promise<any>;
  filterUsers: (params: any) => Promise<any>;
  paginate: (limit: number, page: number) => Promise<any>;
  cursorPaginate: (limit: number, cursor?: string) => Promise<any>;
  count: () => Promise<any>;
}

export const useAdminUserStore = create<AdminUserState>(() => ({
  searchUsers: async (q) => {
    const r = await api.get(`/admin/users/search?q=${q}`);
    return r.data;
  },

  sortUsers: async (by, order) => {
    const r = await api.get(`/admin/users/sort?by=${by}&order=${order}`);
    return r.data;
  },

  filterUsers: async (params) => {
    const r = await api.get(`/admin/users/filter`, { params });
    return r.data;
  },

  paginate: async (limit, page) => {
    const r = await api.get(`/admin/users/paginate?limit=${limit}&page=${page}`);
    return r.data;
  },

  cursorPaginate: async (limit, cursor) => {
    const url = cursor ? `/admin/users/cursor?limit=${limit}&cursor=${cursor}` : `/admin/users/cursor?limit=${limit}`;
    const r = await api.get(url);
    return r.data;
  },

  count: async () => {
    const r = await api.get(`/admin/users/count`);
    return r.data;
  }
}));