import AdminMyClient from "./AdminDashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Lisan Admin",
  description: "Pusat kontrol manajemen pengguna, modul pembelajaran, dan pengumuman aplikasi Lisan.",
};

export default function AdminDashboardPage() {
  return <AdminMyClient />;
}