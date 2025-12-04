import { Metadata } from "next";
import AdminLearningManagementClient from "./AdminLearningManagementClient";

export const metadata: Metadata = {
  title: "Kelola Modul & Materi",
  description: "Kelola modul, materi video, dan latihan bahasa isyarat.",
};

export default function AdminLearningPage() {
  return <AdminLearningManagementClient />;
}