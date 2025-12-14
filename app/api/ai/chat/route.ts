import { NextResponse } from "next/server";

const AZURE_ENDPOINT =
  process.env.AZURE_ENDPOINT ||
  "https://vmute-mio2aqwz-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-5-chat/chat/completions?api-version=2025-01-01-preview";
const AZURE_API_KEY =
  process.env.AZURE_API_KEY ||
  "CC2ya28YUlW5gtlHlkE1YyEgUhuvvgGuPM26yRxFW0eLFQ7luDMNJQQJ99BLACHYHv6XJ3w3AAAAACOGY69n";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, context } = body;

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a financial AI assistant specializing in credit analysis and loan recommendations. 
You help users understand their credit profiles, answer questions about credit scores, debt management, and financial health.
Be concise, accurate, and helpful. Use the provided context to answer questions about specific users when available.`;

    let contextText = "";
    if (context) {
      // Format user-specific context if available
      if (context.user) {
        const user = context.user as Record<string, unknown>;
        contextText = `\n\n**User Profile Context:**
- Name: ${user.name || "N/A"}
- Credit Score: ${user.currentCreditScore || "N/A"}
- Debt-to-Income Ratio: ${
          user.debtToIncomeRatio
            ? ((user.debtToIncomeRatio as number) * 100).toFixed(1) + "%"
            : "N/A"
        }
- Total Debt: $${
          user.totalDebt ? (user.totalDebt as number).toLocaleString() : "N/A"
        }
- Monthly Income: $${
          user.monthlyIncome
            ? (user.monthlyIncome as number).toLocaleString()
            : "N/A"
        }
- Credit Utilization: ${user.creditUtilization || "N/A"}%
- Account Age: ${user.accountAge || "N/A"} months
- Risk Level: ${user.riskLevel || "N/A"}
- Status: ${user.status || "N/A"}
- Payment History: ${
          user.paymentHistory
            ? `${
                (user.paymentHistory as Record<string, number>).onTime || 0
              } on-time, ${
                (user.paymentHistory as Record<string, number>).late || 0
              } late, ${
                (user.paymentHistory as Record<string, number>).missed || 0
              } missed`
            : "N/A"
        }
- Credit History Entries: ${
          user.creditHistory ? (user.creditHistory as unknown[]).length : 0
        } records`;

        if (context.recommendation) {
          const rec = context.recommendation as Record<string, unknown>;
          contextText += `\n\n**Loan Recommendation:**
- Status: ${rec.recommendation || "N/A"}
- Recommended Amount: ${
            rec.recommendedAmount
              ? "$" + (rec.recommendedAmount as number).toLocaleString()
              : "N/A"
          }
- Confidence: ${rec.confidence || "N/A"}%
- Risk Factors: ${
            rec.riskFactors ? (rec.riskFactors as string[]).join(", ") : "N/A"
          }
- Reasoning: ${rec.reasoning ? (rec.reasoning as string[]).join("; ") : "N/A"}`;
        }
      } else {
        // General context (portfolio-level)
        contextText = `\n\n**Context Data:**\n${JSON.stringify(
          context,
          null,
          2
        )}`;
      }
    }

    const prompt = `${question}${contextText}`;

    const response = await fetch(AZURE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || "";

    return NextResponse.json({ answer: answer.trim() }, { status: 200 });
  } catch (error) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
