import type {
  UserCreditProfile,
  CreditMetrics,
  LoanRecommendation,
} from "./types";

const AZURE_ENDPOINT =
  process.env.AZURE_ENDPOINT ||
  "https://your-azure-endpoint.cognitiveservices.azure.com/openai/deployments/gpt-5-chat/chat/completions?api-version=2025-01-01-preview";
const AZURE_API_KEY = process.env.AZURE_API_KEY || "";

export interface ReportData {
  users: UserCreditProfile[];
  metrics: CreditMetrics;
  recommendations: LoanRecommendation[];
}

export async function generateCreditScoreReport(
  reportData: ReportData
): Promise<string> {
  const systemPrompt = `You are a senior financial analyst creating comprehensive credit score reports for financial institutions. 
Generate professional, detailed reports that can be used for financial decision-making, regulatory compliance, and strategic planning.`;

  const prompt = `Generate a comprehensive Credit Score Analysis Report based on the following data:

**Portfolio Overview:**
- Total Users: ${reportData.metrics.totalUsers}
- Average Credit Score: ${reportData.metrics.averageCreditScore}
- Approval Rate: ${reportData.metrics.approvalRate}%
- Risk Distribution: ${reportData.metrics.riskDistribution.low} Low, ${
    reportData.metrics.riskDistribution.medium
  } Medium, ${reportData.metrics.riskDistribution.high} High Risk
- Average Debt-to-Income Ratio: ${(
    reportData.metrics.averageDebtToIncome * 100
  ).toFixed(1)}%

**Sample User Data (${Math.min(10, reportData.users.length)} users):**
${reportData.users
  .slice(0, 10)
  .map(
    (user, i: number) => `
User ${i + 1}:
- Name: ${user.name}
- Credit Score: ${user.currentCreditScore}
- Risk Level: ${user.riskLevel}
- Debt-to-Income: ${(user.debtToIncomeRatio * 100).toFixed(1)}%
- Status: ${user.status}
`
  )
  .join("\n")}

**Recommendations Summary:**
- Approved: ${
    reportData.recommendations.filter((r) => r.recommendation === "approve")
      .length
  }
- Conditional: ${
    reportData.recommendations.filter((r) => r.recommendation === "conditional")
      .length
  }
- Rejected: ${
    reportData.recommendations.filter((r) => r.recommendation === "reject")
      .length
  }

Create a professional financial report with the following sections:
1. Executive Summary
2. Portfolio Performance Analysis
3. Credit Score Distribution & Trends
4. Risk Assessment & Categorization
5. Key Financial Metrics
6. Recommendations for Financial Actions
7. Risk Mitigation Strategies
8. Compliance & Regulatory Considerations
9. Strategic Recommendations

Format the report in clear sections with actionable insights that financial institutions can use for:
- Loan approval decisions
- Credit limit adjustments
- Risk management
- Regulatory reporting
- Strategic planning

Use professional financial terminology and provide specific, data-driven recommendations.`;

  try {
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
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}

export async function generateRiskAssessmentReport(
  reportData: ReportData
): Promise<string> {
  const systemPrompt = `You are a risk management expert creating detailed risk assessment reports for financial institutions. 
Generate comprehensive risk analysis reports that help companies make informed financial decisions and comply with regulatory requirements.`;

  const prompt = `Generate a comprehensive Risk Assessment Report based on the following credit portfolio data:

**Portfolio Statistics:**
- Total Users: ${reportData.metrics.totalUsers}
- Average Credit Score: ${reportData.metrics.averageCreditScore}
- Risk Distribution: 
  * Low Risk: ${reportData.metrics.riskDistribution.low} users
  * Medium Risk: ${reportData.metrics.riskDistribution.medium} users
  * High Risk: ${reportData.metrics.riskDistribution.high} users

**High-Risk Users Analysis:**
${reportData.users
  .filter((u) => u.riskLevel === "high")
  .slice(0, 10)
  .map(
    (user, i: number) => `
High-Risk User ${i + 1}:
- Name: ${user.name}
- Credit Score: ${user.currentCreditScore}
- Debt-to-Income: ${(user.debtToIncomeRatio * 100).toFixed(1)}%
- Payment History: ${user.paymentHistory.onTime} on-time, ${
      user.paymentHistory.late
    } late, ${user.paymentHistory.missed} missed
- Credit Utilization: ${user.creditUtilization}%
- Total Debt: $${user.totalDebt.toLocaleString()}
`
  )
  .join("\n")}

**Loan Recommendations:**
- Approved: ${
    reportData.recommendations.filter((r) => r.recommendation === "approve")
      .length
  }
- Conditional: ${
    reportData.recommendations.filter((r) => r.recommendation === "conditional")
      .length
  }
- Rejected: ${
    reportData.recommendations.filter((r) => r.recommendation === "reject")
      .length
  }

Create a professional risk assessment report with the following sections:
1. Executive Summary & Risk Overview
2. Portfolio Risk Analysis
3. High-Risk User Identification & Analysis
4. Risk Factors & Root Causes
5. Credit Risk Scoring Methodology
6. Default Probability Assessment
7. Risk Mitigation Strategies
8. Recommended Financial Actions
9. Regulatory Compliance Considerations
10. Action Items & Next Steps

Provide specific recommendations for:
- Credit limit adjustments
- Loan approval/rejection decisions
- Collection strategies
- Risk monitoring protocols
- Portfolio diversification
- Regulatory reporting requirements

Use professional risk management terminology and provide actionable, data-driven recommendations.`;

  try {
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
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating risk report:", error);
    throw error;
  }
}

export async function generateFinancialActionReport(
  reportData: ReportData
): Promise<string> {
  const systemPrompt = `You are a financial strategist creating actionable financial decision reports for credit institutions. 
Generate reports that provide clear, actionable recommendations for financial operations, loan management, and business strategy.`;

  const prompt = `Generate a comprehensive Financial Action Report based on the following credit portfolio data:

**Portfolio Overview:**
- Total Users: ${reportData.metrics.totalUsers}
- Average Credit Score: ${reportData.metrics.averageCreditScore}
- Approval Rate: ${reportData.metrics.approvalRate}%
- Total Portfolio Debt: $${reportData.metrics.totalDebt.toLocaleString()}
- Average Debt-to-Income: ${(
    reportData.metrics.averageDebtToIncome * 100
  ).toFixed(1)}%

**Loan Recommendations Breakdown:**
${reportData.recommendations
  .slice(0, 20)
  .map(
    (rec, i: number) => `
Recommendation ${i + 1}:
- User: ${rec.userName}
- Decision: ${rec.recommendation.toUpperCase()}
- Recommended Amount: ${
      rec.recommendedAmount
        ? "$" + rec.recommendedAmount.toLocaleString()
        : "N/A"
    }
- Confidence: ${rec.confidence}%
- Risk Factors: ${rec.riskFactors.join(", ")}
`
  )
  .join("\n")}

**User Credit Distribution:**
- Excellent (750+): ${
    reportData.users.filter((u) => u.currentCreditScore >= 750).length
  }
- Good (700-749): ${
    reportData.users.filter(
      (u) => u.currentCreditScore >= 700 && u.currentCreditScore < 750
    ).length
  }
- Fair (650-699): ${
    reportData.users.filter(
      (u) => u.currentCreditScore >= 650 && u.currentCreditScore < 700
    ).length
  }
- Poor (<650): ${
    reportData.users.filter((u) => u.currentCreditScore < 650).length
  }

Create a professional financial action report with the following sections:
1. Executive Summary & Key Recommendations
2. Portfolio Financial Health Assessment
3. Loan Approval Recommendations & Rationale
4. Credit Limit Adjustment Recommendations
5. Revenue Opportunities & Risk Assessment
6. Collection & Recovery Strategies
7. Portfolio Optimization Recommendations
8. Financial Impact Projections
9. Implementation Roadmap
10. Success Metrics & KPIs

Provide specific, actionable recommendations for:
- Which loans to approve/reject and why
- Credit limit increases/decreases
- Interest rate adjustments
- Collection priorities
- Portfolio growth strategies
- Risk management actions
- Revenue optimization opportunities

Include financial projections, risk assessments, and clear action items with timelines.`;

  try {
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
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating financial action report:", error);
    throw error;
  }
}
