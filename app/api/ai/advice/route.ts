import { generateFinancialAdvice } from "@/lib/azure-ai-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userData, recommendation } = body;

    if (!userData || !recommendation) {
      return NextResponse.json(
        { error: "User data and recommendation are required" },
        { status: 400 }
      );
    }

    const advice = await generateFinancialAdvice(userData, recommendation);

    return NextResponse.json({ advice }, { status: 200 });
  } catch (error) {
    console.error("Error generating AI advice:", error);
    return NextResponse.json(
      { error: "Failed to generate advice" },
      { status: 500 }
    );
  }
}
