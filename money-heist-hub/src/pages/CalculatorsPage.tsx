import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";
import { calculateSIP, calculateSimpleInterest, calculateCompoundInterest, calculateFIRE } from "@/data/engine";

type CalcType = "emi" | "ppf" | "lumpsum" | "fd" | "rd" | "inflation" | "sip" | "si" | "ci";

const CALCS: { id: CalcType; title: string; emoji: string }[] = [
  { id: "sip", title: "SIP Calculator", emoji: "📈" },
  { id: "emi", title: "EMI Calculator", emoji: "🏠" },
  { id: "ppf", title: "PPF Calculator", emoji: "🏦" },
  { id: "lumpsum", title: "Lumpsum Calculator", emoji: "💰" },
  { id: "fd", title: "FD Calculator", emoji: "🏧" },
  { id: "rd", title: "RD Calculator", emoji: "💵" },
  { id: "inflation", title: "Inflation Calculator", emoji: "📊" },
  { id: "si", title: "Simple Interest", emoji: "➕" },
  { id: "ci", title: "Compound Interest", emoji: "✖️" },
];

export default function CalculatorsPage() {
  const [active, setActive] = useState<CalcType | null>(null);

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="arcade" />
      <div className="relative z-10 p-4 md:p-8 max-w-5xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2">
          🧮 FINANCIAL CALCULATORS
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8 heist-mono">Every Calculator You Need for Smart Money Decisions</p>

        {!active ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CALCS.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="heist-card cursor-pointer text-center" onClick={() => setActive(c.id)}>
                <span className="text-4xl">{c.emoji}</span>
                <h3 className="text-lg font-bold text-foreground mt-2">{c.title}</h3>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setActive(null)} className="mb-4 px-4 py-2 bg-secondary text-foreground rounded heist-mono border border-border hover:border-primary">
              ← ALL CALCULATORS
            </button>
            <CalcRenderer type={active} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CalcRenderer({ type }: { type: CalcType }) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const set = (k: string, v: string) => setInputs((p) => ({ ...p, [k]: v }));

  const configs: Record<CalcType, { fields: [string, string, string][]; calc: () => any; results: (r: any) => [string, string][] }> = {
    sip: {
      fields: [["monthly", "Monthly SIP (₹)", "5000"], ["years", "Tenure (years)", "15"], ["rate", "Expected Return (%)", "12"]],
      calc: () => calculateSIP(Number(inputs.monthly), Number(inputs.years), Number(inputs.rate)),
      results: (r) => [["Invested", `₹${r.investedAmount.toLocaleString()}`], ["Returns", `₹${r.estimatedReturns.toLocaleString()}`], ["Total Value", `₹${r.totalValue.toLocaleString()}`]],
    },
    si: {
      fields: [["principal", "Principal (₹)", "100000"], ["rate", "Rate (%)", "8"], ["time", "Time (years)", "5"]],
      calc: () => calculateSimpleInterest(Number(inputs.principal), Number(inputs.rate), Number(inputs.time)),
      results: (r) => [["Principal", `₹${r.principal.toLocaleString()}`], ["Interest", `₹${r.interest.toLocaleString()}`], ["Total", `₹${r.total.toLocaleString()}`]],
    },
    ci: {
      fields: [["principal", "Principal (₹)", "100000"], ["rate", "Rate (%)", "12"], ["time", "Time (years)", "10"], ["n", "Compounding/yr", "12"]],
      calc: () => calculateCompoundInterest(Number(inputs.principal), Number(inputs.rate), Number(inputs.time), Number(inputs.n) || 12),
      results: (r) => [["Principal", `₹${r.principal.toLocaleString()}`], ["Interest", `₹${r.interest.toLocaleString()}`], ["Total", `₹${r.total.toLocaleString()}`]],
    },
    emi: {
      fields: [["principal", "Loan Amount (₹)", "5000000"], ["rate", "Interest Rate (%)", "8.5"], ["tenure", "Tenure (years)", "20"]],
      calc: () => {
        const p = Number(inputs.principal), r = Number(inputs.rate) / 100 / 12, n = Number(inputs.tenure) * 12;
        const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        return { emi: Math.round(emi), totalPayment: Math.round(emi * n), totalInterest: Math.round(emi * n - p) };
      },
      results: (r) => [["Monthly EMI", `₹${r.emi.toLocaleString()}`], ["Total Interest", `₹${r.totalInterest.toLocaleString()}`], ["Total Payment", `₹${r.totalPayment.toLocaleString()}`]],
    },
    ppf: {
      fields: [["yearly", "Yearly Investment (₹)", "150000"], ["years", "Tenure (years)", "15"], ["rate", "PPF Rate (%)", "7.1"]],
      calc: () => {
        const y = Number(inputs.yearly), n = Number(inputs.years), r = Number(inputs.rate) / 100;
        let total = 0;
        for (let i = 0; i < n; i++) total = (total + y) * (1 + r);
        return { invested: y * n, maturity: Math.round(total), interest: Math.round(total - y * n) };
      },
      results: (r) => [["Total Invested", `₹${r.invested.toLocaleString()}`], ["Interest Earned", `₹${r.interest.toLocaleString()}`], ["Maturity Value", `₹${r.maturity.toLocaleString()}`]],
    },
    lumpsum: {
      fields: [["amount", "Investment Amount (₹)", "500000"], ["years", "Tenure (years)", "10"], ["rate", "Expected Return (%)", "12"]],
      calc: () => {
        const a = Number(inputs.amount), n = Number(inputs.years), r = Number(inputs.rate) / 100;
        const fv = a * Math.pow(1 + r, n);
        return { invested: a, returns: Math.round(fv - a), total: Math.round(fv) };
      },
      results: (r) => [["Invested", `₹${r.invested.toLocaleString()}`], ["Returns", `₹${r.returns.toLocaleString()}`], ["Future Value", `₹${r.total.toLocaleString()}`]],
    },
    fd: {
      fields: [["amount", "Deposit Amount (₹)", "500000"], ["rate", "Interest Rate (%)", "7"], ["years", "Tenure (years)", "5"]],
      calc: () => calculateCompoundInterest(Number(inputs.amount), Number(inputs.rate), Number(inputs.years), 4),
      results: (r) => [["Principal", `₹${r.principal.toLocaleString()}`], ["Interest", `₹${r.interest.toLocaleString()}`], ["Maturity", `₹${r.total.toLocaleString()}`]],
    },
    rd: {
      fields: [["monthly", "Monthly Deposit (₹)", "10000"], ["rate", "Interest Rate (%)", "7"], ["years", "Tenure (years)", "5"]],
      calc: () => {
        const m = Number(inputs.monthly), r = Number(inputs.rate) / 100 / 4, n = Number(inputs.years) * 4;
        const maturity = m * ((Math.pow(1 + r, n) - 1) / (1 - Math.pow(1 + r, -1 / 3))) * 3;
        const invested = m * Number(inputs.years) * 12;
        return { invested, maturity: Math.round(maturity), interest: Math.round(maturity - invested) };
      },
      results: (r) => [["Total Deposited", `₹${r.invested.toLocaleString()}`], ["Interest", `₹${r.interest.toLocaleString()}`], ["Maturity", `₹${r.maturity.toLocaleString()}`]],
    },
    inflation: {
      fields: [["amount", "Current Cost (₹)", "100000"], ["rate", "Inflation Rate (%)", "6"], ["years", "After Years", "10"]],
      calc: () => {
        const a = Number(inputs.amount), r = Number(inputs.rate) / 100, n = Number(inputs.years);
        const future = a * Math.pow(1 + r, n);
        return { current: a, future: Math.round(future), increase: Math.round(future - a) };
      },
      results: (r) => [["Current Value", `₹${r.current.toLocaleString()}`], ["Future Cost", `₹${r.future.toLocaleString()}`], ["Increase", `₹${r.increase.toLocaleString()}`]],
    },
  };

  const config = configs[type];

  return (
    <div className="heist-card max-w-xl mx-auto">
      <h2 className="heist-title text-2xl text-foreground mb-4">{CALCS.find((c) => c.id === type)?.emoji} {CALCS.find((c) => c.id === type)?.title}</h2>
      <div className="space-y-3">
        {config.fields.map(([key, label, ph]) => (
          <div key={key}>
            <label className="text-sm text-muted-foreground heist-mono block mb-1">{label}</label>
            <input type="number" value={inputs[key] || ""} onChange={(e) => set(key, e.target.value)} placeholder={ph}
              className="w-full px-4 py-2 bg-secondary border border-border rounded text-foreground focus:border-primary focus:outline-none" />
          </div>
        ))}
        <button onClick={() => setResult(config.calc())} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded heist-mono">CALCULATE</button>
      </div>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-3 gap-3">
          {config.results(result).map(([label, value], i) => (
            <div key={i} className={`rounded p-3 text-center ${i === config.results(result).length - 1 ? "bg-primary/20 border border-primary" : "bg-secondary"}`}>
              <p className="text-xs text-muted-foreground heist-mono">{label}</p>
              <p className={`text-lg font-bold ${i === config.results(result).length - 1 ? "text-primary" : "text-foreground"}`}>{value}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
