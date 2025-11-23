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

  icons: {
    icon: "/lisan-logo.png",       
    shortcut: "/lisan-logo.png",    
    apple: "/lisan-logo.png",      
  },
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

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(1, 29, 68, 0.6)",
              color: "#fff",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#1c9cf0",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#0004ffff",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}