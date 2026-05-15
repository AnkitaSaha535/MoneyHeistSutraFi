import { useState } from "react";
import { motion } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";

interface PartnerData {
  name: string; income: string; expenses: string; pf: string; nps: string;
  hra: string; rent: string; metro: string; insurance: string; investments: string;
}

const emptyPartner = (): PartnerData => ({
  name: "", income: "", expenses: "", pf: "", nps: "",
  hra: "", rent: "", metro: "yes", insurance: "", investments: "",
});

export default function CouplePlannerPage() {
  const [p1, setP1] = useState<PartnerData>(emptyPartner());
  const [p2, setP2] = useState<PartnerData>(emptyPartner());
  const [result, setResult] = useState<any>(null);

  const updateP = (setter: typeof setP1, key: keyof PartnerData, val: string) =>
    setter((p) => ({ ...p, [key]: val }));

  const calculate = () => {
    const inc1 = Number(p1.income) || 0, inc2 = Number(p2.income) || 0;
    const exp1 = Number(p1.expenses) || 0, exp2 = Number(p2.expenses) || 0;
    const pf1 = Number(p1.pf) || 0, pf2 = Number(p2.pf) || 0;
    const nps1 = Number(p1.nps) || 0, nps2 = Number(p2.nps) || 0;
    const hra1 = Number(p1.hra) || 0, hra2 = Number(p2.hra) || 0;
    const rent = Number(p1.rent) || Number(p2.rent) || 0;
    const ins1 = Number(p1.insurance) || 0, ins2 = Number(p2.insurance) || 0;
    const inv1 = Number(p1.investments) || 0, inv2 = Number(p2.investments) || 0;

    const combined = inc1 + inc2;
    const combinedExpenses = exp1 + exp2;
    const savingsRate = ((combined - combinedExpenses) / combined * 100).toFixed(1);
    const netWorth = inv1 + inv2 + (pf1 + pf2) * 12 * 3;

    // HRA optimization: person with higher HRA claims rent
    const hraClaimant = hra1 >= hra2 ? (p1.name || "Partner 1") : (p2.name || "Partner 2");
    const maxHRA = Math.max(hra1, hra2);

    // Optimal SIP split: higher income → more equity, lower → more debt for tax efficiency
    const higherIncome = inc1 >= inc2 ? (p1.name || "Partner 1") : (p2.name || "Partner 2");
    const lowerIncome = inc1 < inc2 ? (p1.name || "Partner 1") : (p2.name || "Partner 2");
    const totalSIP = combined - combinedExpenses;
    const equitySIP = Math.round(totalSIP * 0.6);
    const debtSIP = Math.round(totalSIP * 0.3);
    const goldSIP = Math.round(totalSIP * 0.1);

    // NPS optimization
    const totalNPSSaving = Math.min(nps1 * 12, 50000) + Math.min(nps2 * 12, 50000);

    // Insurance adequacy
    const needed1 = inc1 * 12 * 10, needed2 = inc2 * 12 * 10;

    setResult({
      combined, combinedExpenses, savingsRate, netWorth, hraClaimant, maxHRA,
      higherIncome, lowerIncome, totalSIP, equitySIP, debtSIP, goldSIP,
      totalNPSSaving, needed1, needed2, ins1: ins1 * 12, ins2: ins2 * 12,
      total80C_1: Math.min(pf1 * 12 + 150000 * 0.3, 150000),
      total80C_2: Math.min(pf2 * 12 + 150000 * 0.3, 150000),
    });
  };

  const PartnerForm = ({ data, setter, label }: { data: PartnerData; setter: typeof setP1; label: string }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card">
      <h3 className="text-xl font-bold text-foreground mb-4">{label}</h3>
      <div className="space-y-3">
        {([
          ["name", "Name", "text", "e.g. Rahul"], ["income", "Monthly Income (₹)", "number", "60000"],
          ["expenses", "Monthly Expenses (₹)", "number", "25000"], ["pf", "Monthly PF (₹)", "number", "4800"],
          ["nps", "Monthly NPS (₹)", "number", "4166"], ["hra", "Monthly HRA (₹)", "number", "16000"],
          ["rent", "Monthly Rent (₹)", "number", "15000"], ["insurance", "Term Insurance (₹/mo)", "number", "1000"],
          ["investments", "Total Investments (₹)", "number", "500000"],
        ] as [keyof PartnerData, string, string, string][]).map(([key, lbl, type, ph]) => (
          <div key={key}>
            <label className="text-xs text-muted-foreground heist-mono">{lbl}</label>
            <input type={type} value={data[key]} onChange={(e) => updateP(setter, key, e.target.value)} placeholder={ph}
              className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm focus:border-primary focus:outline-none" />
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="books" />
      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2">
          💑 COUPLE'S MONEY PLANNER
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8 heist-mono">India's First AI Joint Financial Planning Tool</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PartnerForm data={p1} setter={setP1} label="👤 Partner 1" />
          <PartnerForm data={p2} setter={setP2} label="👤 Partner 2" />
        </div>

        <button onClick={calculate} className="w-full px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg heist-mono text-lg mb-8">
          OPTIMIZE JOINT FINANCES
        </button>

        {result && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                ["Combined Income", `₹${result.combined.toLocaleString()}/mo`],
                ["Savings Rate", `${result.savingsRate}%`],
                ["Combined Net Worth", `₹${result.netWorth.toLocaleString()}`],
                ["Available for SIP", `₹${result.totalSIP.toLocaleString()}/mo`],
              ].map(([label, value], i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="heist-card text-center">
                  <p className="text-xs text-muted-foreground heist-mono">{label}</p>
                  <p className="text-lg font-bold text-primary mt-1">{value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="heist-card">
                <h3 className="text-lg font-bold text-foreground mb-3">🏠 HRA Optimization</h3>
                <p className="text-foreground">Claim HRA through <strong className="text-primary">{result.hraClaimant}</strong> (higher HRA component).</p>
                <p className="text-muted-foreground text-sm mt-2">Max HRA exemption: ₹{(result.maxHRA * 12).toLocaleString()}/yr</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="heist-card">
                <h3 className="text-lg font-bold text-foreground mb-3">📊 Optimal SIP Split</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground"><strong>{result.higherIncome}</strong>: ₹{result.equitySIP.toLocaleString()}/mo → Equity index funds (higher tax bracket = LTCG efficient)</p>
                  <p className="text-foreground"><strong>{result.lowerIncome}</strong>: ₹{result.debtSIP.toLocaleString()}/mo → Debt funds + ₹{result.goldSIP.toLocaleString()}/mo → Gold</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="heist-card">
                <h3 className="text-lg font-bold text-foreground mb-3">🏦 NPS Matching</h3>
                <p className="text-foreground">Both partners should contribute ₹50,000/yr each to NPS for 80CCD(1B).</p>
                <p className="text-primary font-bold mt-1">Combined tax saving: ₹{result.totalNPSSaving.toLocaleString()}/yr → ₹{Math.round(result.totalNPSSaving * 0.3).toLocaleString()} tax saved</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="heist-card">
                <h3 className="text-lg font-bold text-foreground mb-3">🛡️ Insurance Check</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground">{p1.name || "Partner 1"}: Need ₹{result.needed1.toLocaleString()} | Have ₹{result.ins1.toLocaleString()}/yr
                    {result.ins1 < result.needed1 / 30 && <span className="text-primary font-bold"> ⚠️ Insufficient</span>}</p>
                  <p className="text-foreground">{p2.name || "Partner 2"}: Need ₹{result.needed2.toLocaleString()} | Have ₹{result.ins2.toLocaleString()}/yr
                    {result.ins2 < result.needed2 / 30 && <span className="text-primary font-bold"> ⚠️ Insufficient</span>}</p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
