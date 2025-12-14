"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import type { CreditHistory } from "@/lib/types";

interface CreditScoreChartProps {
  history: CreditHistory[];
  title?: string;
}

// Get color based on credit score
const getScoreColor = (score: number): string => {
  if (score >= 750) return "#10b981"; // green-500
  if (score >= 700) return "#3b82f6"; // blue-500
  if (score >= 650) return "#eab308"; // yellow-500
  if (score >= 580) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
};

export function CreditScoreChart({
  history,
  title = "Credit Score Trend",
}: CreditScoreChartProps) {
  const chartData = history.map((entry) => ({
    date: format(new Date(entry.date), "MMM yyyy"),
    score: entry.creditScore,
    fullDate: entry.date,
    color: getScoreColor(entry.creditScore),
  }));

  // Calculate average score for reference line
  const avgScore =
    chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#3b82f6"
                    stopOpacity={0.4}
                    className="dark:stop-opacity-60"
                  />
                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0}
                    className="dark:stop-opacity-20"
                  />
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
                domain={[300, 850]}
                className="text-xs"
                tick={{
                  fill: "hsl(var(--foreground))",
                  fontSize: 11,
                  opacity: 0.8,
                }}
                stroke="hsl(var(--border))"
                label={{
                  value: "Credit Score",
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
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const score = payload[0].value as number;
                    return (
                      <div
                        className="rounded-lg border p-3 shadow-lg"
                        style={{
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                        }}
                      >
                        <p
                          className="text-xs font-medium mb-1"
                          style={{ color: "hsl(var(--muted-foreground))" }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: getScoreColor(score) }}
                        >
                          {score}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{
                            color: "hsl(var(--muted-foreground))",
                            opacity: 0.8,
                          }}
                        >
                          Credit Score
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={avgScore}
                stroke="#8b5cf6"
                strokeDasharray="5 5"
                strokeOpacity={0.7}
                label={{
                  value: `Avg: ${Math.round(avgScore)}`,
                  position: "right",
                  fill: "hsl(var(--foreground))",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              />
              <ReferenceLine
                y={700}
                stroke="#10b981"
                strokeDasharray="3 3"
                strokeOpacity={0.6}
                label={{
                  value: "Good (700+)",
                  position: "right",
                  fill: "hsl(var(--foreground))",
                  fontSize: 10,
                  fontWeight: 500,
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#scoreGradient)"
                dot={{ r: 3, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{
                  r: 5,
                  fill: "#3b82f6",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                name="Credit Score"
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
                  color: "hsl(var(--foreground))",
                  opacity: 0.9,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
