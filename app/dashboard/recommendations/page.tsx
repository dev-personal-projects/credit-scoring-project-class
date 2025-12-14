"use client";

import { useEffect, useState } from "react";
import { RecommendationsList } from "@/components/dashboard/recommendations-list";
import { QuickActions } from "@/components/dashboard/quick-actions";
import type { UserCreditProfile, LoanRecommendation } from "@/lib/types";
import { generateRecommendation } from "@/lib/recommendations";

export default function RecommendationsPage() {
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
      const users: UserCreditProfile[] = data.users || [];

      const recs = users.map((user) => generateRecommendation(user));
      setRecommendations(recs);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">
            Loading recommendations...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Loan Recommendations
          </h1>
          <p className="text-muted-foreground">
            Review loan increment recommendations for all users
          </p>
        </div>
        <QuickActions onRefresh={loadData} onGenerateData={loadData} />
      </div>

      <RecommendationsList recommendations={recommendations} />
    </div>
  );
}
