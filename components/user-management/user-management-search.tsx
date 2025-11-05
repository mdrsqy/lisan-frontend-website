// frontend/components/user-management/user-management-search.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export function UserManagementSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  // State untuk input field
  const [inputValue, setInputValue] = useState(currentSearch);

  // Debounce nilai input untuk menghindari terlalu banyak navigasi
  const [debouncedSearchTerm] = useDebounce(inputValue, 300); // 300ms debounce

  // Effect untuk memperbarui URL ketika debounced search term berubah
  useEffect(() => {
    // ✅ PERBAIKAN: Hanya panggil router.replace jika ada perubahan
    if (debouncedSearchTerm === currentSearch) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }

    router.replace(`/users?${params.toString()}`);
  }, [debouncedSearchTerm, router, searchParams, currentSearch]);

  // Jaga agar state input internal tetap sinkron dengan param search URL
  // (misalnya, pengguna menavigasi mundur/maju, atau filter lain mengubah URL)
  useEffect(() => {
    setInputValue(currentSearch);
  }, [currentSearch]);

  return (
    <Input
      placeholder="Cari pengguna berdasarkan nama, email, atau ID..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="max-w-sm bg-gray-800 border-gray-700 text-white"
    />
  );
}
