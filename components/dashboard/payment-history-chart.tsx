"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { CreditHistory } from "@/lib/types";

interface PaymentHistoryChartProps {
  history: CreditHistory[];
  title?: string;
}

export function PaymentHistoryChart({
  history,
  title = "Payment History",
}: PaymentHistoryChartProps) {
  const chartData = history.map((entry) => {
    const statusCounts = {
      onTime: entry.paymentStatus === "on-time" ? 1 : 0,
      late: entry.paymentStatus === "late" ? 1 : 0,
      missed: entry.paymentStatus === "missed" ? 1 : 0,
    };
    return {
      date: format(new Date(entry.date), "MMM yyyy"),
      "On Time": statusCounts.onTime,
      Late: statusCounts.late,
      Missed: statusCounts.missed,
    };
  });

  // Aggregate by month
  const aggregated = chartData.reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      existing["On Time"] += curr["On Time"];
      existing.Late += curr.Late;
      existing.Missed += curr.Missed;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as typeof chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregated}>
              <defs>
                <linearGradient id="onTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ca8a04" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="missedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted))"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{
                  fill: "hsl(var(--foreground))",
                  fontSize: 11,
                  opacity: 0.8,
                }}
                stroke="hsl(var(--border))"
              />
              <YAxis
                className="text-xs"
                tick={{
                  fill: "hsl(var(--foreground))",
                  fontSize: 11,
                  opacity: 0.8,
                }}
                stroke="hsl(var(--border))"
                label={{
                  value: "Number of Payments",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: "hsl(var(--foreground))",
                    opacity: 0.9,
                  },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "calc(var(--radius) - 2px)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{
                  color: "hsl(var(--popover-foreground))",
                  fontWeight: 600,
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  color: "hsl(var(--foreground))",
                }}
                iconType="square"
              />
              <Bar
                dataKey="On Time"
                fill="url(#onTimeGradient)"
                name="On Time"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Late"
                fill="url(#lateGradient)"
                name="Late"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Missed"
                fill="url(#missedGradient)"
                name="Missed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
