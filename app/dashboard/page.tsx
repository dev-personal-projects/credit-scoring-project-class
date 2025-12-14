"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { UserCard } from "@/components/dashboard/user-card";
import { PortfolioAIInsights } from "@/components/dashboard/portfolio-ai-insights";
import { AIChat } from "@/components/dashboard/ai-chat";
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
import type {
  UserCreditProfile,
  CreditMetrics,
  RecentActivity as RecentActivityType,
} from "@/lib/types";
import {
  calculateMetrics,
  generateRecommendation,
} from "@/lib/recommendations";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [users, setUsers] = useState<UserCreditProfile[]>([]);
  const [metrics, setMetrics] = useState<CreditMetrics>({
    totalUsers: 0,
    averageCreditScore: 0,
    approvalRate: 0,
    totalDebt: 0,
    averageDebtToIncome: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 },
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivityType[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-data?count=50");
      const data = await response.json();
      const loadedUsers: UserCreditProfile[] = data.users || [];
      setUsers(loadedUsers);

      const calculatedMetrics = calculateMetrics(loadedUsers);
      setMetrics(calculatedMetrics);

      // Generate recent activity
      const activities: RecentActivityType[] = [];
      loadedUsers.slice(0, 20).forEach((user) => {
        const recommendation = generateRecommendation(user);
        activities.push({
          id: `activity-${user.id}-rec`,
          userId: user.id,
          userName: user.name,
          type: "recommendation",
          description: `Loan increment ${recommendation.recommendation} for ${user.name}`,
          timestamp: new Date().toISOString(),
          impact:
            recommendation.recommendation === "approve"
              ? "positive"
              : recommendation.recommendation === "reject"
              ? "negative"
              : "neutral",
        });

        if (user.creditHistory.length > 0) {
          const latestHistory =
            user.creditHistory[user.creditHistory.length - 1];
          activities.push({
            id: `activity-${user.id}-score`,
            userId: user.id,
            userName: user.name,
            type: "score_change",
            description: `Credit score updated to ${latestHistory.creditScore}`,
            timestamp: latestHistory.date,
            impact:
              latestHistory.creditScore > user.currentCreditScore
                ? "positive"
                : latestHistory.creditScore < user.currentCreditScore
                ? "negative"
                : "neutral",
          });
        }
      });
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setRecentActivity(activities);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const scoreDistribution = [
    {
      range: "300-579",
      count: users.filter((u) => u.currentCreditScore < 580).length,
    },
    {
      range: "580-669",
      count: users.filter(
        (u) => u.currentCreditScore >= 580 && u.currentCreditScore < 670
      ).length,
    },
    {
      range: "670-739",
      count: users.filter(
        (u) => u.currentCreditScore >= 670 && u.currentCreditScore < 740
      ).length,
    },
    {
      range: "740-799",
      count: users.filter(
        (u) => u.currentCreditScore >= 740 && u.currentCreditScore < 800
      ).length,
    },
    {
      range: "800-850",
      count: users.filter((u) => u.currentCreditScore >= 800).length,
    },
  ];

  const topRiskUsers = [...users]
    .filter((u) => u.riskLevel === "high")
    .sort((a, b) => a.currentCreditScore - b.currentCreditScore)
    .slice(0, 5);

  const recentRecommendations = users
    .slice(0, 5)
    .map((user) => generateRecommendation(user))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading dashboard...</div>
          <div className="text-sm text-muted-foreground">
            Generating credit data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitor user credit behavior and loan recommendations
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <QuickActions onRefresh={loadData} onGenerateData={loadData} />
        </div>
      </div>

      <StatsCards metrics={metrics} />

      <PortfolioAIInsights metrics={metrics} />

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Credit Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={250}
              className="sm:h-[300px]"
            >
              <BarChart data={scoreDistribution}>
                <defs>
                  <linearGradient
                    id="distributionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--muted))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="range"
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
                    value: "Number of Users",
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
                  formatter={(value: number) => [
                    <span key="count" style={{ fontWeight: 600 }}>
                      {value}
                    </span>,
                    "Users",
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill="url(#distributionGradient)"
                  name="Users"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <RecentActivity activities={recentActivity} />
        <AIChat context={{ metrics, users }} />
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base sm:text-lg">
              Top Risk Users
            </CardTitle>
            <Link href="/dashboard/users" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRiskUsers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No high-risk users found
                </div>
              ) : (
                topRiskUsers.map((user) => (
                  <Link key={user.id} href={`/dashboard/users/${user.id}`}>
                    <UserCard user={user} />
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base sm:text-lg">
              Recent Recommendations
            </CardTitle>
            <Link
              href="/dashboard/recommendations"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecommendations.map((rec) => (
                <div
                  key={rec.userId}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <div className="font-medium">{rec.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {rec.recommendation.toUpperCase()} - {rec.confidence}%
                      confidence
                    </div>
                  </div>
                  {rec.recommendedAmount && (
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Amount
                      </div>
                      <div className="font-bold">
                        ${rec.recommendedAmount.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
