export type ContentStatus = "DRAFT" | "PUBLISHED";

export interface Lesson {
  id: string; // Sudah dipotong 6 karakter
  title: string;
  module: string;
  status: ContentStatus;
  views: number;
  completionRate: number; // Dalam persentase (e.g., 87)
  createdAt: string;
}