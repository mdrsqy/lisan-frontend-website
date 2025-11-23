// app/admin/users/page.tsx
import UserManagementsClient from "./UserManagementClient";

export const metadata = {
  title: "Admin Dashboard - User Management",
  description: "Halaman untuk mengelola data user di Admin Dashboard",
};

export default function UserManagementsPage() {
  return <UserManagementsClient />;
}