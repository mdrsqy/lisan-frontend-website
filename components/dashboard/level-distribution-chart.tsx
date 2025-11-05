// frontend/components/dashboard/level-distribution-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface LevelData {
  name: string;
  value: number; // Persentase
}

interface LevelDistributionChartProps {
  data: LevelData[];
}

export function LevelDistributionChart({ data }: LevelDistributionChartProps) {
  const chartRadius = 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">User Distribution by Level</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          {/* Hapus generic <any> dari PieChart */}
          <PieChart>
            {/* Hapus generic <any> dari Pie */}
            <Pie
              data={data as unknown as Record<string, unknown>[]}
              cx="50%"
              cy="50%"
              innerRadius={chartRadius * 0.6}
              outerRadius={chartRadius * 0.8}
              paddingAngle={5}
              dataKey="value"
              nameKey="name" // Tambahkan nameKey
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`var(--color-chart-${(index % 5) + 1})`}
                  stroke="var(--color-popover)"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            {/* Tooltip dan Legend harusnya bekerja dengan baik sekarang */}
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                color: "var(--color-popover-foreground)",
              }}
              formatter={(value: number) => [`${value}%`, "Percentage"]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "10px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
