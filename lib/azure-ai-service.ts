const AZURE_ENDPOINT =
  process.env.AZURE_ENDPOINT ||
  "https://your-azure-endpoint.cognitiveservices.azure.com/openai/deployments/gpt-5-chat/chat/completions?api-version=2025-01-01-preview";
const AZURE_API_KEY = process.env.AZURE_API_KEY || "";

interface AzureAIResponse {
  content: string;
  error?: string;
}

async function callAzureAI(
  prompt: string,
  systemPrompt?: string
): Promise<AzureAIResponse> {
  try {
    const messages: Array<{ role: string; content: string }> = [];

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }

    messages.push({ role: "user", content: prompt });

    const response = await fetch(AZURE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";

    return { content: content.trim() };
  } catch (error) {
    console.error("Error calling Azure AI:", error);
    return {
      content: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function analyzeCreditProfile(
  userData: Record<string, unknown>
): Promise<string> {
  const systemPrompt = `You are a financial analyst expert specializing in credit risk assessment. 
Provide detailed, professional analysis of credit profiles. Be specific, data-driven, and actionable.`;

  const prompt = `Analyze the following credit profile and provide a comprehensive financial analysis:

**User Information:**
- Name: ${userData.name as string}
- Current Credit Score: ${userData.currentCreditScore as number}
- Debt-to-Income Ratio: ${(
    (userData.debtToIncomeRatio as number) * 100
  ).toFixed(1)}%
- Total Debt: $${(userData.totalDebt as number).toLocaleString()}
- Monthly Income: $${(userData.monthlyIncome as number).toLocaleString()}
- Credit Utilization: ${userData.creditUtilization as number}%
- Account Age: ${userData.accountAge as number} months
- Risk Level: ${userData.riskLevel as string}

**Payment History:**
- On-Time Payments: ${
    (userData.paymentHistory as Record<string, unknown>).onTime as number
  }
- Late Payments: ${
    (userData.paymentHistory as Record<string, unknown>).late as number
  }
- Missed Payments: ${
    (userData.paymentHistory as Record<string, unknown>).missed as number
  }

**Recent Credit History (last 6 months):**
${(userData.creditHistory as Array<Record<string, unknown>>)
  .slice(-6)
  .map(
    (h: Record<string, unknown>) =>
      `- ${new Date(h.date as string).toLocaleDateString()}: Score ${
        h.creditScore
      }, Payment: ${h.paymentStatus}, Amount: $${h.amount}`
  )
  .join("\n")}

Provide a detailed analysis covering:
1. Overall credit health assessment
2. Key strengths and weaknesses
3. Risk factors and concerns
4. Credit score trend analysis
5. Payment behavior patterns
6. Debt management evaluation

Format your response in clear paragraphs with specific insights.`;

  const result = await callAzureAI(prompt, systemPrompt);
  return result.content || "Unable to generate analysis at this time.";
}

export async function generateFinancialAdvice(
  userData: Record<string, unknown>,
  recommendation: Record<string, unknown>
): Promise<string> {
  const systemPrompt = `You are a certified financial advisor providing personalized, actionable advice to help users improve their credit and financial health. 
Give practical, specific recommendations that users can implement.`;

  const prompt = `Based on the following credit profile and loan recommendation, provide personalized financial advice:

**Credit Profile:**
- Credit Score: ${userData.currentCreditScore as number}
- Debt-to-Income Ratio: ${(
    (userData.debtToIncomeRatio as number) * 100
  ).toFixed(1)}%
- Total Debt: $${(userData.totalDebt as number).toLocaleString()}
- Monthly Income: $${(userData.monthlyIncome as number).toLocaleString()}
- Credit Utilization: ${userData.creditUtilization as number}%
- Payment History: ${
    (userData.paymentHistory as Record<string, unknown>).onTime as number
  } on-time, ${
    (userData.paymentHistory as Record<string, unknown>).late as number
  } late, ${
    (userData.paymentHistory as Record<string, unknown>).missed as number
  } missed

**Loan Recommendation:**
- Status: ${recommendation.recommendation as string}
- Recommended Amount: ${
    recommendation.recommendedAmount
      ? "$" + (recommendation.recommendedAmount as number).toLocaleString()
      : "N/A"
  }
- Confidence: ${recommendation.confidence as number}%
- Risk Factors: ${(recommendation.riskFactors as string[]).join(", ")}

Provide actionable financial advice covering:
1. Immediate actions to improve credit score
2. Debt reduction strategies
3. Payment improvement recommendations
4. Credit utilization optimization
5. Long-term financial health goals
6. Specific steps based on the loan recommendation status

Make the advice specific, measurable, and prioritized.`;

  const result = await callAzureAI(prompt, systemPrompt);
  return result.content || "Unable to generate advice at this time.";
}

export async function explainRiskFactors(
  userData: Record<string, unknown>,
  riskFactors: string[]
): Promise<string> {
  const systemPrompt = `You are a financial educator explaining credit risk factors in simple, understandable terms. 
Help users understand why certain factors affect their creditworthiness.`;

  const prompt = `Explain the following risk factors for this credit profile in plain language:

**User Profile:**
- Credit Score: ${userData.currentCreditScore as number}
- Debt-to-Income: ${((userData.debtToIncomeRatio as number) * 100).toFixed(1)}%
- Credit Utilization: ${userData.creditUtilization as number}%
- Payment History: ${
    (userData.paymentHistory as Record<string, unknown>).onTime as number
  } on-time, ${
    (userData.paymentHistory as Record<string, unknown>).late as number
  } late, ${
    (userData.paymentHistory as Record<string, unknown>).missed as number
  } missed

**Risk Factors Identified:**
${riskFactors.map((factor, i) => `${i + 1}. ${factor}`).join("\n")}

For each risk factor, explain:
1. What it means in simple terms
2. Why it's a concern
3. How it impacts creditworthiness
4. The specific impact on this user's profile

Use clear, non-technical language that anyone can understand.`;

  const result = await callAzureAI(prompt, systemPrompt);
  return result.content || "Unable to generate explanation at this time.";
}

export async function predictCreditTrend(
  userData: Record<string, unknown>
): Promise<string> {
  const systemPrompt = `You are a financial analyst specializing in credit score forecasting. 
Analyze historical patterns and predict future credit trends based on current behavior.`;

  const prompt = `Based on the following credit history, predict the likely credit score trend over the next 6-12 months:

**Current Status:**
- Current Credit Score: ${userData.currentCreditScore as number}
- Credit Score History (last 12 months):
${(userData.creditHistory as Array<Record<string, unknown>>)
  .slice(-12)
  .map(
    (h: Record<string, unknown>) =>
      `${new Date(h.date as string).toLocaleDateString()}: ${h.creditScore} (${
        h.paymentStatus
      })`
  )
  .join("\n")}

**Financial Behavior:**
- Debt-to-Income Ratio: ${(
    (userData.debtToIncomeRatio as number) * 100
  ).toFixed(1)}%
- Credit Utilization: ${userData.creditUtilization as number}%
- Payment Pattern: ${
    (userData.paymentHistory as Record<string, unknown>).onTime as number
  } on-time, ${
    (userData.paymentHistory as Record<string, unknown>).late as number
  } late, ${
    (userData.paymentHistory as Record<string, unknown>).missed as number
  } missed

Provide:
1. Predicted credit score range for 3, 6, and 12 months
2. Key factors that will influence the trend
3. Best-case and worst-case scenarios
4. Confidence level in the prediction
5. What changes in behavior could improve or worsen the trend

Be realistic and data-driven in your predictions.`;

  const result = await callAzureAI(prompt, systemPrompt);
  return result.content || "Unable to generate prediction at this time.";
}

export async function analyzeAnomalies(
  userData: Record<string, unknown>
): Promise<string> {
  const systemPrompt = `You are a financial fraud and anomaly detection specialist. 
Identify unusual patterns, potential red flags, or anomalies in credit behavior.`;

  const prompt = `Analyze this credit profile for anomalies, unusual patterns, or potential concerns:

**Credit History:**
${(userData.creditHistory as Array<Record<string, unknown>>)
  .map(
    (h: Record<string, unknown>) =>
      `Date: ${new Date(h.date as string).toLocaleDateString()}, Score: ${
        h.creditScore
      }, Payment: ${h.paymentStatus}, Amount: $${h.amount}`
  )
  .join("\n")}

**Financial Metrics:**
- Credit Score: ${userData.currentCreditScore as number}
- Debt-to-Income: ${((userData.debtToIncomeRatio as number) * 100).toFixed(1)}%
- Credit Utilization: ${userData.creditUtilization as number}%
- Payment History: ${
    (userData.paymentHistory as Record<string, unknown>).onTime as number
  } on-time, ${
    (userData.paymentHistory as Record<string, unknown>).late as number
  } late, ${
    (userData.paymentHistory as Record<string, unknown>).missed as number
  } missed

Identify:
1. Unusual patterns in credit score changes
2. Inconsistent payment behavior
3. Sudden changes in debt levels
4. Anomalies in credit utilization
5. Any red flags that require investigation
6. Recommendations for further review

Be thorough but fair - distinguish between concerning anomalies and normal fluctuations.`;

  const result = await callAzureAI(prompt, systemPrompt);
  return result.content || "Unable to generate anomaly analysis at this time.";
}
