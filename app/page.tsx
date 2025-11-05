// frontend/app/page.tsx
import { LayoutDashboard, Users, BookOpen, BarChart3 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TopLessonsChart } from "@/components/dashboard/top-lessons-chart";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { LevelDistributionChart } from "@/components/dashboard/level-distribution-chart";

// Kita perlu type untuk data Dashboard
interface DashboardData {
  kpis: {
    totalUsers: number;
    monthlyActiveUsers: number;
    totalLessons: number;
    avgCompletionRate: number; // 68
    userGrowthTrend: number; // 23
  };
  recentActivity: {
    name: string;
    action: string;
    lesson: string;
    time: string;
  }[];
  topLessons: {
    title: string;
    views: number;
  }[];
}

async function getDashboardData(): Promise<DashboardData | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch dashboard data");
    return null;
  }
  return res.json();
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data)
    return (
      <div className="text-red-400">
        Failed to load dashboard data. Check API logs.
      </div>
    );

  // --- PASTIKAN NAMA VARIABEL INI SAMA DENGAN PROPS DI BAWAH ---
  const userGrowthData = [
    { month: "Jun", total: 1500, mau: 800 },
    { month: "Jul", total: 1650, mau: 950 },
    { month: "Aug", total: 1800, mau: 1050 },
    { month: "Sep", total: 2000, mau: 1200 },
    { month: "Oct", total: 2400, mau: 1500 },
    {
      month: "Nov",
      total: data.kpis.totalUsers,
      mau: data.kpis.monthlyActiveUsers,
    },
  ];

  const levelDistributionData = [
    { name: "Beginner", value: 40, color: "var(--color-chart-1)" },
    { name: "Intermediate", value: 35, color: "var(--color-chart-2)" },
    { name: "Advanced", value: 25, color: "var(--color-chart-3)" },
  ];
  // --- AKHIR DEFINISI VARIABEL ---

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Users"
          value={data.kpis.totalUsers.toLocaleString()}
          icon={Users}
          change={`+${data.kpis.userGrowthTrend}% from last month`}
          changeType="up"
        />
        <KpiCard
          title="Monthly Active Users"
          value={data.kpis.monthlyActiveUsers.toLocaleString()}
          icon={LayoutDashboard}
          change={`+${data.kpis.userGrowthTrend + 5}% from last month`}
          changeType="up"
        />
        <KpiCard
          title="Avg. Completion Rate"
          value={`${data.kpis.avgCompletionRate}%`}
          icon={BarChart3}
          change="-5% from last month"
          changeType="down"
        />
        <KpiCard
          title="Total Lessons"
          value={data.kpis.totalLessons.toLocaleString()}
          icon={BookOpen}
          change={`+8 new this month`}
          changeType="up"
        />
      </div>

      {/* Main Charts & Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Growth & MAU Trend */}
        <div className="lg:col-span-2">
          {/* PASTIKAN NAMA PROPS SAMA DENGAN VARIABEL DI ATAS */}
          <UserGrowthChart data={userGrowthData} />
        </div>

        {/* Recent Activity */}
        <ActivityFeed activities={data.recentActivity} />
      </div>

      {/* Bottom Charts */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* User Distribution by Level */}
        <div className="lg:col-span-2">
          {/* PASTIKAN NAMA PROPS SAMA DENGAN VARIABEL DI ATAS */}
          <LevelDistributionChart data={levelDistributionData} />
        </div>

        {/* Top 5 Lessons */}
        <div className="lg:col-span-3">
          <TopLessonsChart data={data.topLessons} />
        </div>
      </div>
    </div>
  );
}
