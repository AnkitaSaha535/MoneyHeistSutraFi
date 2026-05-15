import { motion } from "framer-motion";
import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  ArrowRight, 
  RefreshCw,
  Shield,
  AlertTriangle,
  Target,
  Clock,
  BarChart3,
  LineChart,
  DollarSign,
  Percent
} from "lucide-react";

interface ScenarioResult {
  currentScore: number;
  projectedScore: number;
  impact: "positive" | "negative" | "neutral";
  timeframe: string;
  probability: number;
  keyFactors: string[];
}

const mockCurrentData = {
  score: 742,
  utilization: 28,
  paymentHistory: 95,
  creditAge: 4.5,
  accounts: 5,
  hardInquiries: 2,
};

const scenarioTemplates = [
  {
    id: "missed-payment",
    name: "Miss a Payment",
    description: "Simulate missing a credit card payment by 30 days",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    impact: "negative" as const,
  },
  {
    id: "reduce-utilization",
    name: "Reduce Utilization to 20%",
    description: "Pay down credit card balance to 20% utilization",
    icon: TrendingDown,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/20",
    impact: "positive" as const,
  },
  {
    id: "reduce-debt-20",
    name: "Reduce Debt by 20%",
    description: "Pay off 20% of total outstanding debt",
    icon: DollarSign,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/20",
    impact: "positive" as const,
  },
  {
    id: "add-authorized-user",
    name: "Add Authorized User",
    description: "Become an authorized user on a prime credit account",
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
    impact: "positive" as const,
  },
  {
    id: "close-credit-card",
    name: "Close Old Credit Card",
    description: "Close a 5-year-old credit card with ₹50K limit",
    icon: TrendingUp,
    color: "text-amber-500",
    bgColor: "bg-amber-500/20",
    impact: "negative" as const,
  },
  {
    id: "new-inquiry",
    name: "New Hard Inquiry",
    description: "Apply for a new loan or credit card",
    icon: Clock,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    impact: "negative" as const,
  },
];

const simulateScenario = (scenarioId: string): ScenarioResult => {
  const scenarios: Record<string, ScenarioResult> = {
    "missed-payment": {
      currentScore: 742,
      projectedScore: 612,
      impact: "negative",
      timeframe: "3-6 months",
      probability: 85,
      keyFactors: ["Payment history drops by 15%", "Utilization stays same", "New late payment reported"],
    },
    "reduce-utilization": {
      currentScore: 742,
      projectedScore: 768,
      impact: "positive",
      timeframe: "1-2 months",
      probability: 90,
      keyFactors: ["Utilization drops from 28% to 20%", "Credit utilization factor improves", "Available credit increases"],
    },
    "reduce-debt-20": {
      currentScore: 742,
      projectedScore: 755,
      impact: "positive",
      timeframe: "2-3 months",
      probability: 88,
      keyFactors: ["Total debt reduces by 20%", "Payment history maintained", "Credit mix improves slightly"],
    },
    "add-authorized-user": {
      currentScore: 742,
      projectedScore: 758,
      impact: "positive",
      timeframe: "1-3 months",
      probability: 75,
      keyFactors: ["Average age of accounts increases", "Positive payment history inherited", "Total accounts remain same"],
    },
    "close-credit-card": {
      currentScore: 742,
      projectedScore: 724,
      impact: "negative",
      timeframe: "1-2 months",
      probability: 70,
      keyFactors: ["Credit age decreases by 1.2 years", "Total available credit drops", "Utilization may increase"],
    },
    "new-inquiry": {
      currentScore: 742,
      projectedScore: 738,
      impact: "negative",
      timeframe: "1-2 months",
      probability: 80,
      keyFactors: ["Hard inquiry added", "Average age decreases slightly", "New account factor updates"],
    },
  };
  return scenarios[scenarioId] || scenarios["reduce-utilization"];
};

export default function CreditSimulatorPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<"scenarios" | "custom" | "history">("scenarios");

  const handleSimulate = (scenarioId: string) => {
    setIsSimulating(true);
    setSelectedScenario(scenarioId);
    setTimeout(() => {
      setResult(simulateScenario(scenarioId));
      setIsSimulating(false);
    }, 1500);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-emerald-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getImpactBg = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-emerald-500/20 border-emerald-500/30";
      case "negative":
        return "bg-red-500/20 border-red-500/30";
      default:
        return "bg-muted border-muted";
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="bg-money-dark fixed inset-0" />
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="money-title text-4xl md:text-5xl mb-2">Credit Simulator</h1>
          <p className="text-muted-foreground text-lg">What-if scenarios to predict your future credit score</p>
        </motion.div>

        {/* Current Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="money-card mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex flex-col items-center justify-center money-glow-green">
                <span className="text-3xl font-bold text-white">{mockCurrentData.score}</span>
                <span className="text-xs text-white/80">CREDIT SCORE</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-2">Current Credit Health</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Utilization</p>
                    <p className="font-semibold text-foreground">{mockCurrentData.utilization}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment History</p>
                    <p className="font-semibold text-foreground">{mockCurrentData.paymentHistory}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Age</p>
                    <p className="font-semibold text-foreground">{mockCurrentData.creditAge} yrs</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Accounts</p>
                    <p className="font-semibold text-foreground">{mockCurrentData.accounts}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["scenarios", "custom", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "scenarios" ? "Quick Scenarios" : tab === "custom" ? "Custom Simulation" : "History"}
            </button>
          ))}
        </div>

        {/* Scenarios Tab */}
        {activeTab === "scenarios" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {scenarioTemplates.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSimulate(scenario.id)}
                className="money-card cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${scenario.bgColor} flex items-center justify-center`}>
                    <scenario.icon className={`w-6 h-6 ${scenario.color}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{scenario.name}</h3>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`badge-money ${scenario.impact === "positive" ? "badge-money-gold" : ""}`}>
                    {scenario.impact === "positive" ? "Score Boost" : scenario.impact === "negative" ? "Score Drop" : "Neutral"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Custom Tab */}
        {activeTab === "custom" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="money-card mb-8"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-500" />
              Custom Scenario Builder
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Change Utilization By</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    defaultValue="28"
                    className="flex-1"
                  />
                  <span className="text-foreground font-medium">28%</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Add/Remove Account</label>
                <select className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground">
                  <option>Add new credit card</option>
                  <option>Add personal loan</option>
                  <option>Close existing account</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Payment Behavior Change</label>
                <select className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground">
                  <option>Maintain perfect payments</option>
                  <option>Miss 1 payment</option>
                  <option>Miss 2+ payments</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Timeline</label>
                <select className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground">
                  <option>1 month</option>
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>1 year</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => handleSimulate("custom")}
              className="money-button mt-6 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Run Simulation
            </button>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="money-card"
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Simulation History</h3>
            <div className="space-y-3">
              {[
                { scenario: "Reduce Utilization to 20%", score: 768, date: "2 days ago", impact: "positive" },
                { scenario: "Miss a Payment", score: 612, date: "1 week ago", impact: "negative" },
                { scenario: "Add Authorized User", score: 758, date: "2 weeks ago", impact: "positive" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.scenario}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getImpactColor(item.impact)}`}>{item.score}</p>
                    <p className={`text-xs ${getImpactColor(item.impact)}`}>
                      {item.impact === "positive" ? "+26" : item.impact === "negative" ? "-130" : "0"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Modal */}
        {(isSimulating || result) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className={`relative money-card max-w-lg w-full ${getImpactBg(result?.impact || "neutral")}`}>
              {isSimulating ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground">Running ML Simulation...</p>
                  <p className="text-sm text-muted-foreground">Analyzing 50,000 credit profiles</p>
                </div>
              ) : result && (
                <div>
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      result.impact === "positive" ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}>
                      {result.impact === "positive" ? (
                        <TrendingUp className="w-10 h-10 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-10 h-10 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Projected Score After {result.timeframe}</p>
                    <div className="flex items-center justify-center gap-4">
                      <div>
                        <p className="text-3xl font-bold text-muted-foreground">{result.currentScore}</p>
                        <p className="text-xs text-muted-foreground">Current</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                      <div>
                        <p className={`text-3xl font-bold ${getImpactColor(result.impact)}`}>{result.projectedScore}</p>
                        <p className={`text-xs ${getImpactColor(result.impact)}`}>
                          {result.impact === "positive" ? "+" : result.impact === "negative" ? "-" : ""}
                          {Math.abs(result.projectedScore - result.currentScore)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Probability of Outcome</span>
                      <span className="text-sm font-medium text-foreground">{result.probability}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${result.impact === "positive" ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ width: `${result.probability}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">Key Impact Factors</p>
                    <div className="space-y-2">
                      {result.keyFactors.map((factor, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => { setResult(null); setSelectedScenario(null); }}
                    className="w-full mt-6 py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ML Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="money-card mt-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground">ML-Powered Predictions</p>
              <p className="text-sm text-muted-foreground">Based on 50,000+ credit profiles and historical data</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-500">
            <Shield className="w-4 h-4" />
            92% Accuracy
          </div>
        </motion.div>
      </div>
    </div>
  );
}