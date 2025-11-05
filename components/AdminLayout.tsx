// frontend/lisan-admin/components/AdminLayout.tsx
'use client';

import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // 🛑 PASTIKAN TIDAK ADA PADDING GLOBAL DI SINI
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      
      {/* Sidebar Container */}
      {/* 🛑 Gunakan height penuh dan pastikan tidak ada margin/padding aneh */}
      <div className="w-[280px] shrink-0 h-full"> 
        <Sidebar activeTab={pathname} />
      </div>
      
      {/* Main Content Area */}
      {/* Konten utama yang scrollable */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-900">
        <div className="mx-auto max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}