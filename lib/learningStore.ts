"use client";

import { create } from "zustand";
import api from "@/lib/api";

// --- Interfaces ---

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty_level: number;
  thumbnail_url: string | null;
  is_premium: boolean;
  order_index: number;
  created_at: string;
  lessons?: Lesson[]; // Optional jika belum di-fetch detailnya
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string;
  type: 'video' | 'quiz' | 'gesture_practice';
  gesture_target: string | null;
  xp_reward: number;
  order_index: number;
  created_at: string;
  learning_modules?: {
    title: string;
    is_premium: boolean;
  };
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  score: number;
  completed_at: string;
  lessons?: {
    title: string;
    module_id: string;
  };
}

export interface ModuleFormData {
  title: string;
  description: string;
  difficulty_level: number;
  is_premium: boolean;
  order_index: number;
  thumbnail: File | null;
}

export interface LessonFormData {
  module_id: string;
  title: string;
  content: string;
  type: string;
  gesture_target: string;
  xp_reward: number;
  order_index: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// --- Store Interface ---

interface LearningStore {
  modules: LearningModule[];
  currentModule: LearningModule | null;
  userProgress: UserProgress[];
  
  loading: boolean;
  
  pagination: Pagination;
  search: string;

  // Actions
  setSearch: (search: string) => void;
  setPage: (page: number) => void;

  // API Calls - Modules
  fetchModules: () => Promise<void>;
  fetchModuleDetail: (id: string) => Promise<void>;
  createModule: (data: ModuleFormData) => Promise<any>;
  updateModule: (id: string, data: ModuleFormData) => Promise<any>;
  deleteModule: (id: string) => Promise<any>;

  // API Calls - Lessons
  createLesson: (data: LessonFormData) => Promise<any>;
  updateLesson: (id: string, data: Partial<LessonFormData>) => Promise<any>;
  deleteLesson: (id: string) => Promise<any>;

  // API Calls - Progress
  fetchUserProgress: (userId: string) => Promise<void>;
  completeLesson: (userId: string, lessonId: string, score: number) => Promise<any>;
}

// --- Store Implementation ---

export const useLearningStore = create<LearningStore>((set, get) => ({
  modules: [],
  currentModule: null,
  userProgress: [],
  
  loading: false,
  
  pagination: { page: 1, limit: 10, total: 0, total_pages: 1 },
  search: "",

  setSearch: (search) => set((state) => ({ 
    search, 
    pagination: { ...state.pagination, page: 1 } 
  })),

  setPage: (page) => set((state) => ({ 
    pagination: { ...state.pagination, page: page < 1 ? 1 : page } 
  })),

  // --- Modules ---

  fetchModules: async () => {
    const { pagination, search } = get();
    set({ loading: true });

    try {
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      if (search) params.append("search", search);

      const res = await api.get(`/api/learning/modules?${params.toString()}`);

      set({
        modules: res.data.data,
        pagination: res.data.pagination,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching modules:", error);
      set({ loading: false });
    }
  },

  fetchModuleDetail: async (id: string) => {
    set({ loading: true });
    try {
      const res = await api.get(`/api/learning/modules/${id}`);
      set({ currentModule: res.data.data, loading: false });
    } catch (error) {
      console.error("Error fetching module detail:", error);
      set({ loading: false });
    }
  },

  createModule: async (form) => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("difficulty_level", form.difficulty_level.toString());
    fd.append("is_premium", String(form.is_premium));
    fd.append("order_index", form.order_index.toString());
    if (form.thumbnail) fd.append("thumbnail", form.thumbnail);

    const res = await api.post("/api/learning/admin/modules", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await get().fetchModules();
    return res.data;
  },

  updateModule: async (id, form) => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("difficulty_level", form.difficulty_level.toString());
    fd.append("is_premium", String(form.is_premium));
    fd.append("order_index", form.order_index.toString());
    if (form.thumbnail) fd.append("thumbnail", form.thumbnail);

    const res = await api.put(`/api/learning/admin/modules/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await get().fetchModules();
    return res.data;
  },

  deleteModule: async (id) => {
    const res = await api.delete(`/api/learning/admin/modules/${id}`);
    await get().fetchModules();
    return res.data;
  },

  // --- Lessons ---

  createLesson: async (data) => {
    const res = await api.post("/api/learning/admin/lessons", data);
    // Jika sedang melihat detail modul, refresh datanya
    const { currentModule } = get();
    if (currentModule && currentModule.id === data.module_id) {
        await get().fetchModuleDetail(data.module_id);
    }
    return res.data;
  },

  updateLesson: async (id, data) => {
    const res = await api.put(`/api/learning/admin/lessons/${id}`, data);
    const { currentModule } = get();
    if (currentModule) {
        await get().fetchModuleDetail(currentModule.id);
    }
    return res.data;
  },

  deleteLesson: async (id) => {
    const res = await api.delete(`/api/learning/admin/lessons/${id}`);
    const { currentModule } = get();
    if (currentModule) {
        await get().fetchModuleDetail(currentModule.id);
    }
    return res.data;
  },

  // --- User Progress ---

  fetchUserProgress: async (userId) => {
    // Mengirim user_id via query params sesuai controller
    const res = await api.get(`/api/learning/progress?user_id=${userId}`);
    set({ userProgress: res.data.data });
  },

  completeLesson: async (userId, lessonId, score) => {
    // Mengirim user_id via body sesuai controller
    const res = await api.post("/api/learning/complete", { 
        user_id: userId, 
        lesson_id: lessonId, 
        score 
    });
    // Refresh progress setelah complete
    await get().fetchUserProgress(userId);
    return res.data;
  },
}));