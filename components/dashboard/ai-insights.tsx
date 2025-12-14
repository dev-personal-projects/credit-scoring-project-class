"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserCreditProfile, LoanRecommendation } from "@/lib/types";

interface AIInsightsProps {
  user: UserCreditProfile;
  recommendation?: LoanRecommendation;
}

type InsightType = "analysis" | "advice" | "risk" | "prediction" | "anomalies";

export function AIInsights({ user, recommendation }: AIInsightsProps) {
  const [activeTab, setActiveTab] = useState<InsightType | null>(null);
  const [insights, setInsights] = useState<Record<InsightType, string>>({
    analysis: "",
    advice: "",
    risk: "",
    prediction: "",
    anomalies: "",
  });
  const [loading, setLoading] = useState<Record<InsightType, boolean>>({
    analysis: false,
    advice: false,
    risk: false,
    prediction: false,
    anomalies: false,
  });

  const fetchInsight = async (type: InsightType) => {
    if (insights[type]) {
      setActiveTab(type);
      return;
    }

    setLoading((prev) => ({ ...prev, [type]: true }));
    setActiveTab(type);

    try {
      let endpoint = "";
      let body: Record<string, unknown> = { userData: user };

      switch (type) {
        case "analysis":
          endpoint = "/api/ai/analyze";
          break;
        case "advice":
          endpoint = "/api/ai/advice";
          body = { userData: user, recommendation };
          break;
        case "risk":
          endpoint = "/api/ai/explain-risk";
          body = {
            userData: user,
            riskFactors: recommendation?.riskFactors || [],
          };
          break;
        case "prediction":
          endpoint = "/api/ai/predict";
          break;
        case "anomalies":
          endpoint = "/api/ai/anomalies";
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const content =
        type === "analysis"
          ? data.analysis
          : type === "advice"
          ? data.advice
          : type === "risk"
          ? data.explanation
          : type === "prediction"
          ? data.prediction
          : data.anomalies;

      setInsights((prev) => ({ ...prev, [type]: content || "" }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setInsights((prev) => ({
        ...prev,
        [type]: "Unable to generate insights at this time. Please try again.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const tabs = [
    {
      id: "analysis" as InsightType,
      label: "Credit Analysis",
      icon: Sparkles,
      description: "AI-powered comprehensive credit profile analysis",
    },
    {
      id: "advice" as InsightType,
      label: "Financial Advice",
      icon: Lightbulb,
      description: "Personalized recommendations to improve credit",
      disabled: !recommendation,
    },
    {
      id: "risk" as InsightType,
      label: "Risk Explanation",
      icon: AlertCircle,
      description: "Understand your risk factors in plain language",
      disabled: !recommendation || !recommendation?.riskFactors?.length,
    },
    {
      id: "prediction" as InsightType,
      label: "Credit Forecast",
      icon: TrendingUp,
      description: "Predict future credit score trends",
    },
    {
      id: "anomalies" as InsightType,
      label: "Anomaly Detection",
      icon: AlertCircle,
      description: "Identify unusual patterns in credit behavior",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Financial Insights
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Powered by Azure AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isLoading = loading[tab.id];
            const hasContent = !!insights[tab.id];

            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "h-auto flex-col items-start p-4 text-left",
                  tab.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !tab.disabled && fetchInsight(tab.id)}
                disabled={tab.disabled || isLoading}
              >
                <div className="flex items-center gap-2 w-full mb-1">
                  <Icon className="h-4 w-4" />
                  <span className="font-semibold text-sm">{tab.label}</span>
                  {isLoading && (
                    <Loader2 className="h-3 w-3 ml-auto animate-spin" />
                  )}
                  {hasContent && !isLoading && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      Ready
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {tab.description}
                </span>
              </Button>
            );
          })}
        </div>

        {activeTab && (
          <div className="mt-6 p-4 rounded-lg border bg-muted/50">
            {loading[activeTab] ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">
                  Generating AI insights...
                </span>
              </div>
            ) : insights[activeTab] ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {insights[activeTab]}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Click a tab above to generate AI insights
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
