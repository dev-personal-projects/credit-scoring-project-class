"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import type { CreditMetrics } from "@/lib/types";

interface PortfolioAIInsightsProps {
  metrics: CreditMetrics;
}

export function PortfolioAIInsights({ metrics }: PortfolioAIInsightsProps) {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generatePortfolioInsight = async () => {
    if (insight) return;

    setLoading(true);
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: {
            name: "Portfolio Overview",
            currentCreditScore: metrics.averageCreditScore,
            debtToIncomeRatio: metrics.averageDebtToIncome,
            totalDebt: metrics.totalDebt,
            monthlyIncome:
              metrics.totalDebt / (metrics.averageDebtToIncome * 12),
            creditUtilization: 0,
            accountAge: 0,
            riskLevel: "medium",
            paymentHistory: {
              onTime: Math.round(metrics.approvalRate * 100),
              late: Math.round((100 - metrics.approvalRate) * 50),
              missed: Math.round((100 - metrics.approvalRate) * 50),
            },
            creditHistory: [],
          },
        }),
      });

      const data = await response.json();
      const portfolioAnalysis = `**Portfolio Overview Analysis**

**Key Metrics:**
- Total Users: ${metrics.totalUsers}
- Average Credit Score: ${metrics.averageCreditScore}
- Approval Rate: ${metrics.approvalRate}%
- Risk Distribution: ${metrics.riskDistribution.low} Low, ${
        metrics.riskDistribution.medium
      } Medium, ${metrics.riskDistribution.high} High Risk

${data.analysis || "Analysis generated successfully."}

**Portfolio Health Assessment:**
The portfolio shows ${
        metrics.approvalRate >= 70
          ? "strong"
          : metrics.approvalRate >= 50
          ? "moderate"
          : "concerning"
      } overall health with ${
        metrics.averageCreditScore >= 700
          ? "excellent"
          : metrics.averageCreditScore >= 650
          ? "good"
          : "below average"
      } average credit scores.`;

      setInsight(portfolioAnalysis);
    } catch (error) {
      console.error("Error generating portfolio insight:", error);
      setInsight("Unable to generate portfolio insights at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Portfolio AI Analysis
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Azure AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
          <div>
            <div className="text-sm font-medium mb-1">
              Get AI-Powered Portfolio Insights
            </div>
            <div className="text-xs text-muted-foreground">
              Analyze overall portfolio health, trends, and recommendations
            </div>
          </div>
          <Button
            onClick={generatePortfolioInsight}
            disabled={loading || !!insight}
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : insight ? (
              "View Analysis"
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>

        {insight && (
          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {insight}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
