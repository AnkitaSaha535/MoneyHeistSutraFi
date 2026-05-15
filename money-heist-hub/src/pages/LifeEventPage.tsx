import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";

interface LifeEvent {
  id: string; emoji: string; title: string; description: string;
  fields: { key: string; label: string; placeholder: string; type: string }[];
  getAdvice: (data: Record<string, string>) => string[];
}

const LIFE_EVENTS: LifeEvent[] = [
  {
    id: "bonus", emoji: "💰", title: "Got a Bonus / Windfall", description: "Optimize your bonus for maximum impact",
    fields: [
      { key: "amount", label: "Bonus Amount (₹)", placeholder: "200000", type: "number" },
      { key: "taxBracket", label: "Tax Bracket (%)", placeholder: "30", type: "number" },
      { key: "existingDebt", label: "Existing Debt (₹)", placeholder: "0", type: "number" },
      { key: "emergencyMonths", label: "Emergency Fund (months covered)", placeholder: "3", type: "number" },
    ],
    getAdvice: (d) => {
      const amt = Number(d.amount) || 0;
      const tax = Number(d.taxBracket) || 30;
      const debt = Number(d.existingDebt) || 0;
      const emMonths = Number(d.emergencyMonths) || 0;
      const afterTax = amt * (1 - tax / 100);
      const tips: string[] = [];
      tips.push(`After-tax bonus: ₹${Math.round(afterTax).toLocaleString()}`);
      if (debt > 0) tips.push(`🔴 Priority 1: Pay off ₹${debt.toLocaleString()} high-interest debt first — saves more than any investment.`);
      if (emMonths < 6) tips.push(`🟡 Priority ${debt > 0 ? 2 : 1}: Build emergency fund to 6 months. You need ${6 - emMonths} more months covered.`);
      tips.push(`🟢 Invest ${debt > 0 || emMonths < 6 ? "remaining" : "70%"} in index funds via lump sum + STP strategy for tax efficiency.`);
      tips.push(`💡 Consider investing ₹${Math.min(Math.round(afterTax * 0.1), 50000).toLocaleString()} in NPS for additional 80CCD(1B) deduction.`);
      if (afterTax > 100000) tips.push(`📊 Split: 60% equity MFs, 25% debt funds, 15% gold/liquid for optimal risk-adjusted returns.`);
      return tips;
    },
  },
  {
    id: "marriage", emoji: "💒", title: "Getting Married", description: "Plan finances as a couple",
    fields: [
      { key: "budget", label: "Wedding Budget (₹)", placeholder: "1500000", type: "number" },
      { key: "income1", label: "Your Monthly Income (₹)", placeholder: "60000", type: "number" },
      { key: "income2", label: "Partner's Monthly Income (₹)", placeholder: "50000", type: "number" },
      { key: "savings", label: "Combined Savings (₹)", placeholder: "500000", type: "number" },
    ],
    getAdvice: (d) => {
      const budget = Number(d.budget) || 0;
      const inc1 = Number(d.income1) || 0;
      const inc2 = Number(d.income2) || 0;
      const savings = Number(d.savings) || 0;
      const combined = inc1 + inc2;
      const tips: string[] = [];
      tips.push(`Combined monthly income: ₹${combined.toLocaleString()}`);
      if (budget > savings) tips.push(`⚠️ Wedding costs ₹${(budget - savings).toLocaleString()} more than savings. Start a short-term SIP in liquid/ultra-short funds.`);
      tips.push(`🏠 Both should claim HRA separately — saves up to ₹${Math.round(Math.min(inc1, inc2) * 0.4 * 12).toLocaleString()}/yr in taxes.`);
      tips.push(`💑 Open a joint account for shared expenses (40-50% of combined income), keep individual accounts for personal spending.`);
      tips.push(`🛡️ Get individual term insurance: ₹${Math.round(inc1 * 120).toLocaleString()} for you, ₹${Math.round(inc2 * 120).toLocaleString()} for partner.`);
      tips.push(`📊 Optimize NPS: Both contribute ₹50,000 each for 80CCD(1B) — total tax saving of ₹52,000/yr (30% bracket).`);
      return tips;
    },
  },
  {
    id: "baby", emoji: "👶", title: "New Baby", description: "Plan for your child's future",
    fields: [
      { key: "monthlyIncome", label: "Household Monthly Income (₹)", placeholder: "100000", type: "number" },
      { key: "existingSavings", label: "Existing Savings (₹)", placeholder: "800000", type: "number" },
      { key: "educationGoal", label: "Target Education Fund (₹)", placeholder: "5000000", type: "number" },
    ],
    getAdvice: (d) => {
      const income = Number(d.monthlyIncome) || 0;
      const savings = Number(d.existingSavings) || 0;
      const eduGoal = Number(d.educationGoal) || 5000000;
      const sipForEdu = Math.round(eduGoal / ((Math.pow(1.01, 216) - 1) / 0.01 * 1.01));
      const tips: string[] = [];
      tips.push(`📚 To build ₹${eduGoal.toLocaleString()} education fund in 18 years, start SIP of ₹${sipForEdu.toLocaleString()}/mo @12% returns.`);
      tips.push(`🛡️ Immediately get: Term insurance ≥ ₹1 Cr, Health insurance ≥ ₹10L with maternity + newborn cover.`);
      tips.push(`🏦 Open a Sukanya Samriddhi (girl) or PPF account for the child — ₹1.5L/yr tax-free at 7.1%.`);
      tips.push(`💰 Increase emergency fund to 9 months of expenses (from 6) — babies are expensive!`);
      tips.push(`📊 Don't buy child ULIPs/endowment plans — SIP in index funds gives 3-4x better returns over 18 years.`);
      tips.push(`💡 Budget extra ₹${Math.round(income * 0.15).toLocaleString()}/mo for childcare, diapers, health — typically 15% of income.`);
      return tips;
    },
  },
  {
    id: "inheritance", emoji: "🏛️", title: "Received Inheritance", description: "Manage inherited wealth wisely",
    fields: [
      { key: "amount", label: "Inheritance Amount (₹)", placeholder: "2000000", type: "number" },
      { key: "type", label: "Type (cash/property/gold)", placeholder: "cash", type: "text" },
      { key: "monthlyIncome", label: "Your Monthly Income (₹)", placeholder: "60000", type: "number" },
    ],
    getAdvice: (d) => {
      const amt = Number(d.amount) || 0;
      const income = Number(d.monthlyIncome) || 0;
      const tips: string[] = [];
      tips.push(`🎯 Inheritance of ₹${amt.toLocaleString()} — don't rush! Park in liquid fund for 3-6 months while you plan.`);
      tips.push(`📋 No inheritance tax in India currently, but capital gains on sale of inherited assets are taxable.`);
      if (d.type?.toLowerCase().includes("property")) tips.push(`🏠 Property: Consider rental yield vs selling + investing. If yield < 3%, selling & investing in MFs may be better.`);
      tips.push(`📊 Deploy via STP (Systematic Transfer Plan): Move from liquid fund to equity over 6-12 months to average out market risk.`);
      tips.push(`💰 Allocate: 30% long-term equity, 30% debt/FD, 20% emergency buffer, 20% for life goals.`);
      if (amt > 2000000) tips.push(`🧾 Consider consulting a fee-only financial advisor (₹5-10K one-time) for amounts this large.`);
      return tips;
    },
  },
];

export default function LifeEventPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [advice, setAdvice] = useState<string[]>([]);

  const event = LIFE_EVENTS.find((e) => e.id === selectedEvent);

  const handleCalculate = () => {
    if (!event) return;
    setAdvice(event.getAdvice(formData));
  };

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="knowledge" />
      <div className="relative z-10 p-4 md:p-8 max-w-5xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2">
          🎯 LIFE EVENT ADVISOR
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8 heist-mono">AI-Powered Financial Advice for Life's Big Moments</p>

        {!selectedEvent ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LIFE_EVENTS.map((ev, i) => (
              <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="heist-card cursor-pointer" onClick={() => { setSelectedEvent(ev.id); setFormData({}); setAdvice([]); }}>
                <span className="text-4xl">{ev.emoji}</span>
                <h3 className="text-xl font-bold text-foreground mt-2">{ev.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => { setSelectedEvent(null); setAdvice([]); }} className="mb-4 px-4 py-2 bg-secondary text-foreground rounded heist-mono border border-border hover:border-primary">
              ← BACK TO EVENTS
            </button>
            <div className="heist-card mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{event!.emoji}</span>
                <h2 className="text-2xl font-bold text-foreground">{event!.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {event!.fields.map((f) => (
                  <div key={f.key}>
                    <label className="text-sm text-muted-foreground heist-mono block mb-1">{f.label}</label>
                    <input type={f.type} value={formData[f.key] || ""} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      placeholder={f.placeholder} className="w-full px-4 py-2 bg-secondary border border-border rounded text-foreground focus:border-primary focus:outline-none" />
                  </div>
                ))}
              </div>
              <button onClick={handleCalculate} className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded heist-mono">
                GET PERSONALIZED ADVICE
              </button>
            </div>

            <AnimatePresence>
              {advice.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <h3 className="heist-title text-2xl text-foreground">📋 YOUR ACTION PLAN</h3>
                  {advice.map((tip, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                      className="heist-card border-l-4 border-l-primary">
                      <p className="text-foreground">{tip}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
