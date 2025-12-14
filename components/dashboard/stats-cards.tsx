"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import type { CreditMetrics } from "@/lib/types";

interface StatsCardsProps {
  metrics: CreditMetrics;
}

export function StatsCards({ metrics }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Users",
      value: metrics.totalUsers.toLocaleString(),
      icon: Users,
      description: "Active credit profiles",
    },
    {
      title: "Avg Credit Score",
      value: metrics.averageCreditScore,
      icon: TrendingUp,
      description: "Average across all users",
    },
    {
      title: "Approval Rate",
      value: `${metrics.approvalRate}%`,
      icon: DollarSign,
      description: "Loan increment approvals",
    },
    {
      title: "High Risk Users",
      value: metrics.riskDistribution.high,
      icon: AlertTriangle,
      description: "Require attention",
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
