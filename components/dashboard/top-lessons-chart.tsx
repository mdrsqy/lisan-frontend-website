// frontend/components/dashboard/top-lessons-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopLesson {
  title: string;
  views: number;
}

interface TopLessonsChartProps {
  data: TopLesson[];
}

export function TopLessonsChart({ data }: TopLessonsChartProps) {
  // Ubah data untuk sumbu X agar lebih singkat (ambil 2 kata pertama)
  const chartData = data.map((item) => ({
    ...item,
    shortTitle: item.title.split(" ").slice(0, 2).join(" "),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Top 5 Most Completed Lessons</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pr-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="shortTitle"
              stroke="var(--color-muted-foreground)"
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                color: "var(--color-popover-foreground)",
              }}
              labelFormatter={(label) =>
                data.find((item) => item.title.includes(label))?.title || label
              }
              formatter={(value: number) => [value.toLocaleString(), "Views"]}
            />
            <Bar
              dataKey="views"
              fill="var(--color-chart-1)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
