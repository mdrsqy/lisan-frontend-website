import AdminUserManagementClient from "./AdminUserManagementClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengelolaan Pengguna",
  description: "Pusat kontrol untuk mengelola seluruh pengguna aplikasi Lisan.",
};

export default function AdminUsersPage() {
  return <AdminUserManagementClient />;
}