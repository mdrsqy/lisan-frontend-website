// app/admin/announcements/page.tsx
import AnnouncementManagementClient from "./AnnoucementManagementClient";

export const metadata = {
  title: "Admin Dashboard - Announcement Management",
  description: "Halaman untuk mengelola pengumuman di Admin Dashboard",
};

export default function AnnouncementManagementPage() {
  return <AnnouncementManagementClient />;
}