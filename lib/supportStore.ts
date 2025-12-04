"use client";

import { create } from "zustand";
import api from "@/lib/api";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  user_id: string | null;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'resolved';
  created_at: string;
  users?: {
    name: string;
    email: string;
    profile_picture: string | null;
  } | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
}

export interface FeedbackFormData {
  user_id?: string;
  subject: string;
  message: string;
}

interface SupportStore {
  faqs: FAQ[];
  publicFaqs: FAQ[];
  feedbacks: Feedback[];
  loading: boolean;

  faqPagination: Pagination;
  feedbackPagination: Pagination;

  faqSearch: string;
  faqCategory: string;
  feedbackSearch: string;
  feedbackStatus: string;

  setFaqSearch: (v: string) => void;
  setFaqCategory: (v: string) => void;
  setFaqPage: (page: number) => void;

  setFeedbackSearch: (v: string) => void;
  setFeedbackStatus: (v: string) => void;
  setFeedbackPage: (page: number) => void;

  fetchPublicFaqs: () => Promise<void>;
  fetchAdminFaqs: () => Promise<void>;
  createFAQ: (data: FAQFormData) => Promise<any>;
  updateFAQ: (id: string, data: Partial<FAQFormData>) => Promise<any>;
  deleteFAQ: (id: string) => Promise<any>;

  createFeedback: (data: FeedbackFormData) => Promise<any>;
  fetchAdminFeedbacks: () => Promise<void>;
  updateFeedbackStatus: (id: string, status: string) => Promise<any>;
  deleteFeedback: (id: string) => Promise<any>;
}

export const useSupportStore = create<SupportStore>((set, get) => ({
  faqs: [],
  publicFaqs: [],
  feedbacks: [],
  loading: false,

  faqPagination: { page: 1, limit: 10, total: 0, total_pages: 1 },
  feedbackPagination: { page: 1, limit: 10, total: 0, total_pages: 1 },

  faqSearch: "",
  faqCategory: "",
  feedbackSearch: "",
  feedbackStatus: "",

  setFaqSearch: (search) => set((state) => ({ 
    faqSearch: search, 
    faqPagination: { ...state.faqPagination, page: 1 } 
  })),

  setFaqCategory: (category) => set((state) => ({ 
    faqCategory: category, 
    faqPagination: { ...state.faqPagination, page: 1 } 
  })),

  setFaqPage: (page) => set((state) => ({ 
    faqPagination: { ...state.faqPagination, page: page < 1 ? 1 : page } 
  })),

  setFeedbackSearch: (search) => set((state) => ({ 
    feedbackSearch: search, 
    feedbackPagination: { ...state.feedbackPagination, page: 1 } 
  })),

  setFeedbackStatus: (status) => set((state) => ({ 
    feedbackStatus: status, 
    feedbackPagination: { ...state.feedbackPagination, page: 1 } 
  })),

  setFeedbackPage: (page) => set((state) => ({ 
    feedbackPagination: { ...state.feedbackPagination, page: page < 1 ? 1 : page } 
  })),

  fetchPublicFaqs: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/api/support/faqs/public");
      set({ publicFaqs: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching public FAQs:", error);
      set({ loading: false });
    }
  },

  fetchAdminFaqs: async () => {
    const { faqPagination, faqSearch, faqCategory } = get();
    set({ loading: true });

    try {
      const params = new URLSearchParams();
      params.append("page", faqPagination.page.toString());
      params.append("limit", faqPagination.limit.toString());
      if (faqSearch) params.append("search", faqSearch);
      if (faqCategory) params.append("category", faqCategory);

      const res = await api.get(`/api/support/admin/faqs?${params.toString()}`);

      set({
        faqs: res.data.data,
        faqPagination: res.data.pagination,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching admin FAQs:", error);
      set({ loading: false });
    }
  },

  createFAQ: async (data) => {
    const res = await api.post("/api/support/admin/faqs", data);
    await get().fetchAdminFaqs();
    return res.data;
  },

  updateFAQ: async (id, data) => {
    const res = await api.put(`/api/support/admin/faqs/${id}`, data);
    await get().fetchAdminFaqs();
    return res.data;
  },

  deleteFAQ: async (id) => {
    const res = await api.delete(`/api/support/admin/faqs/${id}`);
    await get().fetchAdminFaqs();
    return res.data;
  },

  createFeedback: async (data) => {
    const res = await api.post("/api/support/feedback", data);
    return res.data;
  },

  fetchAdminFeedbacks: async () => {
    const { feedbackPagination, feedbackSearch, feedbackStatus } = get();
    set({ loading: true });

    try {
      const params = new URLSearchParams();
      params.append("page", feedbackPagination.page.toString());
      params.append("limit", feedbackPagination.limit.toString());
      if (feedbackSearch) params.append("search", feedbackSearch);
      if (feedbackStatus) params.append("status", feedbackStatus);

      const res = await api.get(`/api/support/admin/feedback?${params.toString()}`);

      set({
        feedbacks: res.data.data,
        feedbackPagination: res.data.pagination,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      set({ loading: false });
    }
  },

  updateFeedbackStatus: async (id, status) => {
    const res = await api.patch(`/api/support/admin/feedback/${id}/status`, { status });
    await get().fetchAdminFeedbacks();
    return res.data;
  },

  deleteFeedback: async (id) => {
    const res = await api.delete(`/api/support/admin/feedback/${id}`);
    await get().fetchAdminFeedbacks();
    return res.data;
  },
}));