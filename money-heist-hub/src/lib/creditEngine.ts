import type { BorrowerProfile, LenderProfile, LoanApplication, UserData } from "./auth";

export interface CreditScoreFactors {
  paymentHistory: number;
  creditUtilization: number;
  creditAge: number;
  creditMix: number;
  newInquiries: number;
}

export interface LoanEligibility {
  eligible: boolean;
  maxAmount: number;
  recommendedTenure: number;
  interestRate: number;
  EMI: number;
  approvalProbability: number;
  reasons: string[];
}

export interface RiskAssessment {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "very-high";
  defaultProbability: number;
  factors: RiskFactor[];
  recommendations: string[];
}

export interface RiskFactor {
  name: string;
  impact: "positive" | "negative" | "neutral";
  weight: number;
  description: string;
}

export interface LoanDecision {
  decision: "approve" | "reject" | "conditional";
  confidence: number;
  reasons: string[];
  recommendedInterestRate: number;
  conditions?: string[];
}

export interface FutureImpact {
  lifestyleImpact: string;
  recoveryTimeline: string;
  affectedGoals: string[];
  stressLevel: "low" | "medium" | "high";
  recommendation: string;
}

export interface CashFlowAnalysis {
  monthlySurplus: number;
  surplusRatio: number;
  stability: "stable" | "variable" | "unstable";
  trend: "improving" | "stable" | "declining";
  availableForEMI: number;
  maxSustainableEMI: number;
}

const WEIGHTS = {
  paymentHistory: 0.35,
  creditUtilization: 0.30,
  creditAge: 0.15,
  creditMix: 0.10,
  newInquiries: 0.10,
};

export function calculateCreditScore(profile: BorrowerProfile): number {
  let score = 0;

  const paymentHistoryScore = Math.min(profile.paymentHistory || 95, 100) * WEIGHTS.paymentHistory;
  score += paymentHistoryScore;

  const utilizationScore = Math.max(0, 100 - (profile.creditUtilization || 30)) * WEIGHTS.creditUtilization;
  score += utilizationScore;

  const creditAgeScore = Math.min((profile.creditHistoryLength || 3) * 10, 100) * WEIGHTS.creditAge;
  score += creditAgeScore;

  const creditMixScore = Math.min(((profile.existingLoans?.length || 1) * 20), 100) * WEIGHTS.creditMix;
  score += creditMixScore;

  const inquiryScore = Math.max(0, 100 - ((profile.newInquiries || 1) * 10)) * WEIGHTS.newInquiries;
  score += inquiryScore;

  return Math.round(score * 8.5);
}

export function analyzeCashFlow(profile: BorrowerProfile): CashFlowAnalysis {
  const monthlySurplus = profile.monthlyIncome - profile.monthlyExpenses;
  const surplusRatio = (monthlySurplus / profile.monthlyIncome) * 100;
  
  const availableForEMI = monthlySurplus - (monthlySurplus * 0.3);
  
  const maxSustainableEMI = Math.min(
    monthlySurplus * 0.4,
    profile.monthlyIncome * 0.35
  );

  let stability: "stable" | "variable" | "unstable" = "stable";
  let trend: "improving" | "stable" | "declining" = "stable";

  if (profile.employmentType === "entrepreneur" || profile.employmentType === "self-employed") {
    stability = "variable";
    trend = "stable";
  }

  return {
    monthlySurplus: Math.max(0, monthlySurplus),
    surplusRatio: Math.max(0, surplusRatio),
    stability,
    trend,
    availableForEMI: Math.max(0, availableForEMI),
    maxSustainableEMI: Math.max(0, maxSustainableEMI),
  };
}

export function calculateLoanEligibility(
  profile: BorrowerProfile,
  requestedAmount?: number,
  requestedTenure?: number
): LoanEligibility {
  const cashFlow = analyzeCashFlow(profile);
  const creditScore = calculateCreditScore(profile);
  
  const baseMaxAmount = Math.min(
    profile.monthlyIncome * 60,
    profile.totalAssets * 0.7,
    profile.totalLiabilities * 10
  );

  const creditScoreMultiplier = creditScore >= 750 ? 1.2 : creditScore >= 650 ? 1.0 : 0.8;
  const maxAmount = Math.round(baseMaxAmount * creditScoreMultiplier);

  const loanAmount = requestedAmount || maxAmount * 0.5;
  const tenure = requestedTenure || 36;

  const baseRate = creditScore >= 750 ? 10 : creditScore >= 650 ? 12 : 15;
  const employmentFactor = profile.employmentType === "salaried" ? 0 : 
                            profile.employmentType === "entrepreneur" ? 2 : 1;
  const interestRate = baseRate + employmentFactor;

  const monthlyRate = interestRate / 12 / 100;
  const EMI = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const approvalProbability = Math.min(
    95,
    Math.max(20, 100 - (EMI - cashFlow.availableForEMI) * 2 - (100 - creditScore) * 0.3)
  );

  const reasons: string[] = [];
  if (creditScore >= 750) reasons.push("Excellent credit score");
  if (cashFlow.surplusRatio >= 30) reasons.push("Strong cash flow surplus");
  if (profile.totalAssets > profile.totalLiabilities) reasons.push("Positive asset base");
  if (profile.employmentType === "salaried") reasons.push("Stable employment");

  if (EMI > cashFlow.maxSustainableEMI) {
    reasons.push("Warning: EMI may strain finances");
  }

  return {
    eligible: approvalProbability >= 50,
    maxAmount: Math.round(maxAmount),
    recommendedTenure: Math.min(60, Math.max(12, tenure)),
    interestRate,
    EMI,
    approvalProbability: Math.round(approvalProbability),
    reasons,
  };
}

export function assessRisk(profile: BorrowerProfile, requestedEMI?: number): RiskAssessment {
  const cashFlow = analyzeCashFlow(profile);
  const creditScore = calculateCreditScore(profile);
  const currentEMI = profile.existingLoans?.reduce((sum, loan) => sum + loan.emi, 0) || 0;
  const totalEMI = (requestedEMI || 0) + currentEMI;

  const factors: RiskFactor[] = [];

  if (cashFlow.surplusRatio >= 30) {
    factors.push({
      name: "Strong Cash Flow",
      impact: "positive",
      weight: 25,
      description: "Monthly surplus exceeds 30% of income",
    });
  } else if (cashFlow.surplusRatio < 15) {
    factors.push({
      name: "Low Cash Flow",
      impact: "negative",
      weight: 25,
      description: "Monthly surplus below 15% of income",
    });
  }

  if (profile.creditUtilization <= 30) {
    factors.push({
      name: "Low Credit Utilization",
      impact: "positive",
      weight: 20,
      description: "Credit utilization below 30%",
    });
  } else if (profile.creditUtilization > 70) {
    factors.push({
      name: "High Credit Utilization",
      impact: "negative",
      weight: 20,
      description: "Credit utilization exceeds 70%",
    });
  }

  if (creditScore >= 750) {
    factors.push({
      name: "Excellent Credit Score",
      impact: "positive",
      weight: 25,
      description: "Credit score above 750",
    });
  } else if (creditScore < 600) {
    factors.push({
      name: "Poor Credit Score",
      impact: "negative",
      weight: 25,
      description: "Credit score below 600",
    });
  }

  if (totalEMI > cashFlow.monthlySurplus * 0.5) {
    factors.push({
      name: "High EMI Burden",
      impact: "negative",
      weight: 15,
      description: "Total EMI exceeds 50% of monthly surplus",
    });
  }

  if (profile.employmentType === "entrepreneur") {
    factors.push({
      name: "Entrepreneur Risk",
      impact: "neutral",
      weight: 10,
      description: "Variable income from business",
    });
  }

  const positiveWeight = factors
    .filter(f => f.impact === "positive")
    .reduce((sum, f) => sum + f.weight, 0);
  
  const negativeWeight = factors
    .filter(f => f.impact === "negative")
    .reduce((sum, f) => sum + f.weight, 0);

  const baseRiskScore = 50 + negativeWeight - positiveWeight;
  const riskScore = Math.max(0, Math.min(100, baseRiskScore));

  let riskLevel: "low" | "medium" | "high" | "very-high";
  let defaultProbability: number;

  if (riskScore <= 25) {
    riskLevel = "low";
    defaultProbability = 2;
  } else if (riskScore <= 50) {
    riskLevel = "medium";
    defaultProbability = 8;
  } else if (riskScore <= 75) {
    riskLevel = "high";
    defaultProbability = 20;
  } else {
    riskLevel = "very-high";
    defaultProbability = 45;
  }

  const recommendations: string[] = [];
  if (riskLevel === "high" || riskLevel === "very-high") {
    recommendations.push("Consider reducing loan amount");
    recommendations.push("Increase tenure to reduce EMI burden");
  }
  if (cashFlow.surplusRatio < 20) {
    recommendations.push("Improve cash flow before applying");
  }
  if (profile.creditUtilization > 50) {
    recommendations.push("Reduce credit utilization below 50%");
  }

  return {
    riskScore,
    riskLevel,
    defaultProbability,
    factors,
    recommendations,
  };
}

export function makeLoanDecision(
  profile: BorrowerProfile,
  requestedAmount: number,
  requestedTenure: number
): LoanDecision {
  const eligibility = calculateLoanEligibility(profile, requestedAmount, requestedTenure);
  const risk = assessRisk(profile, eligibility.EMI);
  const cashFlow = analyzeCashFlow(profile);

  const reasons: string[] = [];

  if (risk.riskLevel === "low" || risk.riskLevel === "medium") {
    if (eligibility.approvalProbability >= 70) {
      reasons.push(`Strong approval probability of ${eligibility.approvalProbability}%`);
      reasons.push(...risk.factors.filter(f => f.impact === "positive").map(f => f.description));
      
      return {
        decision: "approve",
        confidence: eligibility.approvalProbability,
        reasons,
        recommendedInterestRate: eligibility.interestRate,
      };
    }
  }

  if (risk.riskLevel === "high" || risk.riskLevel === "very-high") {
    reasons.push(`High risk level: ${risk.riskLevel}`);
    reasons.push(...risk.factors.filter(f => f.impact === "negative").map(f => f.description));
    
    if (eligibility.approvalProbability >= 40) {
      return {
        decision: "conditional",
        confidence: eligibility.approvalProbability,
        reasons,
        recommendedInterestRate: eligibility.interestRate + 2,
        conditions: [
          "Provide additional collateral",
          "Add co-borrower",
          "Reduce loan amount by 20%",
        ],
      };
    }
    
    return {
      decision: "reject",
      confidence: 100 - eligibility.approvalProbability,
      reasons,
      recommendedInterestRate: eligibility.interestRate,
    };
  }

  if (eligibility.EMI > cashFlow.maxSustainableEMI) {
    reasons.push("EMI exceeds sustainable limit");
    return {
      decision: "conditional",
      confidence: 60,
      reasons,
      recommendedInterestRate: eligibility.interestRate,
      conditions: ["Increase tenure to reduce EMI"],
    };
  }

  return {
    decision: "approve",
    confidence: eligibility.approvalProbability,
    reasons: eligibility.reasons,
    recommendedInterestRate: eligibility.interestRate,
  };
}

export function simulateFutureImpact(
  profile: BorrowerProfile,
  newLoanEMI: number,
  loanAmount: number
): FutureImpact {
  const cashFlow = analyzeCashFlow(profile);
  const currentEMI = profile.existingLoans?.reduce((sum, loan) => sum + loan.emi, 0) || 0;
  const totalEMI = currentEMI + newLoanEMI;

  const newSurplus = cashFlow.monthlySurplus - newLoanEMI;
  const newSurplusRatio = (newSurplus / profile.monthlyIncome) * 100;

  let lifestyleImpact: string;
  let stressLevel: "low" | "medium" | "high";
  let affectedGoals: string[] = [];

  if (newSurplusRatio >= 20) {
    lifestyleImpact = "Minimal impact. You can maintain current lifestyle while repaying loan.";
    stressLevel = "low";
  } else if (newSurplusRatio >= 10) {
    lifestyleImpact = "Moderate impact. Some discretionary spending may need to be reduced.";
    stressLevel = "medium";
    affectedGoals.push("vacation", "new vehicle");
  } else {
    lifestyleImpact = "High impact. Significant lifestyle changes required to manage loan.";
    stressLevel = "high";
    affectedGoals.push("vacation", "new vehicle", "home purchase");
  }

  const monthlySavingsImpact = newLoanEMI;
  const monthsToRecover = Math.ceil(loanAmount / (cashFlow.monthlySurplus * 0.5));
  const recoveryTimeline = monthsToRecover <= 12 ? "12 months" : 
                           monthsToRecover <= 24 ? "1-2 years" : 
                           monthsToRecover <= 36 ? "2-3 years" : "3+ years";

  let recommendation = "";
  if (stressLevel === "high") {
    recommendation = "Consider reducing loan amount or extending tenure to lower EMI burden.";
  } else if (stressLevel === "medium") {
    recommendation = "Review budget and identify areas to reduce spending before taking loan.";
  } else {
    recommendation = "Loan appears sustainable. Maintain current financial discipline.";
  }

  return {
    lifestyleImpact,
    recoveryTimeline,
    affectedGoals,
    stressLevel,
    recommendation,
  };
}

export function getInterestRateRecommendation(
  profile: BorrowerProfile,
  riskAppetite: "conservative" | "moderate" | "aggressive" = "moderate"
): { minRate: number; maxRate: number; recommendedRate: number } {
  const creditScore = calculateCreditScore(profile);
  const risk = assessRisk(profile);

  let baseRate: number;
  if (creditScore >= 750) baseRate = 9;
  else if (creditScore >= 650) baseRate = 12;
  else baseRate = 15;

  if (risk.riskLevel === "low") baseRate -= 1;
  else if (risk.riskLevel === "high") baseRate += 2;
  else if (risk.riskLevel === "very-high") baseRate += 4;

  let minRate = baseRate - 1;
  let maxRate = baseRate + 2;

  if (riskAppetite === "conservative") maxRate += 1;
  if (riskAppetite === "aggressive") minRate -= 1;

  return {
    minRate: Math.max(6, minRate),
    maxRate: Math.min(24, maxRate),
    recommendedRate: baseRate,
  };
}

export function filterBorrowers(
  borrowers: BorrowerProfile[],
  filters: {
    ageRange?: [number, number];
    employmentType?: string[];
    incomeRange?: [number, number];
    minScore?: number;
  }
): BorrowerProfile[] {
  return borrowers.filter(borrower => {
    if (filters.ageRange) {
      if (borrower.age < filters.ageRange[0] || borrower.age > filters.ageRange[1]) {
        return false;
      }
    }

    if (filters.employmentType && filters.employmentType.length > 0) {
      if (!filters.employmentType.includes(borrower.employmentType)) {
        return false;
      }
    }

    if (filters.incomeRange) {
      if (borrower.monthlyIncome < filters.incomeRange[0] || 
          borrower.monthlyIncome > filters.incomeRange[1]) {
        return false;
      }
    }

    if (filters.minScore) {
      if (calculateCreditScore(borrower) < filters.minScore) {
        return false;
      }
    }

    return true;
  });
}

export function generateBorrowerProfile(data: Partial<BorrowerProfile>): BorrowerProfile {
  return {
    creditScore: data.creditScore || calculateCreditScore(data as BorrowerProfile),
    monthlyIncome: data.monthlyIncome || 50000,
    monthlyExpenses: data.monthlyExpenses || 30000,
    totalAssets: data.totalAssets || 500000,
    totalLiabilities: data.totalLiabilities || 100000,
    employmentType: data.employmentType || "salaried",
    age: data.age || 30,
    existingLoans: data.existingLoans || [],
    creditHistoryLength: data.creditHistoryLength || 4,
    lastUpdated: new Date().toISOString(),
  };
}

export const DEFAULT_BORROWER_PROFILE: BorrowerProfile = {
  creditScore: 742,
  monthlyIncome: 85000,
  monthlyExpenses: 45000,
  totalAssets: 2500000,
  totalLiabilities: 500000,
  employmentType: "salaried",
  age: 32,
  existingLoans: [
    { type: "Home Loan", amount: 2500000, emi: 22000, remainingTenure: 180, lender: "HDFC Bank" },
    { type: "Car Loan", amount: 500000, emi: 12000, remainingTenure: 24, lender: "ICICI Bank" },
  ],
  creditHistoryLength: 5,
  lastUpdated: new Date().toISOString(),
};

export const MOCK_BORROWERS: BorrowerProfile[] = [
  {
    creditScore: 785,
    monthlyIncome: 120000,
    monthlyExpenses: 60000,
    totalAssets: 5000000,
    totalLiabilities: 1000000,
    employmentType: "salaried",
    age: 35,
    existingLoans: [
      { type: "Home Loan", amount: 3500000, emi: 28000, remainingTenure: 200, lender: "SBI" },
    ],
    creditHistoryLength: 7,
    lastUpdated: new Date().toISOString(),
  },
  {
    creditScore: 620,
    monthlyIncome: 45000,
    monthlyExpenses: 35000,
    totalAssets: 800000,
    totalLiabilities: 600000,
    employmentType: "entrepreneur",
    age: 28,
    existingLoans: [
      { type: "Business Loan", amount: 500000, emi: 15000, remainingTenure: 18, lender: "Axis Bank" },
    ],
    creditHistoryLength: 2,
    lastUpdated: new Date().toISOString(),
  },
  {
    creditScore: 710,
    monthlyIncome: 65000,
    monthlyExpenses: 40000,
    totalAssets: 1500000,
    totalLiabilities: 300000,
    employmentType: "self-employed",
    age: 42,
    existingLoans: [
      { type: "Personal Loan", amount: 300000, emi: 10000, remainingTenure: 15, lender: "HDFC" },
    ],
    creditHistoryLength: 5,
    lastUpdated: new Date().toISOString(),
  },
  {
    creditScore: 550,
    monthlyIncome: 35000,
    monthlyExpenses: 28000,
    totalAssets: 400000,
    totalLiabilities: 450000,
    employmentType: "salaried",
    age: 25,
    existingLoans: [],
    creditHistoryLength: 1,
    lastUpdated: new Date().toISOString(),
  },
  {
    creditScore: 800,
    monthlyIncome: 150000,
    monthlyExpenses: 70000,
    totalAssets: 8000000,
    totalLiabilities: 2000000,
    employmentType: "salaried",
    age: 40,
    existingLoans: [
      { type: "Home Loan", amount: 5000000, emi: 40000, remainingTenure: 180, lender: "ICICI" },
    ],
    creditHistoryLength: 10,
    lastUpdated: new Date().toISOString(),
  },
];