"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import type { UserCreditProfile } from "@/lib/types";

interface RiskIndicatorsProps {
  user: UserCreditProfile;
}

export function RiskIndicators({ user }: RiskIndicatorsProps) {
  const indicators = [
    {
      label: "Credit Score",
      value: user.currentCreditScore,
      threshold: 700,
      good: user.currentCreditScore >= 700,
      warning: user.currentCreditScore >= 580 && user.currentCreditScore < 700,
      critical: user.currentCreditScore < 580,
    },
    {
      label: "Debt-to-Income Ratio",
      value: (user.debtToIncomeRatio * 100).toFixed(1) + "%",
      threshold: 40,
      good: user.debtToIncomeRatio < 0.4,
      warning: user.debtToIncomeRatio >= 0.4 && user.debtToIncomeRatio < 0.5,
      critical: user.debtToIncomeRatio >= 0.5,
    },
    {
      label: "Credit Utilization",
      value: user.creditUtilization + "%",
      threshold: 30,
      good: user.creditUtilization < 30,
      warning: user.creditUtilization >= 30 && user.creditUtilization < 70,
      critical: user.creditUtilization >= 70,
    },
    {
      label: "Payment History",
      value:
        (
          (user.paymentHistory.onTime /
            (user.paymentHistory.onTime +
              user.paymentHistory.late +
              user.paymentHistory.missed)) *
          100
        ).toFixed(1) + "%",
      threshold: 85,
      good:
        user.paymentHistory.onTime /
          (user.paymentHistory.onTime +
            user.paymentHistory.late +
            user.paymentHistory.missed) >=
        0.85,
      warning:
        user.paymentHistory.onTime /
          (user.paymentHistory.onTime +
            user.paymentHistory.late +
            user.paymentHistory.missed) >=
          0.7 &&
        user.paymentHistory.onTime /
          (user.paymentHistory.onTime +
            user.paymentHistory.late +
            user.paymentHistory.missed) <
          0.85,
      critical:
        user.paymentHistory.onTime /
          (user.paymentHistory.onTime +
            user.paymentHistory.late +
            user.paymentHistory.missed) <
        0.7,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Indicators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {indicators.map((indicator) => (
          <div key={indicator.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{indicator.label}</span>
              <div className="flex items-center gap-2">
                {indicator.good && (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
                {indicator.warning && (
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                )}
                {indicator.critical && (
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
                <span className="text-sm font-semibold">{indicator.value}</span>
              </div>
            </div>
            {typeof indicator.value === "number" && (
              <Progress
                value={
                  indicator.label === "Credit Score"
                    ? ((indicator.value - 300) / 550) * 100
                    : indicator.label === "Debt-to-Income Ratio"
                    ? indicator.value * 2
                    : indicator.value
                }
                className={
                  indicator.good
                    ? "[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-600"
                    : indicator.warning
                    ? "[&>div]:bg-gradient-to-r [&>div]:from-yellow-500 [&>div]:to-amber-600"
                    : "[&>div]:bg-gradient-to-r [&>div]:from-red-500 [&>div]:to-rose-600"
                }
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
