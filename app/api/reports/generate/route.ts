import { NextResponse } from "next/server";
import {
  generateCreditScoreReport,
  generateRiskAssessmentReport,
  generateFinancialActionReport,
} from "@/lib/report-generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportType, reportData } = body;

    if (!reportType || !reportData) {
      return NextResponse.json(
        { error: "Report type and data are required" },
        { status: 400 }
      );
    }

    let report: string;

    switch (reportType) {
      case "credit-score":
        report = await generateCreditScoreReport(reportData);
        break;
      case "risk-assessment":
        report = await generateRiskAssessmentReport(reportData);
        break;
      case "financial-action":
        report = await generateFinancialActionReport(reportData);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
