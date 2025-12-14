import type { UserCreditProfile, LoanRecommendation } from "./types";

export function generateRecommendation(
  user: UserCreditProfile
): LoanRecommendation {
  const factors: string[] = [];
  const riskFactors: string[] = [];
  let recommendation: "approve" | "reject" | "conditional" = "approve";
  let recommendedAmount = 0;
  let confidence = 100;

  // Credit Score Analysis
  if (user.currentCreditScore >= 750) {
    factors.push("Excellent credit score");
    recommendedAmount = user.monthlyIncome * 0.5;
  } else if (user.currentCreditScore >= 700) {
    factors.push("Good credit score");
    recommendedAmount = user.monthlyIncome * 0.4;
  } else if (user.currentCreditScore >= 650) {
    factors.push("Fair credit score");
    recommendedAmount = user.monthlyIncome * 0.3;
    recommendation = "conditional";
    confidence -= 20;
  } else if (user.currentCreditScore >= 580) {
    factors.push("Below average credit score");
    recommendedAmount = user.monthlyIncome * 0.2;
    recommendation = "conditional";
    confidence -= 40;
    riskFactors.push("Low credit score");
  } else {
    factors.push("Poor credit score");
    recommendation = "reject";
    confidence = 20;
    riskFactors.push("Very low credit score");
  }

  // Debt-to-Income Ratio
  if (user.debtToIncomeRatio < 0.3) {
    factors.push("Low debt-to-income ratio");
    recommendedAmount = Math.max(recommendedAmount, user.monthlyIncome * 0.3);
  } else if (user.debtToIncomeRatio < 0.4) {
    factors.push("Moderate debt-to-income ratio");
    confidence -= 10;
  } else if (user.debtToIncomeRatio < 0.5) {
    factors.push("High debt-to-income ratio");
    recommendedAmount *= 0.7;
    confidence -= 20;
    riskFactors.push("High debt burden");
    if (recommendation === "approve") {
      recommendation = "conditional";
    }
  } else {
    factors.push("Very high debt-to-income ratio");
    recommendation = "reject";
    confidence = Math.min(confidence, 30);
    riskFactors.push("Excessive debt burden");
  }

  // Payment History
  const totalPayments =
    user.paymentHistory.onTime +
    user.paymentHistory.late +
    user.paymentHistory.missed;
  const onTimeRate =
    totalPayments > 0 ? user.paymentHistory.onTime / totalPayments : 0;

  if (onTimeRate >= 0.95) {
    factors.push("Excellent payment history");
  } else if (onTimeRate >= 0.85) {
    factors.push("Good payment history");
    confidence -= 5;
  } else if (onTimeRate >= 0.7) {
    factors.push("Fair payment history");
    confidence -= 15;
    riskFactors.push("Some late payments");
    if (recommendation === "approve") {
      recommendation = "conditional";
    }
  } else {
    factors.push("Poor payment history");
    confidence -= 30;
    riskFactors.push("Frequent late or missed payments");
    if (recommendation !== "reject") {
      recommendation = "conditional";
    }
  }

  if (user.paymentHistory.missed > 5) {
    recommendation = "reject";
    confidence = Math.min(confidence, 25);
    riskFactors.push("Multiple missed payments");
  }

  // Credit Utilization
  if (user.creditUtilization < 30) {
    factors.push("Low credit utilization");
  } else if (user.creditUtilization < 50) {
    factors.push("Moderate credit utilization");
    confidence -= 5;
  } else if (user.creditUtilization < 70) {
    factors.push("High credit utilization");
    confidence -= 15;
    riskFactors.push("High credit card usage");
    if (recommendation === "approve") {
      recommendation = "conditional";
    }
  } else {
    factors.push("Very high credit utilization");
    confidence -= 25;
    riskFactors.push("Excessive credit card usage");
    if (recommendation !== "reject") {
      recommendation = "conditional";
    }
  }

  // Account Age
  if (user.accountAge >= 60) {
    factors.push("Long credit history");
  } else if (user.accountAge < 24) {
    factors.push("Short credit history");
    confidence -= 10;
    riskFactors.push("Limited credit history");
  }

  // Risk Level
  if (user.riskLevel === "high") {
    recommendation = "reject";
    confidence = Math.min(confidence, 20);
    riskFactors.push("High risk profile");
  } else if (user.riskLevel === "medium") {
    if (recommendation === "approve") {
      recommendation = "conditional";
    }
    confidence -= 15;
    riskFactors.push("Medium risk profile");
  }

  // Final adjustments
  if (recommendation === "reject") {
    recommendedAmount = 0;
  } else {
    recommendedAmount = Math.round(recommendedAmount);
    confidence = Math.max(0, Math.min(100, confidence));
  }

  return {
    userId: user.id,
    userName: user.name,
    recommendation,
    recommendedAmount:
      recommendation !== "reject" ? recommendedAmount : undefined,
    reasoning: factors,
    confidence,
    riskFactors,
    timestamp: new Date().toISOString(),
  };
}

export function calculateMetrics(users: UserCreditProfile[]) {
  const totalUsers = users.length;
  const totalCreditScore = users.reduce(
    (sum, user) => sum + user.currentCreditScore,
    0
  );
  const averageCreditScore =
    totalUsers > 0 ? Math.round(totalCreditScore / totalUsers) : 0;

  const recommendations = users.map(generateRecommendation);
  const approved = recommendations.filter(
    (r) => r.recommendation === "approve"
  ).length;
  const approvalRate =
    totalUsers > 0 ? Math.round((approved / totalUsers) * 100) : 0;

  const totalDebt = users.reduce((sum, user) => sum + user.totalDebt, 0);
  const totalDebtToIncome = users.reduce(
    (sum, user) => sum + user.debtToIncomeRatio,
    0
  );
  const averageDebtToIncome =
    totalUsers > 0
      ? Math.round((totalDebtToIncome / totalUsers) * 100) / 100
      : 0;

  const riskDistribution = {
    low: users.filter((u) => u.riskLevel === "low").length,
    medium: users.filter((u) => u.riskLevel === "medium").length,
    high: users.filter((u) => u.riskLevel === "high").length,
  };

  return {
    totalUsers,
    averageCreditScore,
    approvalRate,
    totalDebt,
    averageDebtToIncome,
    riskDistribution,
  };
}
