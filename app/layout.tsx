import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lisan",
  description: "Aplikasi Lisan (Belajar Bahasa Isyarat)",
  icons: {
    icon: "/lisan.png",
    shortcut: "/lisan.png",
    apple: "/lisan.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#0A0F1C]">
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