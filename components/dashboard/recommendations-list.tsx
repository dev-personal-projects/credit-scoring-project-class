"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecommendationCard } from "./recommendation-card";
import type { LoanRecommendation } from "@/lib/types";

interface RecommendationsListProps {
  recommendations: LoanRecommendation[];
}

export function RecommendationsList({
  recommendations,
}: RecommendationsListProps) {
  const approved = recommendations.filter(
    (r) => r.recommendation === "approve"
  );
  const conditional = recommendations.filter(
    (r) => r.recommendation === "conditional"
  );
  const rejected = recommendations.filter((r) => r.recommendation === "reject");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Increment Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({recommendations.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approved.length})
            </TabsTrigger>
            <TabsTrigger value="conditional">
              Conditional ({conditional.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejected.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.userId} recommendation={rec} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {approved.map((rec) => (
                <RecommendationCard key={rec.userId} recommendation={rec} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="conditional" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {conditional.map((rec) => (
                <RecommendationCard key={rec.userId} recommendation={rec} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {rejected.map((rec) => (
                <RecommendationCard key={rec.userId} recommendation={rec} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
