import { predictCreditTrend } from "@/lib/azure-ai-service";
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

    const prediction = await predictCreditTrend(userData);

    return NextResponse.json({ prediction }, { status: 200 });
  } catch (error) {
    console.error("Error generating prediction:", error);
    return NextResponse.json(
      { error: "Failed to generate prediction" },
      { status: 500 }
    );
  }
}
