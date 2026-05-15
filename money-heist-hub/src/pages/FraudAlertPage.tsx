import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Lock,
  Bell,
  Activity,
  Zap,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  RefreshCw
} from "lucide-react";

interface Alert {
  id: string;
  type: "high" | "medium" | "low";
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  status: "active" | "investigating" | "resolved";
  category: "transaction" | "behavior" | "account" | "credit";
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "high",
    title: "Unusual Large Transaction",
    description: "Transaction of ₹45,000 at Electronics Store detected. 340% above your normal spending.",
    amount: 45000,
    timestamp: "2 hours ago",
    status: "active",
    category: "transaction",
  },
  {
    id: "2",
    type: "medium",
    title: "Multiple Login Attempts",
    description: "5 failed login attempts from unknown device in Mumbai region.",
    timestamp: "5 hours ago",
    status: "investigating",
    category: "account",
  },
  {
    id: "3",
    type: "low",
    title: "Spending Pattern Change",
    description: "Unusual dining expenses detected on weekdays. 2x normal weekday spending.",
    amount: 3200,
    timestamp: "1 day ago",
    status: "resolved",
    category: "behavior",
  },
  {
    id: "4",
    type: "medium",
    title: "New Merchant Added",
    description: "New recurring payment subscription added to HDFC Credit Card.",
    amount: 599,
    timestamp: "2 days ago",
    status: "resolved",
    category: "transaction",
  },
  {
    id: "5",
    type: "high",
    title: "Credit Limit Change Request",
    description: "Request to increase credit limit detected. Please verify if authorized.",
    amount: 250000,
    timestamp: "3 days ago",
    status: "active",
    category: "credit",
  },
];

const riskMetrics = [
  { label: "Fraud Risk Score", value: 12, max: 100, status: "low", color: "bg-emerald-500" },
  { label: "Transaction Anomaly", value: 8, max: 100, status: "low", color: "bg-emerald-500" },
  { label: "Behavioral Deviation", value: 34, max: 100, status: "medium", color: "bg-amber-500" },
  { label: "Account Security", value: 92, max: 100, status: "high", color: "bg-emerald-500" },
];

const recentActivity = [
  { time: "10:30 AM", event: "Login from Mumbai, Maharashtra", status: "success" },
  { time: "11:45 AM", event: "Purchase at Apple Store - ₹45,000", status: "review" },
  { time: "12:15 PM", event: "Bill Payment - Electricity", status: "success" },
  { time: "02:30 PM", event: "Failed Login Attempt", status: "blocked" },
  { time: "03:00 PM", event: "Login from Mumbai, Maharashtra", status: "success" },
];

export default function FraudAlertPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [activeTab, setActiveTab] = useState<"alerts" | "activity" | "settings">("alerts");
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "high":
        return "text-red-500 bg-red-500/20";
      case "medium":
        return "text-amber-500 bg-amber-500/20";
      case "low":
        return "text-emerald-500 bg-emerald-500/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "investigating":
        return <Eye className="w-4 h-4 text-amber-500" />;
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return null;
    }
  };

  const filteredAlerts = filter === "all" ? alerts : alerts.filter(a => a.type === filter);

  return (
    <div className="relative min-h-screen">
      <div className="bg-money-dark fixed inset-0" />
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="money-title text-4xl md:text-5xl mb-2">Fraud & Risk Alert</h1>
          <p className="text-muted-foreground text-lg">AI-powered anomaly detection and security monitoring</p>
        </motion.div>

        {/* Security Score Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="money-card mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex flex-col items-center justify-center money-glow-green">
                <span className="text-2xl font-bold text-white">88</span>
                <span className="text-xs text-white/80">SECURE</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-2">Your Security Score</p>
                <div className="flex gap-4">
                  {riskMetrics.map((metric) => (
                    <div key={metric.label} className="text-center">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-1">
                        <span className={`text-sm font-bold ${metric.status === "low" ? "text-emerald-500" : metric.status === "medium" ? "text-amber-500" : "text-red-500"}`}>
                          {metric.value}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{metric.label.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors">
                <RefreshCw className="w-5 h-5 text-emerald-500" />
              </button>
              <button className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                <Bell className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["alerts", "activity", "settings"] as const).map((tab) => (
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

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <>
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter:</span>
              </div>
              {(["all", "high", "medium", "low"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    filter === f
                      ? f === "high" ? "bg-red-500 text-white" : f === "medium" ? "bg-amber-500 text-white" : f === "low" ? "bg-emerald-500 text-white" : "bg-emerald-500 text-white"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="money-card"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(alert.type)}`}>
                        {alert.type === "high" ? (
                          <AlertTriangle className="w-6 h-6" />
                        ) : alert.type === "medium" ? (
                          <Activity className="w-6 h-6" />
                        ) : (
                          <Shield className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-foreground">{alert.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(alert.type)}`}>
                            {alert.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {alert.amount && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ₹{alert.amount.toLocaleString()}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {alert.timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(alert.status)}
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {alert.status === "active" && (
                      <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 font-medium hover:bg-red-500/30 transition-colors">
                        Review
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="money-card"
          >
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Recent Account Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.status === "success" ? "bg-emerald-500/20" : activity.status === "review" ? "bg-amber-500/20" : "bg-red-500/20"
                    }`}>
                      {activity.status === "success" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : activity.status === "review" ? (
                        <Eye className="w-5 h-5 text-amber-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{activity.event}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === "success" ? "bg-emerald-500/20 text-emerald-500" : activity.status === "review" ? "bg-amber-500/20 text-amber-500" : "bg-red-500/20 text-red-500"
                  }`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="money-card"
          >
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Alert Settings
            </h3>
            <div className="space-y-4">
              {[
                { name: "Large Transaction Alerts", desc: "Notify for transactions above ₹10,000", enabled: true },
                { name: "Login Alerts", desc: "Notify for new device logins", enabled: true },
                { name: "Spending Pattern Alerts", desc: "Notify for unusual spending behavior", enabled: false },
                { name: "Credit Limit Change Alerts", desc: "Notify for credit limit modifications", enabled: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
                  <div>
                    <p className="font-medium text-foreground">{setting.name}</p>
                    <p className="text-sm text-muted-foreground">{setting.desc}</p>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${
                      setting.enabled ? "bg-emerald-500" : "bg-secondary"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      setting.enabled ? "translate-x-6" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Protection Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="money-card mt-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">AI Protection Active</p>
                <p className="text-sm text-muted-foreground">Isolation Forest & Autoencoder detection running</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-500">
              <Lock className="w-4 h-4" />
              24/7 Monitoring
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}