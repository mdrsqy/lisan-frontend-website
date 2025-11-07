"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

// Tipe tiap notifikasi
interface NotificationItem {
  id: number;
  type: "success" | "error";
  message: string;
  duration?: number; // ms, 0 = no auto-close
}

// Props untuk stack notifikasi
interface NotificationStackProps {
  notifications: NotificationItem[];
  removeNotification: (id: number) => void;
}

// Notification Stack: menampilkan maksimal 3 notifikasi terakhir
export default function NotificationStack({ notifications, removeNotification }: NotificationStackProps) {
  const displayedNotifications = notifications.slice(-3);

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-[95vw]">
      <AnimatePresence>
        {displayedNotifications.map((notif) => (
          <SingleNotification
            key={notif.id}
            {...notif}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Single Notification component
interface SingleNotificationProps extends NotificationItem {
  onClose: () => void;
}

function SingleNotification({ id, type, message, onClose, duration = 5000 }: SingleNotificationProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration === 0) return;

    setProgress(100);
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  const isSuccess = type === "success";

  // Icon sesuai type
  const icon = isSuccess ? (
    <CheckCircle className="w-6 h-6 flex-shrink-0 text-green-500" />
  ) : (
    <XCircle className="w-6 h-6 flex-shrink-0 text-red-500" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="w-[500px] max-w-[95vw] backdrop-blur-xl rounded-2xl shadow-lg border p-4 flex flex-col gap-2 break-words"
      style={{
        background: "linear-gradient(135deg, rgba(147,51,234,0.2), rgba(236,72,153,0.2))",
        borderColor: isSuccess ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)",
        boxShadow: isSuccess
          ? "0 8px 25px rgba(16,185,129,0.3)"
          : "0 8px 25px rgba(239,68,68,0.3)",
        color: "white",
        wordBreak: "break-word"
      }}
    >
      {/* Konten notifikasi */}
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          onClick={onClose}
          className="mt-1 hover:opacity-70 transition"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden mt-2">
          <motion.div
            className={`h-full ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
}