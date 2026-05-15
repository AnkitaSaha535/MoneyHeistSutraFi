const USER_DATA_KEY = "sutrafi_user_data";

export type UserRole = "borrower" | "lender" | "unselected";

export interface UserData {
  streak_days: number;
  daily_tasks: number;
  heist_started: boolean;
  health_score?: number;
  financial_plan?: unknown;
  portfolio_data?: unknown;
  goals?: unknown[];
  last_synced?: string;
  email?: string;
  isLoggedIn?: boolean;
  userRole?: UserRole;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  borrowerProfile?: BorrowerProfile;
  lenderProfile?: LenderProfile;
  loanApplications?: LoanApplication[];
}

export interface BorrowerProfile {
  creditScore: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalAssets: number;
  totalLiabilities: number;
  employmentType: "salaried" | "entrepreneur" | "self-employed" | "retired";
  age: number;
  existingLoans: ExistingLoan[];
  creditHistoryLength: number;
  lastUpdated: string;
}

export interface LenderProfile {
  name: string;
  organization?: string;
  lendingType: "individual" | "institutional";
  minLoanAmount: number;
  maxLoanAmount: number;
  preferredInterestRate: number;
  riskAppetite: "conservative" | "moderate" | "aggressive";
}

export interface LoanApplication {
  id: string;
  borrowerId: string;
  amount: number;
  tenure: number;
  interestRate: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "conditional";
  appliedDate: string;
  decisionReason?: string;
}

export interface ExistingLoan {
  type: string;
  amount: number;
  emi: number;
  remainingTenure: number;
  lender: string;
}

export function loadUserData(): UserData {
  const raw = localStorage.getItem(USER_DATA_KEY);
  if (!raw) return { streak_days: 1, daily_tasks: 0, heist_started: false };
  return JSON.parse(raw);
}

export function saveUserData(data: UserData) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
}

export function isUserAuthenticated(): boolean {
  const data = loadUserData();
  return data.isLoggedIn === true;
}

export function loginUser(email: string): void {
  const data = loadUserData();
  data.isLoggedIn = true;
  data.email = email;
  saveUserData(data);
}

export function logoutUser(): void {
  const data = loadUserData();
  data.isLoggedIn = false;
  data.email = undefined;
  saveUserData(data);
}

export function incrementStreak(): UserData {
  const data = loadUserData();
  data.streak_days += 1;
  saveUserData(data);
  return data;
}

export function completeDailyTask(): UserData {
  const data = loadUserData();
  data.daily_tasks += 1;
  saveUserData(data);
  return data;
}
