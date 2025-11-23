"use client";

import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  width?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  width = "max-w-md",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fadeIn">
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full ${width} animate-scaleIn`}
      >
        {title && (
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            {title}
          </h2>
        )}

        <div className="text-gray-700">{children}</div>

        {actions && <div className="mt-6 flex justify-end gap-3">{actions}</div>}
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.18s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes scaleIn {
          from { transform: scale(0.92) }
          to { transform: scale(1) }
        }
      `}</style>
    </div>
  );
}