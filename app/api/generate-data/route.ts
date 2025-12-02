import { generateCreditData } from "@/lib/azure-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || "50", 10);

    const users = await generateCreditData(count);

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error generating data:", error);
    return NextResponse.json(
      { error: "Failed to generate data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = body.count || 50;

    const users = await generateCreditData(count);

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error generating data:", error);
    return NextResponse.json(
      { error: "Failed to generate data" },
      { status: 500 }
    );
  }
}
