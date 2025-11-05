// frontend/components/Sidebar.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Users, BookOpen } from "lucide-react"; // Ikon yang relevan

interface SidebarProps {
  activeTab: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Content Management", href: "/content", icon: BookOpen },
];

export function Sidebar({ activeTab }: SidebarProps) {
  return (
    <div className="flex h-full flex-col space-y-4 p-4 border-r bg-sidebar text-sidebar-foreground">
      <h2 className="text-xl font-bold">Lisan</h2>
      <Separator className="bg-sidebar-border" />
      <nav className="flex flex-col space-y-2">
        {navigation.map((item) => {
          const isActive = activeTab === item.href;
          return (
            <Link key={item.name} href={item.href} passHref>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start text-base ${
                  isActive
                    ? "bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-border"
                }`}
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
