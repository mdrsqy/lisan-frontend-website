import AdminAnnouncementManagementClient from "./AdminAnnouncemenetManagementClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Pengumuman - Lisan Admin",
  description: "Pusat kontrol untuk mengelola pengumuman, berita, dan informasi aplikasi Lisan.",
};

export default function AdminDashboardPage() {
  return <AdminAnnouncementManagementClient />;
}