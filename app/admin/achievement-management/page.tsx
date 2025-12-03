import AdminAchievementManagementClient from "./AdminAchievementManagementClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Gamifikasi",
  description: "Pusat kontrol untuk mengelola level, lencana (badges), dan progres pencapaian (achievements) pengguna.",
};

export default function AdminAchievementPage() {
  return <AdminAchievementManagementClient />;
}