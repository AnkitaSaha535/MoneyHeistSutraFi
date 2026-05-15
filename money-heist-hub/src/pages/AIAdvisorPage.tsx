import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Target, 
  TrendingUp, 
  Lightbulb, 
  ArrowRight, 
  Star,
  Zap,
  Clock,
  DollarSign,
  PieChart,
  Shield,
  CheckCircle2,
  Briefcase,
  Home,
  Car,
  GraduationCap,
  Heart
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "credit" | "savings" | "investment" | "debt" | "insurance";
  timeframe: string;
  savings?: number;
  scoreImpact?: number;
  completed: boolean;
  steps: string[];
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Reduce Credit Utilization Below 30%",
    description: "Your current utilization of 45% is hurting your score. Paying down ₹25,000 will optimize this factor.",
    impact: "high",
    category: "credit",
    timeframe: "1-2 months",
    scoreImpact: 35,
    completed: false,
    steps: [
      "Transfer ₹25,000 from savings to credit card",
      "Set up autopay for minimum due",
      "Monitor utilization weekly"
    ]
  },
  {
    id: "2",
    title: "Pay Off Personal Loan Early",
    description: "Focus on the ₹2.5L personal loan (12% interest) before the car loan to save more on interest.",
    impact: "high",
    category: "debt",
    timeframe: "6-8 months",
    savings: 45000,
    completed: false,
    steps: [
      "Calculate prepayment penalty",
      "Use bonus to make lump sum payment",
      "Recalculate EMI with remaining principal"
    ]
  },
  {
    id: "3",
    title: "Start Emergency Fund Top-Up",
    description: "Your 3-month emergency fund is below the recommended 6-month coverage. Add ₹50,000.",
    impact: "medium",
    category: "savings",
    timeframe: "3-6 months",
    savings: 50000,
    completed: false,
    steps: [
      "Open dedicated savings account",
      "Set up recurring transfer of ₹8,000/month",
      "Track progress in dashboard"
    ]
  },
  {
    id: "4",
    title: "Diversify Investment Portfolio",
    description: "Your portfolio is 80% in equities. Consider adding debt funds for better risk management.",
    impact: "medium",
    category: "investment",
    timeframe: "1-3 months",
    completed: false,
    steps: [
      "Review current asset allocation",
      "Consult with advisor on bond funds",
      "Set up SIP in balanced fund"
    ]
  },
  {
    id: "5",
    title: "Get Term Life Insurance",
    description: "No life insurance detected. A ₹1Cr term cover for 30 years costs only ₹1,000/year.",
    impact: "low",
    category: "insurance",
    timeframe: "1 month",
    completed: false,
    steps: [
      "Calculate human life value",
      "Compare term plans online",
      "Medical test and policy issue"
    ]
  },
  {
    id: "6",
    title: "Automate Monthly Investments",
    description: "Set up ₹15,000/month SIP to reach your 2025 goal of ₹10 lakhs.",
    impact: "medium",
    category: "investment",
    timeframe: "Ongoing",
    savings: 120000,
    completed: true,
    steps: [
      "Select funds for SIP",
      "Set up auto-debit from salary account",
      "Track monthly progress"
    ]
  }
];

const goals = [
  { name: "Buy Home", target: 5000000, current: 2200000, icon: Home, deadline: "2028", progress: 44 },
  { name: "Car", target: 1500000, current: 800000, icon: Car, deadline: "2026", progress: 53 },
  { name: "Kids Education", target: 3000000, current: 450000, icon: GraduationCap, deadline: "2032", progress: 15 },
  { name: "Retirement", target: 20000000, current: 3500000, icon: Heart, deadline: "2045", progress: 18 },
];

export default function AIAdvisorPage() {
  const [activeTab, setActiveTab] = useState<"recommendations" | "goals" | "insights">("recommendations");
  const [expandedRec, setExpandedRec] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(1);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-emerald-500 bg-emerald-500/20";
      case "medium":
        return "text-amber-500 bg-amber-500/20";
      case "low":
        return "text-blue-500 bg-blue-500/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "credit":
        return <TrendingUp className="w-4 h-4" />;
      case "savings":
        return <DollarSign className="w-4 h-4" />;
      case "investment":
        return <PieChart className="w-4 h-4" />;
      case "debt":
        return <Briefcase className="w-4 h-4" />;
      case "insurance":
        return <Shield className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const handleComplete = (id: string) => {
    if (!mockRecommendations.find(r => r.id === id)?.completed) {
      setCompletedCount(prev => prev + 1);
    }
  };

  const totalScoreImpact = mockRecommendations
    .filter(r => !r.completed)
    .reduce((sum, r) => sum + (r.scoreImpact || 0), 0);

  return (
    <div className="relative min-h-screen">
      <div className="bg-money-dark fixed inset-0" />
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="money-title text-4xl md:text-5xl mb-2">AI Financial Advisor</h1>
          <p className="text-muted-foreground text-lg">Personalized recommendations ranked by impact</p>
        </motion.div>

        {/* Summary Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="money-card mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex flex-col items-center justify-center money-glow-gold">
                <span className="text-2xl font-bold text-white">{completedCount}</span>
                <span className="text-xs text-white/80">DONE</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-1">Your Financial Health</p>
                <p className="text-muted-foreground">{mockRecommendations.filter(r => !r.completed).length} recommendations pending • {totalScoreImpact} potential score improvement</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-sm text-emerald-500">
                    <Zap className="w-4 h-4" /> SHAP-powered insights
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" /> Updated just now
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-muted-foreground">Next recommended action</p>
              <p className="text-lg font-semibold text-foreground">Reduce credit utilization</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["recommendations", "goals", "insights"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "recommendations" ? "Recommendations" : tab === "goals" ? "Goals" : "Insights"}
            </button>
          ))}
        </div>

        {/* Recommendations Tab */}
        {activeTab === "recommendations" && (
          <div className="space-y-4">
            {mockRecommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`money-card ${rec.completed ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      rec.completed ? "bg-emerald-500/20" : "bg-amber-500/20"
                    }`}>
                      {rec.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        getCategoryIcon(rec.category)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-foreground">{rec.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                          {rec.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {rec.timeframe}
                        </span>
                        {rec.savings && (
                          <span className="flex items-center gap-1 text-emerald-500">
                            <DollarSign className="w-4 h-4" />
                            Save ₹{rec.savings.toLocaleString()}
                          </span>
                        )}
                        {rec.scoreImpact && !rec.completed && (
                          <span className="flex items-center gap-1 text-amber-500">
                            <TrendingUp className="w-4 h-4" />
                            +{rec.scoreImpact} credit score
                          </span>
                        )}
                      </div>

                      {expandedRec === rec.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border"
                        >
                          <p className="font-medium text-foreground mb-3">How to implement:</p>
                          <ol className="space-y-2">
                            {rec.steps.map((step, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs flex-shrink-0">
                                  {i + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                          {!rec.completed && (
                            <button
                              onClick={() => handleComplete(rec.id)}
                              className="money-button mt-4 flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Mark as Complete
                            </button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
                      className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowRight className={`w-5 h-5 transition-transform ${expandedRec === rec.id ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="money-card"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <goal.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">Target: {goal.deadline}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">₹{goal.current.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">of ₹{goal.target.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">{goal.progress}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    ₹{(goal.target - goal.current).toLocaleString()} remaining
                  </span>
                  <button className="text-sm text-emerald-500 font-medium hover:underline flex items-center gap-1">
                    Add contribution <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="money-card">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Top Score Boosters
              </h3>
              <div className="space-y-3">
                {[
                  { action: "Reduce utilization to <30%", impact: "+35 pts" },
                  { action: "Remove hard inquiries", impact: "+20 pts" },
                  { action: "Add credit mix", impact: "+15 pts" },
                  { action: "Increase credit age", impact: "+10 pts" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-foreground">{item.action}</span>
                    <span className="text-emerald-500 font-bold">{item.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="money-card">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Quick Wins
              </h3>
              <div className="space-y-3">
                {[
                  { action: "Set up autopay for credit cards", savings: "₹5,000/yr" },
                  { action: "Consolidate high-interest debt", savings: "₹12,000/yr" },
                  { action: "Negotiate insurance premium", savings: "₹3,000/yr" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <span className="text-foreground">{item.action}</span>
                    <span className="text-emerald-500 font-bold">{item.savings}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="money-card md:col-span-2">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Spending Optimization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Savings Potential</p>
                  <p className="text-2xl font-bold text-foreground">₹12,500</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Investment Growth</p>
                  <p className="text-2xl font-bold text-emerald-500">+18%</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Debt Payoff Target</p>
                  <p className="text-2xl font-bold text-foreground">8 months</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}