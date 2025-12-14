"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditScoreChart } from "@/components/dashboard/credit-score-chart";
import { PaymentHistoryChart } from "@/components/dashboard/payment-history-chart";
import { RiskIndicators } from "@/components/dashboard/risk-indicators";
import { DebtRatioGauge } from "@/components/dashboard/debt-ratio-gauge";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { AIChat } from "@/components/dashboard/ai-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { UserCreditProfile, LoanRecommendation } from "@/lib/types";
import { generateRecommendation } from "@/lib/recommendations";
import { format } from "date-fns";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserCreditProfile | null>(null);
  const [recommendation, setRecommendation] =
    useState<LoanRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-data?count=50");
      const data = await response.json();
      const users: UserCreditProfile[] = data.users || [];
      const foundUser = users.find((u) => u.id === params.id);

      if (foundUser) {
        setUser(foundUser);
        setRecommendation(generateRecommendation(foundUser));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading user profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">User not found</div>
          <Button
            onClick={() => router.push("/dashboard/users")}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600 dark:text-green-400";
    if (score >= 700) return "text-blue-600 dark:text-blue-400";
    if (score >= 650) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 580) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getRiskBadgeVariant = (risk: string) => {
    if (risk === "low") return "default";
    if (risk === "medium") return "secondary";
    return "destructive";
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === "active") return "default";
    if (status === "inactive") return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/users")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Credit Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-5xl font-bold ${getScoreColor(
                user.currentCreditScore
              )}`}
            >
              {user.currentCreditScore}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: {format(new Date(user.lastUpdated), "MMM d, yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={getRiskBadgeVariant(user.riskLevel)}
              className="text-lg px-4 py-2"
            >
              {user.riskLevel.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={getStatusBadgeVariant(user.status)}
              className="text-lg px-4 py-2"
            >
              {user.status.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {recommendation && <RecommendationCard recommendation={recommendation} />}

      {user && (
        <AIInsights user={user} recommendation={recommendation || undefined} />
      )}

      {user && recommendation && (
        <AIChat
          context={{
            user: user as unknown as Record<string, unknown>,
            recommendation: recommendation as unknown as Record<
              string,
              unknown
            >,
          }}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <CreditScoreChart history={user.creditHistory} />
        <PaymentHistoryChart history={user.creditHistory} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RiskIndicators user={user} />
        <DebtRatioGauge user={user} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">
                Monthly Income
              </div>
              <div className="text-lg font-semibold">
                ${user.monthlyIncome.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Debt</div>
              <div className="text-lg font-semibold">
                ${user.totalDebt.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Account Age</div>
              <div className="text-lg font-semibold">
                {user.accountAge} months
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Credit Utilization
              </div>
              <div className="text-lg font-semibold">
                {user.creditUtilization}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                On-Time Payments
              </div>
              <div className="text-lg font-semibold">
                {user.paymentHistory.onTime}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Late Payments</div>
              <div className="text-lg font-semibold">
                {user.paymentHistory.late}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Missed Payments
              </div>
              <div className="text-lg font-semibold">
                {user.paymentHistory.missed}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
