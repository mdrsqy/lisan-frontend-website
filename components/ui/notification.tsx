"use client";

import { Toaster } from "react-hot-toast";

export default function NotificationStack() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2400,
        style: {
          background: "#000000",
          color: "#ffffff",
          borderRadius: "16px",
          border: "1px solid rgba(28,156,240,0.4)",
        },
        success: {
          iconTheme: {
            primary: "#1c9cf0",
            secondary: "#000000",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#000000",
          },
        },
      }}
    />
  );
}