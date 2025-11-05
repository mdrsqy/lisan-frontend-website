// frontend/app/users/page.tsx
import { revalidatePath } from "next/cache";
import { UserManagementTable } from "@/components/user-management-table";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserManagementSearch } from "@/components/user-management/user-management-search";
import { UserStatusFilter } from "@/components/user-management/user-status-filter";
import { UserFormModal } from "@/components/user-management/user-form-modal";

// ----------------------------------------------------------------------
// SERVER ACTION: REVALIDATE & CREATE
// ----------------------------------------------------------------------
export async function revalidateUserPage() {
  "use server";
  revalidatePath("/users");
}

// ----------------------------------------------------------------------
// SERVER ACTION: DELETE USER
// ----------------------------------------------------------------------
export async function deleteUserAction(userId: string) {
  "use server";

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}`;
  const res = await fetch(url, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("Failed to delete user on server.");
  }

  // Setelah sukses, revalidate halaman
  revalidatePath("/users");
}

// ----------------------------------------------------------------------
// FUNGSI FETCH DATA: Menerima Parameter yang Sudah Di-Resolve
// ----------------------------------------------------------------------
// Menerima string yang sudah di-resolve
async function getUsersData(
  searchTerm: string,
  statusFilter: string
): Promise<User[]> {
  // Modifikasi URL untuk menyertakan search dan status
  const url = `${
    process.env.NEXT_PUBLIC_APP_URL
  }/api/users?search=${encodeURIComponent(
    searchTerm
  )}&status=${encodeURIComponent(statusFilter)}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch users data:", res.status, res.statusText);
    return [];
  }
  return res.json();
}

// ----------------------------------------------------------------------
// PAGE COMPONENT
// ----------------------------------------------------------------------
export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string };
}) {
  // ✅ PERBAIKAN: Akses searchParams dengan benar di Server Component
  const searchTerm = searchParams?.search || "";
  const statusFilter = searchParams?.status || "";

  const users = await getUsersData(searchTerm, statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-4">
          {/* Export Data: Gunakan <a> agar tidak error di Server Component */}
          {(() => {
            const params = new URLSearchParams();
            if (searchTerm) params.set("search", searchTerm);
            if (statusFilter && statusFilter !== "all")
              params.set("status", statusFilter);
            const href = `/api/users/export?${params.toString()}`;
            return (
              <a href={href} download>
                <Button asChild variant="secondary" className="gap-2">
                  <span>
                    <Download className="h-4 w-4" /> Export Data
                  </span>
                </Button>
              </a>
            );
          })()}
          <UserFormModal />
        </div>
      </div>
      <Separator />
      {/* Bagian Search di kiri, Filter di kanan */}
      <div className="flex gap-4 items-center justify-between">
        <div className="flex-1">
          <UserManagementSearch />
        </div>
        <div>
          <UserStatusFilter />
        </div>
      </div>
      {/* Tabel User */}
      <UserManagementTable users={users} onDelete={deleteUserAction} />
    </div>
  );
}
