// frontend/lisan-admin/components/user-management-table.tsx
"use client"; // Diperlukan karena ada event handlers (onClick)

import { User, UserStatus } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Clock, Calendar, Trash2, Edit } from "lucide-react"; // Tambahkan Edit dan Trash2
import { UserDetailsModal } from "@/components/user-management/user-details-modal";
import { UserFormModal } from "@/components/user-management/user-form-modal";

interface UserTableProps {
  users: User[];
  onDelete: (id: string) => Promise<void>;
}
// Fungsi helper untuk mengubah format waktu (opsional)
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 3600);

  if (diffInHours < 24) {
    // Menampilkan menit/jam jika baru terjadi
    const diffInMinutes =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60);
    if (diffInMinutes < 60) return `${Math.round(diffInMinutes)} min ago`;
    return `${Math.round(diffInHours)} hours ago`;
  }
  return date.toLocaleDateString();
};

const getStatusVariant = (status: UserStatus) => {
  return status === "ACTIVE"
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-yellow-600 hover:bg-yellow-700";
};

export function UserManagementTable({ users, onDelete }: UserTableProps) {
  // Fungsi handler untuk tombol Delete
  const handleDelete = async (userId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        // Panggil Server Action yang diteruskan melalui prop
        await onDelete(userId);
        alert("User deleted successfully.");
      } catch (error) {
        alert("Failed to delete user.");
        console.error("Delete error:", error);
      }
    }
  };

  // Fungsi onEdit akan memicu modal edit yang sebenarnya
  // Saat ini, kita hanya membuat placeholder untuk memicu modal.
  const handleEdit = (userId: string) => {
    // Logika: Membuka UserFormModal (kita akan mengimplementasikannya nanti)
    alert(`Opening Edit Modal for User ID: ${userId}`);
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Lessons</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9} // Ubah colSpan menjadi 9 karena Actions sekarang ada 3 tombol
                className="h-24 text-center text-muted-foreground"
              >
                Tidak ada data pengguna saat ini. Database kosong.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-800 transition-colors"
              >
                <TableCell className="font-medium text-gray-400">
                  {user.id.substring(0, 6)}...
                </TableCell>
                <TableCell className="font-semibold">
                  {user.name || "N/A"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getStatusVariant(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    {new Date(user.joinDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="font-mono">
                  {user.lessonsCompleted}
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    {formatTimeAgo(user.lastActive)}
                  </div>
                </TableCell>

                {/* 🛑 KOLOM ACTIONS (VIEW, EDIT, DELETE) */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {/* 1. VIEW (Membuka Modal Detail) */}
                    <UserDetailsModal
                      userId={user.id}
                      onEdit={() => {
                        /* Placeholder: Implementasi buka modal edit */
                      }}
                      onDelete={onDelete}
                    />

                    {/* 2. EDIT (Placeholder) */}
                    <UserFormModal user={user} />

                    {/* 3. DELETE (Memanggil Server Action) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                      title="Delete User"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
