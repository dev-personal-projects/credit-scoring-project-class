"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserCreditProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: UserCreditProfile;
  onClick?: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
    <Card
      className={cn(
        "cursor-pointer transition-shadow hover:shadow-md",
        onClick && "hover:border-primary"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{user.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Credit Score</span>
            <span
              className={cn(
                "text-2xl font-bold",
                getScoreColor(user.currentCreditScore)
              )}
            >
              {user.currentCreditScore}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Debt-to-Income
            </span>
            <span className="text-sm font-medium">
              {(user.debtToIncomeRatio * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risk Level</span>
            <Badge variant={getRiskBadgeVariant(user.riskLevel)}>
              {user.riskLevel.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={getStatusBadgeVariant(user.status)}>
              {user.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
