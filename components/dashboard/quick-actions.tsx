"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Download, Plus } from "lucide-react";

interface QuickActionsProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onGenerateData?: () => void;
}

export function QuickActions({
  onRefresh,
  onExport,
  onGenerateData,
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          )}
          {onGenerateData && (
            <Button variant="outline" onClick={onGenerateData}>
              <Plus className="mr-2 h-4 w-4" />
              Generate New Data
            </Button>
          )}
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
