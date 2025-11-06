"use client";

import { useState } from "react";
import { LayoutDashboard, Users, BookOpen, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  activeTab: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Content Management", href: "/content", icon: BookOpen },
];

export function Sidebar({ activeTab }: SidebarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <div className={`flex h-full flex-col space-y-4 p-4 border-r ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Lisan</h2>
        <Button variant="ghost" onClick={toggleTheme}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <Separator className="bg-gray-200 dark:bg-gray-700" />
      <nav className="flex flex-col space-y-2">
        {navigation.map((item) => {
          const isActive = activeTab === item.href;
          return (
            <Link key={item.name} href={item.href} passHref>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start text-base ${isActive ? "bg-gray-300 dark:bg-gray-600 text-black dark:text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}