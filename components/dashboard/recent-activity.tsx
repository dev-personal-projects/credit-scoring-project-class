"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { RecentActivity } from "@/lib/types";
import { CreditCard, TrendingUp, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  activities: RecentActivity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "score_change":
        return <TrendingUp className="h-4 w-4" />;
      case "recommendation":
        return <FileText className="h-4 w-4" />;
      case "status_change":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact?: string) => {
    if (impact === "positive") return "text-green-600 dark:text-green-400";
    if (impact === "negative") return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div
                className={cn(
                  "mt-1 rounded-full p-2",
                  activity.impact === "positive"
                    ? "bg-green-100 dark:bg-green-900/20"
                    : activity.impact === "negative"
                    ? "bg-red-100 dark:bg-red-900/20"
                    : "bg-muted"
                )}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.userName}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(activity.timestamp), "MMM d, HH:mm")}
                  </span>
                </div>
                <p className={cn("text-sm", getImpactColor(activity.impact))}>
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
