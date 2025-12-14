"use client";

import { useEffect, useState } from "react";
import { ReportGenerator } from "@/components/dashboard/report-generator";
import { FileText, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";
import type {
  UserCreditProfile,
  CreditMetrics,
  LoanRecommendation,
} from "@/lib/types";
import {
  calculateMetrics,
  generateRecommendation,
} from "@/lib/recommendations";

export default function ReportsPage() {
  const [users, setUsers] = useState<UserCreditProfile[]>([]);
  const [metrics, setMetrics] = useState<CreditMetrics>({
    totalUsers: 0,
    averageCreditScore: 0,
    approvalRate: 0,
    totalDebt: 0,
    averageDebtToIncome: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 },
  });
  const [recommendations, setRecommendations] = useState<LoanRecommendation[]>(
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

      const recs = loadedUsers.map((user) => generateRecommendation(user));
      setRecommendations(recs);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const reportData = {
    users,
    metrics,
    recommendations,
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading reports...</div>
          <div className="text-sm text-muted-foreground">
            Preparing data for report generation
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
            AI-Powered Reports
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Generate comprehensive financial reports for decision-making using
            Azure AI
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 w-full sm:w-auto justify-center sm:justify-start">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs sm:text-sm font-medium">
            Powered by Azure AI
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-2">
        <ReportGenerator
          reportType="credit-score"
          reportData={reportData}
          title="Credit Score Analysis Report"
          description="Comprehensive analysis of credit scores, trends, and portfolio performance for financial decision-making"
          icon={
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          }
        />

        <ReportGenerator
          reportType="risk-assessment"
          reportData={reportData}
          title="Risk Assessment Report"
          description="Detailed risk analysis, default probability assessment, and risk mitigation strategies"
          icon={
            <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          }
        />

        <ReportGenerator
          reportType="financial-action"
          reportData={reportData}
          title="Financial Action Report"
          description="Actionable recommendations for loan approvals, credit limits, and financial operations"
          icon={
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          }
        />
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        <h3 className="font-semibold mb-2">Report Features</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>AI-generated comprehensive financial analysis</li>
          <li>Actionable recommendations for financial decisions</li>
          <li>Risk assessment and mitigation strategies</li>
          <li>Regulatory compliance considerations</li>
          <li>Downloadable reports in text format</li>
          <li>Professional formatting suitable for executive review</li>
        </ul>
      </div>
    </div>
  );
}
