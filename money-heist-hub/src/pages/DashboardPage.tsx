import { motion } from "framer-motion";
import { useHeist } from "@/context/HeistContext";
import { calculate6DHealthScore, calculateTax } from "@/data/engine";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  ArrowRight, 
  Sparkles,
  Target,
  Flame,
  CheckCircle,
  DollarSign,
  BarChart3,
  CreditCard,
  Shield
} from "lucide-react";

export default function DashboardPage() {
  const { userData, completeDailyTask, incrementStreak } = useHeist();
  const navigate = useNavigate();
  const score = calculate6DHealthScore();

  const [showTax, setShowTax] = useState(false);
  const [taxIncome, setTaxIncome] = useState("");
  const [taxDed, setTaxDed] = useState("");
  const [taxResult, setTaxResult] = useState<any>(null);

  const handleTaxCalc = () => {
    if (taxIncome) {
      setTaxResult(calculateTax(Number(taxIncome), Number(taxDed) || 0));
    }
  };

  const gaugeAngle = (score / 1000) * 180;

  return (
    <div className="relative min-h-screen">
      <div className="bg-money-dark fixed inset-0" />
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="money-title text-4xl md:text-5xl text-foreground">
            Your Financial Command Center
          </h1>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="money-card money-card-premium text-center mb-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Welcome to SutraFi
          </h3>
          <p className="text-foreground text-base">
            <strong>Your all-in-one financial planning platform</strong> - Track credit, plan investments, and secure your future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Health Score Gauge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="money-card"
          >
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              6-Dimension Health Score
            </h3>
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 200 120" className="w-full max-w-xs">
                {/* Background arc */}
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="16" strokeLinecap="round" />
                {/* Red zone */}
                <path d="M 20 100 A 80 80 0 0 1 84 22" fill="none" stroke="hsl(0 84% 60% / 0.4)" strokeWidth="16" strokeLinecap="round" />
                {/* Yellow zone */}
                <path d="M 84 22 A 80 80 0 0 1 140 30" fill="none" stroke="hsl(45 100% 60% / 0.4)" strokeWidth="16" strokeLinecap="round" />
                {/* Green zone */}
                <path d="M 140 30 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(150 60% 40% / 0.4)" strokeWidth="16" strokeLinecap="round" />
                {/* Needle */}
                <line
                  x1="100" y1="100"
                  x2={100 + 65 * Math.cos(Math.PI - (gaugeAngle * Math.PI) / 180)}
                  y2={100 - 65 * Math.sin(Math.PI - (gaugeAngle * Math.PI) / 180)}
                  stroke="hsl(var(--money-green))" strokeWidth="3" strokeLinecap="round"
                />
                <circle cx="100" cy="100" r="5" fill="hsl(var(--money-green))" />
                <text x="100" y="90" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="28" fontWeight="bold" fontFamily="var(--font-display)">
                  {score}
                </text>
                <text x="100" y="115" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="var(--font-body)">
                  WEALTH INDEX
                </text>
              </svg>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="money-card"
          >
            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-500" />
              Quick Overview
            </h3>
            <p className="text-muted-foreground text-sm mb-3">Your financial snapshot at a glance.</p>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-500" /> Credit Health</span>
                <span className="font-bold text-emerald-500">Excellent</span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> Fraud Protection</span>
                <span className="font-bold text-blue-500">Active</span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="flex items-center gap-2"><Target className="w-4 h-4 text-amber-500" /> Goals Progress</span>
                <span className="font-bold text-amber-500">42%</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="money-card mb-8"
        >
          <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            AI-Powered Actions
          </h3>
          <p className="text-foreground mb-4">
            Take advantage of our advanced AI features to optimize your financial health.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Bank Connect", icon: Wallet, path: "/bank-connect", color: "text-emerald-500" },
              { label: "Credit Simulator", icon: TrendingUp, path: "/credit-simulator", color: "text-blue-500" },
              { label: "Fraud Alert", icon: Shield, path: "/fraud-alert", color: "text-purple-500" },
              { label: "AI Advisor", icon: Sparkles, path: "/ai-advisor", color: "text-amber-500" },
            ].map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 border border-border hover:border-emerald-500 transition-all group"
              >
                <action.icon className={`w-8 h-8 ${action.color}`} />
                <span className="text-sm font-medium text-foreground group-hover:text-emerald-500">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tax Estimator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="money-card mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Quick Tax Estimator
            </h3>
            <button onClick={() => setShowTax(!showTax)} className="text-sm text-emerald-500 hover:underline">
              {showTax ? "Collapse" : "Expand"}
            </button>
          </div>
          {showTax && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Annual Income (₹)</label>
                  <input
                    type="number"
                    value={taxIncome}
                    onChange={(e) => setTaxIncome(e.target.value)}
                    placeholder="e.g. 1200000"
                    className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-xl text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Deductions (₹)</label>
                  <input
                    type="number"
                    value={taxDed}
                    onChange={(e) => setTaxDed(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full mt-1 px-4 py-2 bg-secondary border border-border rounded-xl text-foreground"
                  />
                </div>
              </div>
              <button onClick={handleTaxCalc} className="money-button">
                Calculate Tax
              </button>
              {taxResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">Old Regime</p>
                    <p className="text-2xl font-bold text-foreground">₹{taxResult.oldRegimeTax.toLocaleString()}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">New Regime</p>
                    <p className="text-2xl font-bold text-foreground">₹{taxResult.newRegimeTax.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-500/20 rounded-xl p-4 text-center border border-emerald-500/30">
                    <p className="text-sm text-muted-foreground">Recommended</p>
                    <p className="text-2xl font-bold text-emerald-500">{taxResult.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Navigation Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="money-title text-3xl text-center text-foreground mb-6">Explore Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Galaxy Map", path: "/galaxy", icon: "🌌" },
              { label: "Arcade", path: "/arcade", icon: "🕹️" },
              { label: "Knowledge", path: "/knowledge", icon: "📚" },
              { label: "Books", path: "/books", icon: "📖" },
            ].map((nav) => (
              <motion.button
                key={nav.path}
                onClick={() => navigate(nav.path)}
                className="px-4 py-4 bg-secondary text-foreground font-semibold rounded-xl border border-border hover:border-emerald-500 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="block text-2xl mb-1">{nav.icon}</span>
                {nav.label}
              </motion.button>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={() => { completeDailyTask(); }}
              className="px-6 py-3 bg-secondary text-foreground font-semibold rounded-xl border border-border hover:border-emerald-500 transition-all flex items-center gap-2"
              whileTap={{ scale: 0.97 }}
            >
              <CheckCircle className="w-4 h-4" />
              Complete Task
            </motion.button>
            <motion.button
              onClick={() => { incrementStreak(); }}
              className="px-6 py-3 bg-secondary text-foreground font-semibold rounded-xl border border-border hover:border-amber-500 transition-all flex items-center gap-2"
              whileTap={{ scale: 0.97 }}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              Add Streak
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
