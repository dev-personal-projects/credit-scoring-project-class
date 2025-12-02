"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UserCreditProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DebtRatioGaugeProps {
  user: UserCreditProfile;
}

export function DebtRatioGauge({ user }: DebtRatioGaugeProps) {
  const ratio = user.debtToIncomeRatio * 100;
  const getColor = () => {
    if (ratio < 30) return "text-green-600 dark:text-green-400";
    if (ratio < 40) return "text-blue-600 dark:text-blue-400";
    if (ratio < 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = () => {
    if (ratio < 30)
      return "[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-600";
    if (ratio < 40)
      return "[&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-600";
    if (ratio < 50)
      return "[&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-amber-600";
    return "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-rose-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debt-to-Income Ratio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={
                    ratio < 30
                      ? "#10b981"
                      : ratio < 40
                      ? "#3b82f6"
                      : ratio < 50
                      ? "#eab308"
                      : "#ef4444"
                  }
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(ratio / 100) * 351.86} 351.86`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={cn("text-3xl font-bold", getColor())}>
                    {ratio.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">DTI Ratio</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Debt</span>
              <span className="font-medium">
                ${user.totalDebt.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly Income</span>
              <span className="font-medium">
                ${user.monthlyIncome.toLocaleString()}
              </span>
            </div>
            <Progress value={ratio} className={cn("h-2", getProgressColor())} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>30% (Good)</span>
              <span>40% (Fair)</span>
              <span>50% (High)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
