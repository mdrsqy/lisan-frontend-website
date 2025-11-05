// frontend/lisan-admin/components/user-management/user-details-modal.tsx
"use client";
import { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Detail User yang disempurnakan (Termasuk overallProgress dari API)
interface DetailedUser extends User {
  overallProgress: number;
}

interface UserDetailsModalProps {
  userId: string;
  onEdit: (id: string) => void; // Ubah ke (id: string) agar dapat mengirim ID
  onDelete: (id: string) => void;
}

export function UserDetailsModal({
  userId,
  onEdit,
  onDelete,
}: UserDetailsModalProps) {
  const router = useRouter();
  const [user, setUser] = useState<DetailedUser | null>(null);
  const [isOpen, setIsOpen] = useState(false); // 🛑 State untuk mengontrol dialog
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("[CLIENT DEBUG] Fetching user details for userId:", userId);
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to fetch user details. Status: ${
            res.status
          }. Response: ${errorText.substring(0, 50)}...`
        );
      }
      const data: DetailedUser = await res.json();
      setUser(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unknown error occurred during fetch.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 🛑 LOGIC UTAMA: Panggil fetchUserDetails hanya saat modal BUKA
  useEffect(() => {
    if (isOpen) {
      fetchUserDetails();
    } else {
      // Reset data saat modal ditutup
      setUser(null);
    }
  }, [isOpen, userId, fetchUserDetails]); // Dependensi pada isOpen, userId, dan fetchUserDetails

  const getStatusVariant = (status: User["status"]) => {
    return status === "ACTIVE"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-red-600 hover:bg-red-700";
  };

  let Content;

  if (isLoading) {
    Content = (
      <div className="h-40 flex items-center justify-center text-gray-400">
        Loading user details...
      </div>
    );
  } else if (error) {
    Content = <p className="text-red-500 p-4">Error: {error}</p>;
  } else if (user) {
    // Konten utama (sudah ada)
    Content = (
      <>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <DetailItem label="User ID" value={user.id.substring(0, 8)} />
          <DetailItem
            label="Status"
            value={
              <Badge className={getStatusVariant(user.status)}>
                {user.status}
              </Badge>
            }
          />
          <DetailItem label="Name" value={user.name || "N/A"} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem
            label="Join Date"
            value={new Date(user.joinDate).toLocaleDateString()}
          />
          <DetailItem
            label="Last Active"
            value={user.lastActive.toLocaleString()}
          />
          <DetailItem label="Learning Level" value={user.learningLevel} />
          <DetailItem
            label="Lessons Completed"
            value={user.lessonsCompleted.toString()}
          />
        </div>

        <div className="mt-4">
          <Label className="text-lg font-semibold">
            Overall Progress: {user.overallProgress}%
          </Label>
          <Progress
            value={user.overallProgress}
            className="h-3 bg-gray-700 mt-2"
          />
        </div>
      </>
    );
  } else {
    Content = (
      <div className="h-40 flex items-center justify-center text-gray-400">
        Click View to load data.
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {" "}
      {/* 🛑 Kaitkan state open */}
      <DialogTrigger asChild>
        {/* Hapus onClick={fetchUserDetails} di sini */}
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-gray-900 border-gray-700 text-white">
        <DialogHeader className="border-b border-gray-700 pb-3">
          <DialogTitle className="text-2xl">User Details</DialogTitle>
          <p className="text-gray-400">
            Detailed information about the selected user
          </p>
        </DialogHeader>
        {Content} {/* Tampilkan konten yang dihitung di atas */}
        {/* Tombol Aksi di Modal (Hanya muncul jika data user ada dan tidak loading) */}
        {!isLoading && user && (
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-700 mt-4">
            <Button variant="secondary" onClick={() => onEdit(userId)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await onDelete(userId);
                setIsOpen(false);
                router.refresh();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Komponen helper untuk baris detail
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="space-y-1">
    <p className="text-gray-400 font-medium">{label}</p>
    <div className="text-white font-semibold">{value}</div>
  </div>
);
