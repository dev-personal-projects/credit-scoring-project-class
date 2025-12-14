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
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Refresh Data</span>
            </Button>
          )}
          {onGenerateData && (
            <Button
              variant="outline"
              onClick={onGenerateData}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Generate New Data</span>
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              onClick={onExport}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="text-sm sm:text-base">Export Report</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
