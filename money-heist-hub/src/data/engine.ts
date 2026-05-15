const USER_DATA_KEY = "sutrafi_user_data";

export interface UserData {
  streak_days: number;
  daily_tasks: number;
  heist_started: boolean;
  health_score?: number;
  financial_plan?: FinancialPlan;
  portfolio_data?: PortfolioData;
  goals?: Goal[];
  last_synced?: string;
}

export interface PortfolioFund {
  id: string;
  name: string;
  category: 'equity' | 'debt' | 'hybrid' | 'liquid' | 'elss' | 'index' | 'sector';
  nav: number;
  units: number;
  purchaseDate: string;
  purchaseNav: number;
  currentValue: number;
  investedValue: number;
  gainLoss: number;
  gainLossPercent: number;
  expenseRatio: number;
  fundHouse: string;
  sectors?: string[];
  holdings?: string[];
}

export interface PortfolioData {
  funds: PortfolioFund[];
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  sipAmount: number;
  lastUpdated: string;
}

export interface FinancialPlan {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  expectedReturn: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  assetAllocation: {
    equity: number;
    debt: number;
    gold: number;
    cash: number;
  };
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'retirement' | 'house' | 'car' | 'education' | 'wedding' | 'emergency' | 'other';
  priority: 'high' | 'medium' | 'low';
  monthlyContribution: number;
}

export interface XIRRCalculation {
  cashFlows: { date: string; amount: number }[];
  xirr: number;
  annualizedReturn: number;
}

export interface FundOverlap {
  fund1: string;
  fund2: string;
  overlapPercent: number;
  commonStocks: string[];
}

export interface RebalanceRecommendation {
  type: 'buy' | 'sell' | 'switch';
  fromFund?: string;
  toFund?: string;
  amount: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  expectedImpact: string;
}

export function loadUserData(): UserData {
  const raw = localStorage.getItem(USER_DATA_KEY);
  if (!raw) return { streak_days: 1, daily_tasks: 0, heist_started: false };
  return JSON.parse(raw);
}

export function saveUserData(data: UserData) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
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

export function calculateSIP(monthlyInvestment: number, tenureYears: number, annualReturnRate: number) {
  const months = tenureYears * 12;
  const monthlyRate = annualReturnRate / 100 / 12;
  let fv: number;
  if (monthlyRate === 0) {
    fv = monthlyInvestment * months;
  } else {
    fv = monthlyInvestment * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
  }
  const investedAmount = monthlyInvestment * months;
  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(fv - investedAmount),
    totalValue: Math.round(fv),
  };
}

export function calculateSimpleInterest(principal: number, rate: number, time: number) {
  const interest = (principal * rate * time) / 100;
  return { principal, interest: Math.round(interest), total: Math.round(principal + interest) };
}

export function calculateCompoundInterest(principal: number, rate: number, time: number, n: number = 12) {
  const amount = principal * Math.pow(1 + rate / (100 * n), n * time);
  const interest = amount - principal;
  return { principal, interest: Math.round(interest), total: Math.round(amount) };
}

export function calculateFIRE(currentExpenses: number, inflationRate: number, yearsToRetire: number) {
  const futureAnnualExpenses = currentExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);
  const fireCorpus = futureAnnualExpenses * 25;
  return {
    futureAnnualExpenses: Math.round(futureAnnualExpenses),
    targetFireCorpus: Math.round(fireCorpus),
  };
}

export function calculateTax(annualIncome: number, deductions: number) {
  const oldTaxable = Math.max(0, annualIncome - deductions - 50000);
  let oldTax = 0;
  if (oldTaxable > 250000) {
    if (oldTaxable <= 500000) oldTax = (oldTaxable - 250000) * 0.05;
    else if (oldTaxable <= 1000000) oldTax = 12500 + (oldTaxable - 500000) * 0.20;
    else oldTax = 12500 + 100000 + (oldTaxable - 1000000) * 0.30;
  }
  if (oldTaxable <= 500000) oldTax = 0;
  oldTax *= 1.04;

  const newTaxable = Math.max(0, annualIncome - 75000);
  let newTax = 0;
  if (newTaxable > 300000) {
    if (newTaxable <= 700000) newTax = (newTaxable - 300000) * 0.05;
    else if (newTaxable <= 1000000) newTax = 20000 + (newTaxable - 700000) * 0.10;
    else if (newTaxable <= 1200000) newTax = 50000 + (newTaxable - 1000000) * 0.15;
    else if (newTaxable <= 1500000) newTax = 80000 + (newTaxable - 1200000) * 0.20;
    else newTax = 140000 + (newTaxable - 1500000) * 0.30;
  }
  if (newTaxable <= 700000) newTax = 0;
  newTax *= 1.04;

  return {
    oldRegimeTax: Math.round(oldTax),
    newRegimeTax: Math.round(newTax),
    recommendation: newTax <= oldTax ? "New Regime" : "Old Regime",
  };
}

export function calculate6DHealthScore(): number {
  return 815;
}

export function getHeistStrategy(target: string, current: string): string {
  try {
    const tv = parseFloat(target.replace(/[₹,]/g, ""));
    const cv = parseFloat(current.replace(/₹,/g, ""));
    const gap = tv - cv;
    return `Professor's Tip: To hit ₹${tv.toLocaleString()} Goal, reallocate 15% from 'Food' to 'Mutual Funds' immediately. Gap: ₹${gap.toLocaleString()}.`;
  } catch {
    return `Professor's Tip: Deploy aggressive reallocation tactics immediately.`;
  }
}

export function calculateXIRR(cashFlows: { date: string; amount: number }[]): XIRRCalculation {
  if (cashFlows.length < 2) {
    return { cashFlows, xirr: 0, annualizedReturn: 0 };
  }

  const sortedFlows = [...cashFlows].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const startDate = new Date(sortedFlows[0].date);
  
  const dayCount = sortedFlows.map(cf => {
    const cfDate = new Date(cf.date);
    return (cfDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  });

  const xirr = newtonRaphsonXIRR(sortedFlows.map(cf => cf.amount), dayCount);
  
  const totalDays = dayCount[dayCount.length - 1];
  const years = totalDays / 365;
  const annualizedReturn = (Math.pow(1 + xirr, 1 / years) - 1) * 100;

  return {
    cashFlows: sortedFlows,
    xirr: isNaN(xirr) ? 0 : xirr * 100,
    annualizedReturn: isNaN(annualizedReturn) ? 0 : annualizedReturn
  };
}

function newtonRaphsonXIRR(amounts: number[], days: number[], guess: number = 0.1): number {
  const maxIterations = 100;
  const tolerance = 1e-7;
  
  let rate = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;
    
    for (let j = 0; j < amounts.length; j++) {
      const t = days[j] / 365;
      const factor = Math.pow(1 + rate, -t);
      npv += amounts[j] * factor;
      dnpv -= (t * amounts[j]) / Math.pow(1 + rate, t + 1);
    }
    
    if (Math.abs(npv) < tolerance) break;
    if (dnpv === 0) break;
    
    rate = rate - npv / dnpv;
  }
  
  return rate;
}

export function calculateFundOverlap(funds: PortfolioFund[]): FundOverlap[] {
  const overlaps: FundOverlap[] = [];
  
  for (let i = 0; i < funds.length; i++) {
    for (let j = i + 1; j < funds.length; j++) {
      const fund1 = funds[i];
      const fund2 = funds[j];
      
      const holdings1 = fund1.holdings || getMockHoldings(fund1.name);
      const holdings2 = fund2.holdings || getMockHoldings(fund2.name);
      
      const commonStocks = holdings1.filter(h => holdings2.includes(h));
      const overlapPercent = (commonStocks.length / Math.max(holdings1.length, holdings2.length)) * 100;
      
      if (overlapPercent > 0) {
        overlaps.push({
          fund1: fund1.name,
          fund2: fund2.name,
          overlapPercent: Math.round(overlapPercent * 10) / 10,
          commonStocks
        });
      }
    }
  }
  
  return overlaps.sort((a, b) => b.overlapPercent - a.overlapPercent);
}

function getMockHoldings(fundName: string): string[] {
  const allStocks = [
    'HDFC Bank', 'Reliance Industries', 'ICICI Bank', 'Infosys', 'TCS',
    'Larsen & Toubro', 'Kotak Mahindra', 'ITC', 'SBI', 'Bharti Airtel',
    'HUL', 'Asian Paints', 'Maruti Suzuki', 'Axis Bank', ' Bajaj Finance',
    'Tata Motors', 'Sun Pharma', 'NTPC', 'Power Grid', 'Nestle India'
  ];
  
  const seed = fundName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const count = 5 + (seed % 10);
  const selected: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = (seed * (i + 1)) % allStocks.length;
    if (!selected.includes(allStocks[index])) {
      selected.push(allStocks[index]);
    }
  }
  
  return selected;
}

export function compareExpenseRatios(funds: PortfolioFund[]): { fund: string; expenseRatio: number; category: string; comparison: string }[] {
  const categoryBenchmarks: Record<string, number> = {
    'equity': 0.65,
    'elss': 0.65,
    'index': 0.15,
    'sector': 1.00,
    'hybrid': 0.90,
    'debt': 0.50,
    'liquid': 0.30
  };
  
  return funds.map(fund => {
    const benchmark = categoryBenchmarks[fund.category] || 0.75;
    let comparison = 'Average';
    
    if (fund.expenseRatio < benchmark * 0.7) {
      comparison = 'Excellent (Below Average)';
    } else if (fund.expenseRatio < benchmark) {
      comparison = 'Good (Below Benchmark)';
    } else if (fund.expenseRatio > benchmark * 1.3) {
      comparison = 'Poor (Above Average)';
    } else {
      comparison = 'Average (At Benchmark)';
    }
    
    return {
      fund: fund.name,
      expenseRatio: fund.expenseRatio,
      category: fund.category,
      comparison
    };
  }).sort((a, b) => a.expenseRatio - b.expenseRatio);
}

export function generateRebalanceRecommendations(
  portfolio: PortfolioData,
  targetAllocation: { equity: number; debt: number; gold: number; cash: number }
): RebalanceRecommendation[] {
  const recommendations: RebalanceRecommendation[] = [];
  
  const currentAllocation = calculateCurrentAllocation(portfolio.funds);
  
  const tolerance = 5;
  
  for (const [category, targetPct] of Object.entries(targetAllocation)) {
    const currentPct = currentAllocation[category] || 0;
    const diff = targetPct - currentPct;
    
    if (Math.abs(diff) > tolerance) {
      const targetValue = (portfolio.totalValue * targetPct) / 100;
      const currentValue = (portfolio.totalValue * currentPct) / 100;
      const adjustmentAmount = Math.abs(targetValue - currentValue);
      
      if (diff > 0) {
        const underweightCategory = portfolio.funds
          .filter(f => getCategoryType(f.category) === category)
          .sort((a, b) => b.gainLossPercent - a.gainLossPercent);
        
        if (underweightCategory.length > 0) {
          recommendations.push({
            type: 'buy',
            toFund: underweightCategory[0].name,
            amount: Math.round(adjustmentAmount),
            reason: `Increase ${category} allocation from ${currentPct.toFixed(1)}% to ${targetPct}%. Current allocation is underweight by ${Math.abs(diff).toFixed(1)}%.`,
            priority: Math.abs(diff) > 15 ? 'high' : 'medium',
            expectedImpact: `Adding ₹${adjustmentAmount.toLocaleString()} to ${underweightCategory[0].name} will help balance your portfolio.`
          });
        }
      } else {
        const overweightFunds = portfolio.funds
          .filter(f => getCategoryType(f.category) === category)
          .sort((a, b) => {
            if (a.gainLossPercent > 0 && b.gainLossPercent < 0) return 1;
            if (a.gainLossPercent < 0 && b.gainLossPercent > 0) return -1;
            return b.gainLossPercent - a.gainLossPercent;
          });
        
        if (overweightFunds.length > 0) {
          const bestTarget = portfolio.funds.find(f => getCategoryType(f.category) !== category && f.gainLossPercent < 0);
          
          recommendations.push({
            type: 'sell',
            fromFund: overweightFunds[0].name,
            amount: Math.round(adjustmentAmount),
            reason: `Reduce ${category} allocation from ${currentPct.toFixed(1)}% to ${targetPct}%. Current allocation is overweight by ${Math.abs(diff).toFixed(1)}%.`,
            priority: Math.abs(diff) > 15 ? 'high' : 'medium',
            expectedImpact: bestTarget 
              ? `Consider switching ₹${adjustmentAmount.toLocaleString()} from ${overweightFunds[0].name} to ${bestTarget.name} for better tax-loss harvesting.`
              : `Consider redeeming ₹${adjustmentAmount.toLocaleString()} from ${overweightFunds[0].name}.`
          });
        }
      }
    }
  }
  
  const overlaps = calculateFundOverlap(portfolio.funds);
  const highOverlap = overlaps.find(o => o.overlapPercent > 40);
  
  if (highOverlap) {
    const lowerPerforming = portfolio.funds.find(f => 
      f.name === highOverlap.fund1 || f.name === highOverlap.fund2
    );
    
    recommendations.push({
      type: 'switch',
      fromFund: lowerPerforming?.name,
      toFund: 'Lower-overlap alternative fund',
      amount: Math.round((lowerPerforming?.currentValue || 0) * 0.3),
      reason: `High overlap (${highOverlap.overlapPercent}%) detected between ${highOverlap.fund1} and ${highOverlap.fund2}. Consider consolidating to reduce concentration risk.`,
      priority: 'high',
      expectedImpact: 'Reducing overlap will improve diversification and may lower overall portfolio volatility.'
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

function calculateCurrentAllocation(funds: PortfolioFund[]): Record<string, number> {
  const allocation: Record<string, number> = {
    equity: 0,
    debt: 0,
    gold: 0,
    cash: 0
  };
  
  const totalValue = funds.reduce((sum, f) => sum + f.currentValue, 0);
  if (totalValue === 0) return allocation;
  
  for (const fund of funds) {
    const categoryType = getCategoryType(fund.category);
    allocation[categoryType] = (allocation[categoryType] || 0) + (fund.currentValue / totalValue) * 100;
  }
  
  return allocation;
}

function getCategoryType(category: string): string {
  const equityCategories = ['equity', 'elss', 'sector', 'index'];
  const debtCategories = ['debt', 'liquid'];
  const hybridCategories = ['hybrid'];
  
  if (equityCategories.includes(category)) return 'equity';
  if (debtCategories.includes(category)) return 'debt';
  if (hybridCategories.includes(category)) return 'gold';
  return 'cash';
}

export function calculatePortfolioMetrics(portfolio: PortfolioData) {
  const totalValue = portfolio.funds.reduce((sum, f) => sum + f.currentValue, 0);
  const totalInvested = portfolio.funds.reduce((sum, f) => sum + f.investedValue, 0);
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
  
  const categoryBreakdown: Record<string, { value: number; percentage: number }> = {};
  
  for (const fund of portfolio.funds) {
    if (!categoryBreakdown[fund.category]) {
      categoryBreakdown[fund.category] = { value: 0, percentage: 0 };
    }
    categoryBreakdown[fund.category].value += fund.currentValue;
  }
  
  for (const cat of Object.keys(categoryBreakdown)) {
    categoryBreakdown[cat].percentage = (categoryBreakdown[cat].value / totalValue) * 100;
  }
  
  const topPerformers = [...portfolio.funds]
    .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
    .slice(0, 3);
  
  const worstPerformers = [...portfolio.funds]
    .sort((a, b) => a.gainLossPercent - b.gainLossPercent)
    .slice(0, 3);
  
  const avgExpenseRatio = portfolio.funds.length > 0
    ? portfolio.funds.reduce((sum, f) => sum + f.expenseRatio, 0) / portfolio.funds.length
    : 0;
  
  return {
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    categoryBreakdown,
    topPerformers,
    worstPerformers,
    avgExpenseRatio
  };
}

export function generateAIInsights(portfolio: PortfolioData, recommendations: RebalanceRecommendation[]): string[] {
  const insights: string[] = [];
  
  const metrics = calculatePortfolioMetrics(portfolio);
  
  if (metrics.totalGainLossPercent > 15) {
    insights.push(`Your portfolio is performing exceptionally well with ${metrics.totalGainLossPercent.toFixed(1)}% returns. Consider locking in profits by diversifying into debt funds.`);
  } else if (metrics.totalGainLossPercent < -5) {
    insights.push(`Your portfolio is currently down ${Math.abs(metrics.totalGainLossPercent).toFixed(1)}%. Stay disciplined and avoid panic selling - historical data shows markets recover.`);
  }
  
  const highOverlap = calculateFundOverlap(portfolio.funds).find(o => o.overlapPercent > 50);
  if (highOverlap) {
    insights.push(`Warning: ${highOverlap.fund1} and ${highOverlap.fund2} have ${highOverlap.overlapPercent}% stock overlap. This reduces diversification benefits.`);
  }
  
  const highExpenseFunds = portfolio.funds.filter(f => f.expenseRatio > 1.5);
  if (highExpenseFunds.length > 0) {
    insights.push(`Consider replacing ${highExpenseFunds[0].name} (expense ratio: ${highExpenseFunds[0].expenseRatio}%) with a lower-cost index fund to save on annual fees.`);
  }
  
  const equityAllocation = metrics.categoryBreakdown['equity']?.percentage || 0;
  if (equityAllocation > 80) {
    insights.push(`Your portfolio is heavily equity-focused (${equityAllocation.toFixed(1)}%). Consider adding debt exposure for better risk management.`);
  }
  
  if (recommendations.length > 0) {
    const highPriority = recommendations.filter(r => r.priority === 'high');
    if (highPriority.length > 0) {
      insights.push(`Action needed: ${highPriority[0].reason}`);
    }
  }
  
  return insights;
}

export function savePortfolioData(portfolio: PortfolioData) {
  const userData = loadUserData();
  userData.portfolio_data = portfolio;
  saveUserData(userData);
}

export function loadPortfolioData(): PortfolioData | null {
  const userData = loadUserData();
  return userData.portfolio_data || null;
}

export function saveFinancialPlan(plan: FinancialPlan) {
  const userData = loadUserData();
  userData.financial_plan = plan;
  saveUserData(userData);
}

export function loadFinancialPlan(): FinancialPlan | null {
  const userData = loadUserData();
  return userData.financial_plan || null;
}

export function saveHealthScore(score: number) {
  const userData = loadUserData();
  userData.health_score = score;
  saveUserData(userData);
}

export function loadHealthScore(): number {
  const userData = loadUserData();
  return userData.health_score || 0;
}
