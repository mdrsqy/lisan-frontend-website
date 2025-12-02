"use client";

import React, { useEffect, useState, useRef } from "react";
import { Check, X, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationState {
  type: NotificationType;
  message: string;
}

export default function Notification() {
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleNotification = (event: Event) => {
      const customEvent = event as CustomEvent<{ type: NotificationType; message: string }>;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setNotification(customEvent.detail);

      timeoutRef.current = setTimeout(() => {
        setNotification(null);
      }, 3000);
    };

    window.addEventListener("notify", handleNotification);

    return () => {
      window.removeEventListener("notify", handleNotification);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClose = () => {
    setNotification(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const getNotificationStyle = (type: NotificationType) => {
    switch (type) {
      case "success":
        return {
          container: "bg-[#0A0F1C]/90 shadow-green-500/10 border-green-500/20",
          iconBg: "text-green-400 bg-green-500/20",
          icon: <Check className="w-5 h-5" />,
        };
      case "error":
        return {
          container: "bg-[#0A0F1C]/90 shadow-red-500/10 border-red-500/20",
          iconBg: "text-red-400 bg-red-500/20",
          icon: <AlertCircle className="w-5 h-5" />,
        };
      case "warning":
        return {
          container: "bg-[#0A0F1C]/90 shadow-yellow-500/10 border-yellow-500/20",
          iconBg: "text-yellow-400 bg-yellow-500/20",
          icon: <AlertTriangle className="w-5 h-5" />,
        };
      case "info":
        return {
          container: "bg-[#0A0F1C]/90 shadow-blue-500/10 border-blue-500/20",
          iconBg: "text-blue-400 bg-blue-500/20",
          icon: <Info className="w-5 h-5" />,
        };
      default:
        return {
          container: "bg-[#0A0F1C]/90 border-white/10",
          iconBg: "text-slate-400 bg-slate-500/20",
          icon: <Info className="w-5 h-5" />,
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="wait">
        {notification && (
          <motion.div
            key={notification.message}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto"
          >
            <div
              id="toast-notification"
              className={`flex items-center w-full max-w-sm p-4 text-slate-200 rounded-xl shadow-lg border backdrop-blur-md ${
                getNotificationStyle(notification.type).container
              }`}
              role="alert"
            >
              <div
                className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${
                  getNotificationStyle(notification.type).iconBg
                }`}
              >
                {getNotificationStyle(notification.type).icon}
              </div>

              <div className="ms-3 text-sm font-medium pr-4">
                {notification.message}
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="ms-auto -mx-1.5 -my-1.5 text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-slate-500 p-1.5 hover:bg-white/10 inline-flex items-center justify-center h-8 w-8 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}