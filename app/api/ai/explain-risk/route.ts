import { explainRiskFactors } from "@/lib/azure-ai-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userData, riskFactors } = body;

    if (!userData || !riskFactors) {
      return NextResponse.json(
        { error: "User data and risk factors are required" },
        { status: 400 }
      );
    }

    const explanation = await explainRiskFactors(userData, riskFactors);

    return NextResponse.json({ explanation }, { status: 200 });
  } catch (error) {
    console.error("Error generating risk explanation:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
