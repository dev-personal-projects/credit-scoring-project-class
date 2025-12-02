import { analyzeCreditProfile } from "@/lib/azure-ai-service";
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

    const analysis = await analyzeCreditProfile(userData);

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
