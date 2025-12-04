"use client";

import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface ManagementBannerProps {
  badgeText: string;
  badgeIcon: ReactNode;
  title: string;
  description: ReactNode;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  className?: string;
}

export function ManagementBanner({ 
  badgeText, 
  badgeIcon, 
  title, 
  description, 
  actionText, 
  onAction,
  actionIcon,
  className = ""
}: ManagementBannerProps) {
  return (
    <div className={`relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl group transition-all duration-500 hover:shadow-indigo-900/20 ${className}`}>
      
      {/* Background Blobs (Abstract Shapes) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/40 transition-colors duration-700 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 group-hover:bg-blue-600/30 transition-colors duration-700 pointer-events-none"></div>
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Left Section: Text Content */}
        <div className="space-y-4 max-w-3xl">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-indigo-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
            {badgeIcon}
            {badgeText}
          </div>
          
          {/* Title */}
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white drop-shadow-sm">
            {title}
          </h3>
          
          {/* Description */}
          <div className="text-slate-300 text-base leading-relaxed">
            {description}
          </div>
        </div>
        
        {/* Right Section: Action Button */}
        {actionText && onAction && (
          <div className="flex-shrink-0">
            <button 
              onClick={onAction}
              className="group/btn relative overflow-hidden px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 flex items-center gap-3 active:scale-95"
            >
              {actionIcon}
              <span>{actionText}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}