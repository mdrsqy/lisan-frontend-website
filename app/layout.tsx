// frontend/lisan-admin/app/layout.tsx

import type { Metadata } from "next";
// Hapus import Geist dan Geist_Mono

// Import Poppins dari next/font/google
import { Poppins } from 'next/font/google'; 
import "./globals.css";
import { AdminLayout } from '@/components/AdminLayout';

// 1. Konfigurasi Poppins
const poppins = Poppins({ 
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'], // Weight yang umum digunakan
    variable: '--font-poppins', // Definisi variabel CSS untuk Tailwind
});

export const metadata: Metadata = {
  title: "Lisan Admin Dashboard", // Ganti judul default
  description: "Dashboard monitoring untuk aplikasi Lisan (Belajar Bahasa Isyarat)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Aktifkan Dark Mode Global
    <html lang="en" className="dark" suppressHydrationWarning> 
      <body
        // 3. Terapkan class font Poppins
        className={`${poppins.className} antialiased`}
      >
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}