import { useState } from "react";
import { motion } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";
import { calculateFIRE, calculateSIP } from "@/data/engine";

interface FIREInputs {
  age: string;
  retireAge: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  existingInvestments: string;
  expectedReturn: string;
  inflationRate: string;
}

interface MonthlyPlan {
  month: number;
  sipAmount: number;
  cumulativeInvested: number;
  projectedValue: number;
  milestone: string;
}

export default function FIREPlannerPage() {
  const [inputs, setInputs] = useState<FIREInputs>({
    age: "", retireAge: "", monthlyIncome: "", monthlyExpenses: "",
    existingInvestments: "", expectedReturn: "12", inflationRate: "6",
  });
  const [result, setResult] = useState<any>(null);
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlan[]>([]);

  const update = (key: keyof FIREInputs, val: string) => setInputs((p) => ({ ...p, [key]: val }));

  const calculate = () => {
    const age = Number(inputs.age);
    const retireAge = Number(inputs.retireAge);
    const income = Number(inputs.monthlyIncome);
    const expenses = Number(inputs.monthlyExpenses);
    const existing = Number(inputs.existingInvestments);
    const ret = Number(inputs.expectedReturn);
    const inf = Number(inputs.inflationRate);
    if (!age || !retireAge || !income || !expenses) return;

    const yearsToRetire = retireAge - age;
    const fire = calculateFIRE(expenses * 12, inf, yearsToRetire);
    const gap = fire.targetFireCorpus - existing;
    const monthlyRate = ret / 100 / 12;
    const months = yearsToRetire * 12;
    const requiredSIP = gap > 0 ? gap * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1) / (1 + monthlyRate) : 0;

    const savingsRate = ((income - expenses) / income) * 100;
    const emergencyFund = expenses * 6;
    const insuranceCover = income * 12 * 10;

    // Build monthly plan (show first 12 months + yearly checkpoints)
    const plan: MonthlyPlan[] = [];
    for (let m = 1; m <= Math.min(months, 60); m++) {
      if (m <= 12 || m % 12 === 0) {
        const cumInvested = Math.round(requiredSIP) * m + existing;
        const projected = existing * Math.pow(1 + ret / 100 / 12, m) +
          Math.round(requiredSIP) * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
        let milestone = "";
        if (m === 1) milestone = "🚀 Journey begins";
        else if (m === 6) milestone = "📊 First review";
        else if (m === 12) milestone = "🎯 Year 1 complete";
        else if (m % 12 === 0) milestone = `📅 Year ${m / 12} checkpoint`;
        plan.push({ month: m, sipAmount: Math.round(requiredSIP), cumulativeInvested: Math.round(cumInvested), projectedValue: Math.round(projected), milestone });
      }
    }

    setMonthlyPlan(plan);
    setResult({
      ...fire, requiredSIP: Math.round(requiredSIP), yearsToRetire, savingsRate: savingsRate.toFixed(1),
      emergencyFund, insuranceCover, gap: Math.round(gap), existing,
      assetAllocation: {
        equity: age < 35 ? 70 : age < 45 ? 60 : 50,
        debt: age < 35 ? 20 : age < 45 ? 30 : 35,
        gold: 10, emergency: age < 35 ? 0 : age < 45 ? 0 : 5,
      },
      taxSaving: Math.min(Math.round(requiredSIP * 12), 150000),
    });
  };

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="galaxy" />
      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2">
          🔥 FIRE PATH PLANNER
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8 heist-mono">Financial Independence, Retire Early — Your Month-by-Month Roadmap</p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">📋 Your Financial Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {([
              ["age", "Current Age", "28"], ["retireAge", "Target Retire Age", "45"],
              ["monthlyIncome", "Monthly Income (₹)", "80000"], ["monthlyExpenses", "Monthly Expenses (₹)", "35000"],
              ["existingInvestments", "Existing Investments (₹)", "500000"], ["expectedReturn", "Expected Return (%)", "12"],
              ["inflationRate", "Inflation Rate (%)", "6"],
            ] as [keyof FIREInputs, string, string][]).map(([key, label, ph]) => (
              <div key={key}>
                <label className="text-sm text-muted-foreground heist-mono block mb-1">{label}</label>
                <input type="number" value={inputs[key]} onChange={(e) => update(key, e.target.value)} placeholder={ph}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded text-foreground focus:border-primary focus:outline-none" />
              </div>
            ))}
          </div>
          <button onClick={calculate} className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded heist-mono">
            GENERATE FIRE ROADMAP
          </button>
        </motion.div>

        {result && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                ["🎯 FIRE Corpus", `₹${result.targetFireCorpus.toLocaleString()}`],
                ["💰 Required SIP", `₹${result.requiredSIP.toLocaleString()}/mo`],
                ["⏳ Years to FIRE", `${result.yearsToRetire} years`],
                ["📊 Savings Rate", `${result.savingsRate}%`],
              ].map(([label, value], i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="heist-card text-center">
                  <p className="text-xs text-muted-foreground heist-mono">{label}</p>
                  <p className="text-xl font-bold text-primary mt-1">{value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="heist-card">
                <h3 className="text-lg font-bold text-foreground mb-3">📊 Asset Allocation Strategy</h3>
                <div className="space-y-3">
                  {[
                    ["Equity (Index + Flexi)", result.assetAllocation.equity, "bg-primary"],
                    ["Debt (PPF + Bonds)", result.assetAllocation.debt, "bg-heist-cyan"],
                    ["Gold (SGB + Gold ETF)", result.assetAllocation.gold, "bg-heist-gold"],
                  ].map(([label, pct, color], i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{label as string}</span>
                        <span className="text-primary font-bold">{pct as number}%</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <motion.div className={`h-full ${color as string} rounded-full`} initial={{ width: 0 }} animate={{ width: `${pct as number}%` }} transition={{ duration: 1 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="heist-card">
                <h3 className="text-lg font-bold text-foreground mb-3">🛡️ Safety Net Checklist</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-secondary rounded">
                    <span className="text-foreground">Emergency Fund (6 months)</span>
                    <span className="text-primary font-bold">₹{result.emergencyFund.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-secondary rounded">
                    <span className="text-foreground">Term Insurance Cover</span>
                    <span className="text-primary font-bold">₹{result.insuranceCover.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-secondary rounded">
                    <span className="text-foreground">Health Insurance</span>
                    <span className="text-heist-gold font-bold">₹10-15 Lakh recommended</span>
                  </div>
                  <div className="flex justify-between p-3 bg-secondary rounded">
                    <span className="text-foreground">Tax Saving (80C)</span>
                    <span className="text-heist-cyan font-bold">₹{result.taxSaving.toLocaleString()}/yr</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card">
              <h3 className="text-xl font-bold text-foreground mb-4">📅 Month-by-Month Roadmap</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground heist-mono">
                      <th className="py-2 text-left">Month</th>
                      <th className="py-2 text-right">SIP/mo</th>
                      <th className="py-2 text-right">Total Invested</th>
                      <th className="py-2 text-right">Projected Value</th>
                      <th className="py-2 text-left">Milestone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyPlan.map((row, i) => (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="border-b border-border/50 hover:bg-secondary/50">
                        <td className="py-2 text-foreground">{row.month}</td>
                        <td className="py-2 text-right text-foreground">₹{row.sipAmount.toLocaleString()}</td>
                        <td className="py-2 text-right text-foreground">₹{row.cumulativeInvested.toLocaleString()}</td>
                        <td className="py-2 text-right text-primary font-bold">₹{row.projectedValue.toLocaleString()}</td>
                        <td className="py-2 text-heist-gold">{row.milestone}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
