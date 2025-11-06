// components/ui/button.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils"; // Optional utility to handle classNames conditionally

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ variant = "ghost", children, className, ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md text-sm font-semibold focus:outline-none";
  const ghostStyle = "bg-transparent text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600";
  const secondaryStyle = "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700";

  const variantStyle = variant === "secondary" ? secondaryStyle : ghostStyle;

  return (
    <button {...props} className={cn(baseStyle, variantStyle, className)}>
      {children}
    </button>
  );
};