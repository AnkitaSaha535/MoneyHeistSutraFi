import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Building2, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart, 
  ArrowRight, 
  Shield, 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Link,
  Unlink
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "credit" | "debit";
}

interface BankAccount {
  id: string;
  name: string;
  type: "savings" | "current" | "credit";
  balance: number;
  connected: boolean;
  lastSync: string;
}

const mockTransactions: Transaction[] = [
  { id: "1", date: "2024-01-15", description: "Salary Deposit", amount: 85000, category: "Income", type: "credit" },
  { id: "2", date: "2024-01-14", description: "Amazon Purchase", amount: 2499, category: "Shopping", type: "debit" },
  { id: "3", date: "2024-01-13", description: "Swiggy Order", amount: 450, category: "Food", type: "debit" },
  { id: "4", date: "2024-01-12", description: "Electricity Bill", amount: 1200, category: "Utilities", type: "debit" },
  { id: "5", date: "2024-01-11", description: "Freelance Payment", amount: 15000, category: "Income", type: "credit" },
  { id: "6", date: "2024-01-10", description: "Gym Membership", amount: 1500, category: "Health", type: "debit" },
  { id: "7", date: "2024-01-09", description: "Netflix Subscription", amount: 499, category: "Entertainment", type: "debit" },
  { id: "8", date: "2024-01-08", description: "Petrol Fill", amount: 800, category: "Transport", type: "debit" },
];

const mockBanks: BankAccount[] = [
  { id: "1", name: "HDFC Bank - Savings", type: "savings", balance: 245000, connected: true, lastSync: "2 mins ago" },
  { id: "2", name: "SBI - Salary Account", type: "savings", balance: 89000, connected: true, lastSync: "5 mins ago" },
  { id: "3", name: "ICICI Credit Card", type: "credit", balance: -12450, connected: true, lastSync: "10 mins ago" },
];

const spendingCategories = [
  { name: "Shopping", amount: 24500, color: "bg-emerald-500", percentage: 28 },
  { name: "Food & Dining", amount: 18200, color: "bg-amber-500", percentage: 21 },
  { name: "Utilities", amount: 15600, color: "bg-blue-500", percentage: 18 },
  { name: "Transport", amount: 12800, color: "bg-purple-500", percentage: 15 },
  { name: "Entertainment", amount: 8900, color: "bg-pink-500", percentage: 10 },
  { name: "Others", amount: 8000, color: "bg-gray-500", percentage: 8 },
];

export default function BankConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedBanks, setConnectedBanks] = useState(mockBanks);
  const [activeTab, setActiveTab] = useState<"transactions" | "analytics" | "accounts">("transactions");

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setConnectedBanks([
        ...connectedBanks,
        { id: "4", name: "Axis Bank", type: "savings" as const, balance: 50000, connected: true, lastSync: "Just now" }
      ]);
    }, 2000);
  };

  const handleDisconnect = (bankId: string) => {
    setConnectedBanks(connectedBanks.filter(b => b.id !== bankId));
  };

  const totalBalance = connectedBanks.reduce((sum, bank) => sum + bank.balance, 0);
  const totalIncome = mockTransactions.filter(t => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = mockTransactions.filter(t => t.type === "debit").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="relative min-h-screen">
      <div className="bg-money-dark fixed inset-0" />
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="money-title text-4xl md:text-5xl mb-2">Bank Connect</h1>
          <p className="text-muted-foreground text-lg">Real-time banking integration powered by open banking APIs</p>
        </motion.div>

        {/* Live Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="money-card mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Live Creditworthiness Tracking</p>
              <p className="text-sm text-muted-foreground">Connected to 3 accounts • Last sync: Just now</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-500">Live</span>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="money-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-muted-foreground text-sm">Total Balance</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{totalBalance.toLocaleString()}</p>
            <p className="text-xs text-emerald-500 mt-1">+2.4% this month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="money-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-muted-foreground text-sm">Income</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{totalIncome.toLocaleString()}</p>
            <p className="text-xs text-emerald-500 mt-1">Last 30 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="money-card"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-muted-foreground text-sm">Expenses</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{totalExpense.toLocaleString()}</p>
            <p className="text-xs text-amber-500 mt-1">Last 30 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="money-card money-card-gold"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-muted-foreground text-sm">Cash Flow</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{(totalIncome - totalExpense).toLocaleString()}</p>
            <p className="text-xs text-emerald-500 mt-1">Positive flow</p>
          </motion.div>
        </div>

        {/* Connected Banks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="money-card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              Connected Accounts
            </h2>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="money-button flex items-center gap-2"
            >
              {isConnecting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Link className="w-4 h-4" />
              )}
              {isConnecting ? "Connecting..." : "Connect Bank"}
            </button>
          </div>

          <div className="space-y-3">
            {connectedBanks.map((bank) => (
              <div
                key={bank.id}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{bank.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {bank.type === "credit" ? "Credit Card" : "Savings"} • {bank.lastSync}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-lg font-bold ${bank.balance < 0 ? "text-amber-500" : "text-foreground"}`}>
                    ₹{Math.abs(bank.balance).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDisconnect(bank.id)}
                    className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["transactions", "analytics", "accounts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="money-card"
          >
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "credit" ? "bg-emerald-500/20" : "bg-amber-500/20"
                    }`}>
                      {tx.type === "credit" ? (
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${
                    tx.type === "credit" ? "text-emerald-500" : "text-foreground"
                  }`}>
                    {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="money-card"
          >
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-500" />
              Spending Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-4">Category Breakdown</p>
                <div className="space-y-4">
                  {spendingCategories.map((cat) => (
                    <div key={cat.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-foreground text-sm">{cat.name}</span>
                        <span className="text-muted-foreground text-sm">₹{cat.amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="graph-bg rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">Cash Flow Trend</p>
                <div className="flex items-end justify-between h-40">
                  {[65, 80, 45, 90, 70, 55, 85].map((height, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Accounts Tab */}
        {activeTab === "accounts" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="money-card"
          >
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              Account Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {connectedBanks.map((bank) => (
                <div
                  key={bank.id}
                  className="p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{bank.type}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xl font-bold text-foreground mb-1">₹{bank.balance.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{bank.lastSync}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Credit Score Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="money-card mt-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">785</span>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">Live Credit Score</p>
                <p className="text-sm text-emerald-500">Excellent • Updated just now</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Score changed</p>
              <p className="text-lg font-bold text-emerald-500">+12 points</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}