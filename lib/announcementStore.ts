import { create } from 'zustand';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  is_pinned: boolean;
  is_active: boolean;
  publish_at: string;
  created_at: string;
  created_by: {
    name: string;
    username: string;
  } | null;
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  publish_at: string;
  image: File | null;
}

interface AnnouncementStore {
  announcements: Announcement[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  search: string;
  
  setAnnouncements: (data: Announcement[]) => void;
  setLoading: (loading: boolean) => void;
  setPagination: (data: { page: number; limit: number; total: number }) => void;
  setSearch: (query: string) => void;
}

export const useAnnouncementStore = create<AnnouncementStore>((set) => ({
  announcements: [],
  loading: true,
  pagination: { page: 1, limit: 10, total: 0 },
  search: "",
  
  setAnnouncements: (data) => set({ announcements: data }),
  setLoading: (loading) => set({ loading }),
  setPagination: (data) => set({ pagination: data }),
  setSearch: (search) => set({ search }),
}));