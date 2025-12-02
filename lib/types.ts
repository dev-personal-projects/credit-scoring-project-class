export interface CreditHistory {
  date: string;
  creditScore: number;
  paymentStatus: "on-time" | "late" | "missed";
  amount: number;
  event: string;
}

export interface UserCreditProfile {
  id: string;
  name: string;
  email: string;
  currentCreditScore: number;
  creditHistory: CreditHistory[];
  debtToIncomeRatio: number;
  totalDebt: number;
  monthlyIncome: number;
  paymentHistory: {
    onTime: number;
    late: number;
    missed: number;
  };
  accountAge: number; // in months
  creditUtilization: number; // percentage
  riskLevel: "low" | "medium" | "high";
  status: "active" | "inactive" | "flagged";
  lastUpdated: string;
}

export interface LoanRecommendation {
  userId: string;
  userName: string;
  recommendation: "approve" | "reject" | "conditional";
  recommendedAmount?: number;
  reasoning: string[];
  confidence: number; // 0-100
  riskFactors: string[];
  timestamp: string;
}

export interface CreditMetrics {
  totalUsers: number;
  averageCreditScore: number;
  approvalRate: number;
  totalDebt: number;
  averageDebtToIncome: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface RecentActivity {
  id: string;
  userId: string;
  userName: string;
  type: "payment" | "score_change" | "recommendation" | "status_change";
  description: string;
  timestamp: string;
  impact?: "positive" | "negative" | "neutral";
}
