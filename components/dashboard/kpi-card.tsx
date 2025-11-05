// frontend/components/dashboard/kpi-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: string; // Misal: "+23% from last month"
  changeType: "up" | "down" | "neutral";
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: KpiCardProps) {
  const TrendIcon = changeType === "up" ? TrendingUp : TrendingDown;
  const changeColor = changeType === "up" ? "text-accent" : "text-destructive";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center mt-1 text-sm">
          <TrendIcon className={`h-4 w-4 mr-1 ${changeColor}`} />
          <span className={changeColor}>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}
