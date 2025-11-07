// src/app/layout.tsx
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lisan",
  description:
    "Dashboard monitoring untuk aplikasi Lisan (Belajar Bahasa Isyarat)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
        {/* Toaster for global notifications */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(25, 0, 40, 0.6)",
              color: "#fff",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#a855f7", // purple-500
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#fb7185", // pink-400
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}