import { analyzeAnomalies } from "@/lib/azure-ai-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userData } = body;

    if (!userData) {
      return NextResponse.json(
        { error: "User data is required" },
        { status: 400 }
      );
    }

    const anomalies = await analyzeAnomalies(userData);

    return NextResponse.json({ anomalies }, { status: 200 });
  } catch (error) {
    console.error("Error analyzing anomalies:", error);
    return NextResponse.json(
      { error: "Failed to analyze anomalies" },
      { status: 500 }
    );
  }
}
