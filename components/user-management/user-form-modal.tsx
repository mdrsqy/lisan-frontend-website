// frontend/lisan-admin/components/user-management/user-form-modal.tsx
"use client";
import { User, UserStatus } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserFormModalProps {
  user?: User;
}

export function UserFormModal({ user }: UserFormModalProps) {
  const router = useRouter();
  const isEditing = !!user;
  const [isOpen, setIsOpen] = useState(false);

  // 🛑 Perbaikan Type: Hapus 'as UserStatus'
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    status: user?.status || "ACTIVE",
    learningLevel: user?.learningLevel || "Beginner",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi handleSubmit (logic POST/PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/users/${user!.id}` : "/api/users";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${method === "POST" ? "create" : "update"} user.`
        );
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      const errorMessage =
        (err as Error).message || "An unexpected error occurred.";
      console.error("Submission error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2"
          variant={isEditing ? "ghost" : "default"}
          onClick={() => setIsOpen(true)}
        >
          {isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {isEditing ? "Edit User" : "Add New User"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* 🛑 Input Name (DITAMBAHKAN KEMBALI) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3 bg-gray-800 border-gray-600"
              required
            />
          </div>

          {/* 🛑 Input Email (DITAMBAHKAN KEMBALI) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="col-span-3 bg-gray-800 border-gray-600"
              required
              disabled={isEditing} // Email tidak bisa diubah saat edit
            />
          </div>

          {/* Select Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={formData.status}
              // 🛑 Perbaikan: Gunakan type assertion di sini jika diperlukan
              onValueChange={(val) =>
                setFormData({ ...formData, status: val as UserStatus })
              }
            >
              <SelectTrigger className="col-span-3 bg-gray-800 border-gray-600">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select Learning Level */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Level
            </Label>
            <Select
              value={formData.learningLevel}
              onValueChange={(val) =>
                setFormData({ ...formData, learningLevel: val })
              }
            >
              <SelectTrigger className="col-span-3 bg-gray-800 border-gray-600">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="mt-4" disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : isEditing
              ? "Save Changes"
              : "Create User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
