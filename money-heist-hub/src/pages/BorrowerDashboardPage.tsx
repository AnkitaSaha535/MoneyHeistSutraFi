import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHeist } from "@/context/HeistContext";
import { 
  calculateCreditScore, 
  analyzeCashFlow, 
  calculateLoanEligibility, 
  assessRisk, 
  simulateFutureImpact,
  getInterestRateRecommendation,
  DEFAULT_BORROWER_PROFILE,
  type BorrowerProfile,
  type CashFlowAnalysis,
  type LoanEligibility,
  type RiskAssessment,
  type FutureImpact
} from "@/lib/creditEngine";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Shield, 
  AlertTriangle, 
  Target, 
  Clock,
  BarChart3,
  PieChart,
  Activity,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Calculator,
  Wallet,
  Home,
  Car,
  GraduationCap,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Zap
} from "lucide-react";

interface XAIFactor {
  name: string;
  impact: "positive" | "negative" | "neutral";
  weight: number;
  description: string;
  explanation: string;
}

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const getColor = () => {
    if (score >= 750) return "from-emerald-500 to-emerald-600";
    if (score >= 650) return "from-yellow-500 to-yellow-600";
    if (score >= 550) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  const getGrade = () => {
    if (score >= 800) return "Excellent";
    if (score >= 750) return "Very Good";
    if (score >= 700) return "Good";
    if (score >= 650) return "Fair";
    if (score >= 550) return "Poor";
    return "Very Poor";
  };

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-secondary"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(score / 850) * 283} 283`}
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={getColor()} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-xs font-medium ${score >= 750 ? 'text-emerald-500' : score >= 650 ? 'text-yellow-500' : 'text-red-500'}`}>
          {getGrade()}
        </span>
      </div>
    </div>
  );
}

function XAIExplanation({ factors }: { factors: XAIFactor[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const positiveFactors = factors.filter(f => f.impact === "positive");
  const negativeFactors = factors.filter(f => f.impact === "negative");

  return (
    <div className="space-y-3">
      {positiveFactors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-emerald-500 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Positive Factors
          </p>
          {positiveFactors.map((factor, i) => (
            <div key={i} className="mb-2">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="flex items-center justify-between w-full text-left p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
              >
                <span className="text-sm text-foreground">{factor.name}</span>
                <span className="text-xs text-emerald-500">+{factor.weight}%</span>
              </button>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-1 p-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg"
                >
                  {factor.explanation}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
      {negativeFactors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-red-500 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Risk Factors
          </p>
          {negativeFactors.map((factor, i) => (
            <div key={i} className="mb-2">
              <button
                onClick={() => setExpanded(expanded === i + 100 ? null : i + 100)}
                className="flex items-center justify-between w-full text-left p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
              >
                <span className="text-sm text-foreground">{factor.name}</span>
                <span className="text-xs text-red-500">-{factor.weight}%</span>
              </button>
              {expanded === i + 100 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-1 p-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg"
                >
                  {factor.explanation}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LoanSimulator({ profile }: { profile: BorrowerProfile }) {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(36);
  const [eligibility, setEligibility] = useState<LoanEligibility | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [impact, setImpact] = useState<FutureImpact | null>(null);

  useEffect(() => {
    const elig = calculateLoanEligibility(profile, loanAmount, tenure);
    const riskAssmt = assessRisk(profile, elig.EMI);
    const impactSim = simulateFutureImpact(profile, elig.EMI, loanAmount);
    setEligibility(elig);
    setRisk(riskAssmt);
    setImpact(impactSim);
  }, [profile, loanAmount, tenure]);

  const rateRecommendation = getInterestRateRecommendation(profile);

  return (
    <div className="money-card p-6">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-emerald-500" />
        Loan Affordability Simulator
      </h3>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Loan Amount (₹)</label>
          <input
            type="range"
            min="100000"
            max="5000000"
            step="50000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">₹1L</span>
            <span className="text-foreground font-medium">₹{loanAmount.toLocaleString()}</span>
            <span className="text-muted-foreground">₹50L</span>
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Tenure (months)</label>
          <input
            type="range"
            min="12"
            max="84"
            step="6"
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">12</span>
            <span className="text-foreground font-medium">{tenure} months</span>
            <span className="text-muted-foreground">84</span>
          </div>
        </div>
      </div>

      {eligibility && risk && impact && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs text-muted-foreground mb-1">Approval Chance</p>
              <p className={`text-2xl font-bold ${eligibility.approvalProbability >= 70 ? 'text-emerald-500' : eligibility.approvalProbability >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {eligibility.approvalProbability}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
              <p className="text-2xl font-bold text-blue-500">{eligibility.interestRate}%</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-xs text-muted-foreground mb-1">Monthly EMI</p>
              <p className="text-2xl font-bold text-purple-500">₹{eligibility.EMI.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
              <p className={`text-lg font-bold ${risk.riskLevel === 'low' ? 'text-emerald-500' : risk.riskLevel === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                {risk.riskLevel.charAt(0).toUpperCase() + risk.riskLevel.slice(1)}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Lifestyle Impact Analysis (XAI)
            </h4>
            <p className="text-sm text-muted-foreground mb-3">{impact.lifestyleImpact}</p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                impact.stressLevel === 'low' ? 'bg-emerald-500/20 text-emerald-500' :
                impact.stressLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-red-500/20 text-red-500'
              }`}>
                Stress: {impact.stressLevel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500">
                Recovery: {impact.recoveryTimeline}
              </span>
              {impact.affectedGoals.map((goal, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-500">
                  {goal}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3 italic">{impact.recommendation}</p>
          </div>

          {eligibility.reasons.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">AI Decision Factors</h4>
              <XAIExplanation 
                factors={risk.factors.map(f => ({
                  ...f,
                  explanation: `${f.description}. This factor contributes ${f.weight}% to your overall risk assessment.`
                }))} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CashFlowAnalysisCard({ cashFlow }: { cashFlow: CashFlowAnalysis }) {
  return (
    <div className="money-card p-6">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        Cash Flow Analysis
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-xs text-muted-foreground mb-1">Monthly Surplus</p>
          <p className="text-xl font-bold text-emerald-500">₹{cashFlow.monthlySurplus.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-muted-foreground mb-1">Surplus Ratio</p>
          <p className="text-xl font-bold text-blue-500">{cashFlow.surplusRatio.toFixed(1)}%</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-xs text-muted-foreground mb-1">Available for EMI</p>
          <p className="text-xl font-bold text-purple-500">₹{cashFlow.availableForEMI.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-muted-foreground mb-1">Max Sustainable EMI</p>
          <p className="text-xl font-bold text-yellow-500">₹{cashFlow.maxSustainableEMI.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-xs text-muted-foreground mb-1">Stability</p>
          <p className="text-lg font-semibold text-cyan-500 capitalize">{cashFlow.stability}</p>
        </div>
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <p className="text-xs text-muted-foreground mb-1">Trend</p>
          <p className="text-lg font-semibold text-orange-500 capitalize">{cashFlow.trend}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          AI Insight
        </h4>
        <p className="text-sm text-muted-foreground">
          Your cash flow is <span className="text-foreground font-medium capitalize">{cashFlow.stability}</span> with a {cashFlow.surplusRatio.toFixed(0)}% surplus. 
          You can comfortably handle an EMI of up to ₹{cashFlow.maxSustainableEMI.toLocaleString()} while maintaining your lifestyle.
        </p>
      </div>
    </div>
  );
}

function RiskAlertsCard({ risk }: { risk: RiskAssessment }) {
  const getAlertColor = (level: string) => {
    switch (level) {
      case "low": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
      case "medium": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-500";
      case "high": return "bg-orange-500/10 border-orange-500/20 text-orange-500";
      case "very-high": return "bg-red-500/10 border-red-500/20 text-red-500";
      default: return "bg-secondary border-border";
    }
  };

  return (
    <div className="money-card p-6">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-red-500" />
        Risk Assessment & Alerts
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <div className={`p-4 rounded-xl border ${getAlertColor(risk.riskLevel)}`}>
          <p className="text-sm mb-1">Risk Level</p>
          <p className="text-2xl font-bold capitalize">{risk.riskLevel.replace('-', ' ')}</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary border border-border flex-1">
          <p className="text-sm text-muted-foreground mb-1">Default Probability</p>
          <p className="text-2xl font-bold text-foreground">{risk.defaultProbability}%</p>
        </div>
      </div>

      {risk.recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">AI Recommendations</h4>
          {risk.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{rec}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LoanPurposeSelector({ onSelect }: { onSelect: (purpose: string) => void }) {
  const purposes = [
    { id: "home", icon: Home, label: "Home Loan", color: "bg-blue-500" },
    { id: "car", icon: Car, label: "Car Loan", color: "bg-green-500" },
    { id: "education", icon: GraduationCap, label: "Education", color: "bg-purple-500" },
    { id: "personal", icon: Wallet, label: "Personal Loan", color: "bg-yellow-500" },
    { id: "business", icon: Briefcase, label: "Business", color: "bg-orange-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {purposes.map((purpose) => (
        <button
          key={purpose.id}
          onClick={() => onSelect(purpose.id)}
          className="p-4 rounded-xl bg-secondary border border-border hover:border-emerald-500/50 transition-all flex flex-col items-center gap-2"
        >
          <div className={`w-10 h-10 rounded-lg ${purpose.color} flex items-center justify-center`}>
            <purpose.icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm text-foreground">{purpose.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function BorrowerDashboardPage() {
  const navigate = useNavigate();
  const { userData } = useHeist();
  const [profile, setProfile] = useState<BorrowerProfile>(DEFAULT_BORROWER_PROFILE);
  const [activeTab, setActiveTab] = useState<"overview" | "simulator" | "cashflow" | "risk">("overview");

  const creditScore = calculateCreditScore(profile);
  const cashFlow = analyzeCashFlow(profile);
  const risk = assessRisk(profile);
  const eligibility = calculateLoanEligibility(profile);

  useEffect(() => {
    if (userData.userRole !== "borrower") {
      navigate("/auth");
    }
  }, [userData.userRole, navigate]);

  const xaiFactors: XAIFactor[] = [
    {
      name: "Payment History",
      impact: risk.factors.find(f => f.name.includes("Payment"))?.impact || "neutral",
      weight: 35,
      description: "Your payment history shows 95% on-time payments",
      explanation: "35% of your credit score is based on payment history. Maintaining a 95%+ payment rate significantly boosts your score."
    },
    {
      name: "Credit Utilization",
      impact: risk.factors.find(f => f.name.includes("Utilization"))?.impact || "neutral",
      weight: 30,
      description: "Your credit utilization is at 28%",
      explanation: "30% of your score depends on credit utilization. Keeping it below 30% shows responsible credit management."
    },
    {
      name: "Credit Age",
      impact: "positive",
      weight: 15,
      description: "Your average credit history is 5 years",
      explanation: "A longer credit history provides more data points for lenders to assess your reliability."
    },
    {
      name: "Income Stability",
      impact: "positive",
      weight: 20,
      description: "Salaried employment with steady income",
      explanation: "Stable employment income reduces default risk and improves loan eligibility."
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="bg-money-dark fixed inset-0" />
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="money-title text-3xl md:text-4xl mb-2">Borrower Dashboard</h1>
              <p className="text-muted-foreground">AI-Powered Credit Intelligence</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6">
          {[
            { id: "overview", label: "Credit Overview" },
            { id: "simulator", label: "Loan Simulator" },
            { id: "cashflow", label: "Cash Flow" },
            { id: "risk", label: "Risk Analysis" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="money-card p-6 flex flex-col items-center"
              >
                <h3 className="text-lg font-bold text-foreground mb-4">Credit Score</h3>
                <ScoreGauge score={creditScore} label="CREDIT SCORE" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="money-card p-6"
              >
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  XAI Score Explanation
                </h3>
                <XAIExplanation factors={xaiFactors} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="money-card p-6"
              >
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Loan Eligibility
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Max Eligible Amount</p>
                    <p className="text-2xl font-bold text-emerald-500">₹{eligibility.maxAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Approval Probability</p>
                    <p className="text-2xl font-bold text-blue-500">{eligibility.approvalProbability}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Recommended Tenure</p>
                    <p className="text-xl font-bold text-purple-500">{eligibility.recommendedTenure} months</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <CashFlowAnalysisCard cashFlow={cashFlow} />
              <RiskAlertsCard risk={risk} />
            </div>

            <LoanSimulator profile={profile} />
          </div>
        )}

        {activeTab === "simulator" && <LoanSimulator profile={profile} />}
        
        {activeTab === "cashflow" && <CashFlowAnalysisCard cashFlow={cashFlow} />}
        
        {activeTab === "risk" && <RiskAlertsCard risk={risk} />}
      </div>
    </div>
  );
}