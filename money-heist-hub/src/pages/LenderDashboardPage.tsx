import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useHeist } from "@/context/HeistContext";
import { 
  calculateCreditScore, 
  analyzeCashFlow, 
  assessRisk, 
  getInterestRateRecommendation,
  filterBorrowers,
  MOCK_BORROWERS,
  type BorrowerProfile,
  type RiskAssessment,
  type LenderProfile
} from "@/lib/creditEngine";
import { 
  Building2, 
  Users, 
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
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  Star,
  Heart,
  Briefcase,
  GraduationCap,
  Home,
  Car,
  Wallet,
  Calendar,
  Percent
} from "lucide-react";

interface BorrowerWithScore extends BorrowerProfile {
  id: string;
  creditScore: number;
  riskAssessment: RiskAssessment;
  cashFlow: ReturnType<typeof analyzeCashFlow>;
}

function BorrowerCard({ borrower, onEvaluate }: { borrower: BorrowerWithScore; onEvaluate: (b: BorrowerWithScore) => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-emerald-500";
    if (score >= 650) return "text-yellow-500";
    return "text-red-500";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-emerald-500/20 text-emerald-500";
      case "medium": return "bg-yellow-500/20 text-yellow-500";
      case "high": return "bg-orange-500/20 text-orange-500";
      case "very-high": return "bg-red-500/20 text-red-500";
      default: return "bg-secondary text-muted-foreground";
    }
  };

  const employmentIcons: Record<string, typeof Briefcase> = {
    salaried: Briefcase,
    entrepreneur: TrendingUp,
    "self-employed": Wallet,
    retired: Heart,
  };
  const Icon = employmentIcons[borrower.employmentType] || Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="money-card p-5 hover:border-emerald-500/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Borrower #{borrower.id}</h4>
            <p className="text-sm text-muted-foreground capitalize">{borrower.employmentType}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${getScoreColor(borrower.creditScore)}`}>{borrower.creditScore}</p>
          <p className="text-xs text-muted-foreground">Credit Score</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground">Monthly Income</p>
          <p className="font-semibold text-foreground">₹{borrower.monthlyIncome.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground">Surplus</p>
          <p className="font-semibold text-emerald-500">₹{borrower.cashFlow.monthlySurplus.toLocaleString()}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground">Total Assets</p>
          <p className="font-semibold text-foreground">₹{(borrower.totalAssets / 100000).toFixed(1)}L</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground">Risk Level</p>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRiskColor(borrower.riskAssessment.riskLevel)}`}>
            {borrower.riskAssessment.riskLevel}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEvaluate(borrower)}
          className="flex-1 py-2 px-4 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-colors text-sm font-medium"
        >
          Evaluate
        </button>
        <button className="py-2 px-4 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors text-sm">
          View Profile
        </button>
      </div>
    </motion.div>
  );
}

function BorrowerEvaluator({ borrower, onClose }: { borrower: BorrowerWithScore; onClose: () => void }) {
  const rateRecommendation = getInterestRateRecommendation(borrower);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative money-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Borrower Evaluation #{borrower.id}</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg">
            <XCircle className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Credit Score Analysis
            </h4>
            <div className="text-4xl font-bold text-blue-500 mb-2">{borrower.creditScore}</div>
            <p className="text-sm text-muted-foreground">
              Based on payment history (35%), credit utilization (30%), credit age (15%), credit mix (10%), and new inquiries (10%).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-500" />
              Interest Rate Recommendation
            </h4>
            <div className="text-4xl font-bold text-emerald-500 mb-2">{rateRecommendation.recommendedRate}%</div>
            <p className="text-sm text-muted-foreground">
              Range: {rateRecommendation.minRate}% - {rateRecommendation.maxRate}% based on risk profile
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            Risk Assessment (XAI)
          </h4>
          {borrower.riskAssessment.factors.map((factor, i) => (
            <div key={i} className={`p-3 rounded-lg ${factor.impact === 'positive' ? 'bg-emerald-500/10 border-emerald-500/20' : factor.impact === 'negative' ? 'bg-red-500/10 border-red-500/20' : 'bg-secondary'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{factor.name}</span>
                <span className={`text-xs ${factor.impact === 'positive' ? 'text-emerald-500' : factor.impact === 'negative' ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {factor.impact === 'positive' ? '+' : factor.impact === 'negative' ? '-' : ''}{factor.weight}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            AI Risk Factors
          </h4>
          <ul className="space-y-2">
            <li className="text-sm text-muted-foreground">• Default Probability: {borrower.riskAssessment.defaultProbability}%</li>
            <li className="text-sm text-muted-foreground">• Risk Level: {borrower.riskAssessment.riskLevel}</li>
            <li className="text-sm text-muted-foreground">• Cash Flow Stability: {borrower.cashFlow.stability}</li>
            <li className="text-sm text-muted-foreground">• Max Sustainable EMI: ₹{borrower.cashFlow.maxSustainableEMI.toLocaleString()}/month</li>
          </ul>
        </div>

        {borrower.riskAssessment.recommendations.length > 0 && (
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              Lending Recommendations
            </h4>
            <ul className="space-y-2">
              {borrower.riskAssessment.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FilterPanel({ filters, setFilters }: { 
  filters: { minScore: number; incomeRange: [number, number]; employmentType: string[]; riskLevel: string[] };
  setFilters: (f: typeof filters) => void;
}) {
  return (
    <div className="money-card p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5 text-emerald-500" />
        Borrower Filters
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Minimum Credit Score</label>
          <input
            type="range"
            min="500"
            max="850"
            step="50"
            value={filters.minScore}
            onChange={(e) => setFilters({ ...filters, minScore: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>500</span>
            <span className="text-foreground font-medium">{filters.minScore}</span>
            <span>850</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Monthly Income Range (₹)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.incomeRange[0]}
              onChange={(e) => setFilters({ ...filters, incomeRange: [Number(e.target.value), filters.incomeRange[1]] })}
              className="w-full p-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.incomeRange[1]}
              onChange={(e) => setFilters({ ...filters, incomeRange: [filters.incomeRange[0], Number(e.target.value)] })}
              className="w-full p-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Employment Type</label>
          <div className="flex flex-wrap gap-2">
            {["salaried", "entrepreneur", "self-employed", "retired"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  const newTypes = filters.employmentType.includes(type)
                    ? filters.employmentType.filter(t => t !== type)
                    : [...filters.employmentType, type];
                  setFilters({ ...filters, employmentType: newTypes });
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filters.employmentType.includes(type)
                    ? "bg-emerald-500 text-white"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Risk Level</label>
          <div className="flex flex-wrap gap-2">
            {["low", "medium", "high", "very-high"].map((level) => (
              <button
                key={level}
                onClick={() => {
                  const newLevels = filters.riskLevel.includes(level)
                    ? filters.riskLevel.filter(l => l !== level)
                    : [...filters.riskLevel, level];
                  setFilters({ ...filters, riskLevel: newLevels });
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filters.riskLevel.includes(level)
                    ? "bg-emerald-500 text-white"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LenderDashboardPage() {
  const navigate = useNavigate();
  const { userData } = useHeist();
  const [filters, setFilters] = useState({
    minScore: 500,
    incomeRange: [0, 500000] as [number, number],
    employmentType: [] as string[],
    riskLevel: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState<BorrowerWithScore | null>(null);

  const borrowersWithScores: BorrowerWithScore[] = useMemo(() => {
    return MOCK_BORROWERS.map((profile, idx) => {
      const score = calculateCreditScore(profile);
      const risk = assessRisk(profile);
      const cashFlow = analyzeCashFlow(profile);
      return {
        ...profile,
        id: String(idx + 1),
        creditScore: score,
        riskAssessment: risk,
        cashFlow,
      };
    });
  }, []);

  const filteredBorrowers = useMemo(() => {
    return borrowersWithScores.filter(b => {
      if (b.creditScore < filters.minScore) return false;
      if (b.monthlyIncome < filters.incomeRange[0] || b.monthlyIncome > filters.incomeRange[1]) return false;
      if (filters.employmentType.length > 0 && !filters.employmentType.includes(b.employmentType)) return false;
      if (filters.riskLevel.length > 0 && !filters.riskLevel.includes(b.riskAssessment.riskLevel)) return false;
      return true;
    });
  }, [borrowersWithScores, filters]);

  const stats = useMemo(() => {
    const total = filteredBorrowers.length;
    const avgScore = total > 0 ? filteredBorrowers.reduce((sum, b) => sum + b.creditScore, 0) / total : 0;
    const lowRisk = filteredBorrowers.filter(b => b.riskAssessment.riskLevel === "low").length;
    const avgIncome = total > 0 ? filteredBorrowers.reduce((sum, b) => sum + b.monthlyIncome, 0) / total : 0;
    return { total, avgScore: Math.round(avgScore), lowRisk, avgIncome: Math.round(avgIncome) };
  }, [filteredBorrowers]);

  useEffect(() => {
    if (userData.userRole !== "lender") {
      navigate("/auth");
    }
  }, [userData.userRole, navigate]);

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
              <h1 className="money-title text-3xl md:text-4xl mb-2">Lender Dashboard</h1>
              <p className="text-muted-foreground">AI-Powered Borrower Evaluation & Risk Management</p>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="money-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Borrowers</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="money-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Average Credit Score</p>
            <p className="text-2xl font-bold text-blue-500">{stats.avgScore}</p>
          </div>
          <div className="money-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Low Risk Borrowers</p>
            <p className="text-2xl font-bold text-emerald-500">{stats.lowRisk}</p>
          </div>
          <div className="money-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Average Income</p>
            <p className="text-2xl font-bold text-purple-500">₹{(stats.avgIncome / 1000).toFixed(0)}K</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search borrowers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Available Borrowers ({filteredBorrowers.length})</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                AI-Powered Analysis
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredBorrowers.map((borrower) => (
                <BorrowerCard
                  key={borrower.id}
                  borrower={borrower}
                  onEvaluate={setSelectedBorrower}
                />
              ))}
            </div>

            {filteredBorrowers.length === 0 && (
              <div className="money-card p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No borrowers match your filters</p>
                <button
                  onClick={() => setFilters({ minScore: 500, incomeRange: [0, 500000], employmentType: [], riskLevel: [] })}
                  className="mt-4 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedBorrower && (
          <BorrowerEvaluator
            borrower={selectedBorrower}
            onClose={() => setSelectedBorrower(null)}
          />
        )}
      </div>
    </div>
  );
}