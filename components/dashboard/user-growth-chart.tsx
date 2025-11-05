// frontend/components/dashboard/user-growth-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface UserGrowthData {
  month: string;
  total: number; // Total Users
  mau: number; // Monthly Active Users
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">User Growth & MAU Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] pr-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                color: "var(--color-popover-foreground)",
              }}
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name === "total" ? "Total Users" : "MAU",
              ]}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            {/* Garis Total Users (Warna lebih gelap) */}
            <Line
              type="monotone"
              dataKey="total"
              name="Total Users"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
            />
            {/* Garis MAU (Warna lebih terang) */}
            <Line
              type="monotone"
              dataKey="mau"
              name="MAU"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
