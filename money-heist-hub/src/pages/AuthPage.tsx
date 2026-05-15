import { motion } from "framer-motion";
import { CivicAuthProvider, UserButton, useUser } from "@civic/auth/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Building2, Users, ArrowRight, Shield, Wallet, BarChart3, TrendingUp } from "lucide-react";
import { loadUserData, saveUserData, type UserRole } from "@/lib/auth";

const CLIENT_ID = "033dab32-dc69-4b66-a676-341ad4e0d8ea";

function AuthContent() {
  const { user, signIn, signOut, isLoading } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (user) {
      const data = loadUserData();
      if (data.userRole && data.userRole !== "unselected") {
        navigate(data.userRole === "borrower" ? "/borrower-dashboard" : "/lender-dashboard");
      }
    }
  }, [user, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const data = loadUserData();
    data.userRole = role;
    data.isLoggedIn = true;
    data.email = user?.email || "user@civic.com";
    data.user = {
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || ""
    };
    saveUserData(data);
    navigate(role === "borrower" ? "/borrower-dashboard" : "/lender-dashboard");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-[0.08]"
              initial={{ y: "110vh", x: `${5 + (i * 8) % 90}vw` }}
              animate={{ y: "-10vh", rotate: [0, 180, 360] }}
              transition={{ duration: 15 + (i % 5) * 3, repeat: Infinity, delay: i * 1.5, ease: "linear" }}
            >
              {["$", "€", "£", "¥", "₹", "💵", "💰"][i % 7]}
            </motion.div>
          ))}
          <motion.div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-yellow-400 mb-4">
            SUTRAFI
          </h1>
          <p className="text-lg text-emerald-300/80 mb-2 tracking-widest uppercase">Credit Intelligence</p>
          <p className="text-sm text-slate-400 max-w-md mx-auto">AI-Powered Credit Scoring & Lending Platform</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 money-card p-8 max-w-md w-full mx-4"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="text-foreground font-semibold">Secure Authentication</span>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-3"
            >
              <Wallet className="w-5 h-5" />
              Sign In with Civic Auth
            </button>
          )}
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Powered by Civic Auth • Secure & Decentralized
          </p>
        </motion.div>

        <div className="absolute bottom-8 flex gap-4 text-3xl opacity-30">
          {["🏦", "💰", "📈", "💎"].map((emoji, i) => (
            <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}>
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          {user.picture ? (
            <img src={user.picture} alt={user.name || ""} className="w-16 h-16 rounded-full border-2 border-emerald-500" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-400">{user.name?.[0] || "U"}</span>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-foreground">Welcome, {user.name || "User"}!</h2>
        <p className="text-muted-foreground">{user.email}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl w-full mx-4"
      >
        <h3 className="text-xl font-bold text-foreground text-center mb-6">Choose Your Path</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            onClick={() => handleRoleSelect("borrower")}
            className="money-card p-6 cursor-pointer group hover:border-emerald-500/50 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-lg font-bold text-foreground mb-2">I'm a Borrower</h4>
            <p className="text-sm text-muted-foreground mb-4">Access AI-powered credit scoring, loan simulations, and financial planning tools.</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="w-4 h-4 text-blue-500" /> Credit Score Analysis
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-blue-500" /> Affordability Simulator
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-blue-500" /> Risk Alerts
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-emerald-500 font-medium">
              Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          <motion.div
            onClick={() => handleRoleSelect("lender")}
            className="money-card p-6 cursor-pointer group hover:border-emerald-500/50 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-lg font-bold text-foreground mb-2">I'm a Lender</h4>
            <p className="text-sm text-muted-foreground mb-4">Evaluate borrowers, get AI interest rate recommendations, and manage risk.</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-purple-500" /> Borrower Evaluation
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-purple-500" /> Rate Recommendations
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="w-4 h-4 text-purple-500" /> Risk Filtering
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-emerald-500 font-medium">
              Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>

        <button
          onClick={signOut}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <CivicAuthProvider clientId={CLIENT_ID}>
      <AuthContent />
    </CivicAuthProvider>
  );
}