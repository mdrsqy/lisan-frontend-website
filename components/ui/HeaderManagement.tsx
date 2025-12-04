"use client";

import { Home, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface HeaderManagementProps {
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: ReactNode;
}

export function HeaderManagement({ title, subtitle, breadcrumbs, actions }: HeaderManagementProps) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="flex flex-col gap-6 relative z-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/60 shadow-sm w-fit">
          <Link href="/admin/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-300" />
              {item.href ? (
                <Link href={item.href} className="hover:text-indigo-600 transition-colors">
                  {item.label}
                </Link>
              ) : item.onClick ? (
                <button onClick={item.onClick} className={`hover:text-indigo-600 transition-colors ${item.active ? 'text-indigo-600' : ''}`}>
                  {item.label}
                </button>
              ) : (
                <span className={`px-2 py-0.5 rounded-md ${item.active ? 'text-slate-800 bg-slate-100' : ''}`}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Date Display */}
        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/60 shadow-sm w-fit">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          {formattedDate}
        </div>
      </div>

      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            {title}
          </h1>
          <p className="text-slate-500 font-medium mt-2 max-w-xl text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>

        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}