import { Metadata } from "next";
import AdminSupportManagementClient from "./AdminSupportManagementClient";

export const metadata: Metadata = {
  title: "Kelola Bantuan & Masukan",
  description: "Kelola FAQ, pertanyaan umum, dan tanggapi masukan atau laporan dari pengguna aplikasi Lisan.",
};

export default function AdminSupportPage() {
  return <AdminSupportManagementClient />;
}