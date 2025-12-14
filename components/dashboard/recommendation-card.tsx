"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { LoanRecommendation } from "@/lib/types";
import { CheckCircle, XCircle, AlertCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  recommendation: LoanRecommendation;
}

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const getRecommendationIcon = () => {
    if (recommendation.recommendation === "approve") {
      return (
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      );
    }
    if (recommendation.recommendation === "reject") {
      return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
    return (
      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
    );
  };

  const getRecommendationBadgeVariant = () => {
    if (recommendation.recommendation === "approve") return "default";
    if (recommendation.recommendation === "reject") return "destructive";
    return "secondary";
  };

  const getConfidenceColor = () => {
    if (recommendation.confidence >= 70)
      return "text-green-600 dark:text-green-400";
    if (recommendation.confidence >= 50)
      return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getRecommendationIcon()}
            {recommendation.userName}
          </CardTitle>
          <Badge variant={getRecommendationBadgeVariant()}>
            {recommendation.recommendation.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendation.recommendedAmount && (
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">
                Recommended Amount
              </div>
              <div className="text-2xl font-bold">
                ${recommendation.recommendedAmount.toLocaleString()}
              </div>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className={cn("font-semibold", getConfidenceColor())}>
              {recommendation.confidence}%
            </span>
          </div>
          <Progress value={recommendation.confidence} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Reasoning</div>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {recommendation.reasoning.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
        {recommendation.riskFactors.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-destructive">
              Risk Factors
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-destructive/80">
              {recommendation.riskFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
