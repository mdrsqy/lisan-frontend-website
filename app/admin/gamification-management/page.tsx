import AdminAnnouncementManagementClient from "./AdminGamificationManagementClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Gamifikasi",
  description: "Pusat kontrol untuk mengelola pengumuman, berita, dan informasi aplikasi Lisan.",
};

export default function AdminDashboardPage() {
  return <AdminAnnouncementManagementClient />;
}