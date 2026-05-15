import { useState } from "react";
import { motion } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";
import { calculateTax } from "@/data/engine";

interface SalaryStructure {
  basic: string; hra: string; special: string; lta: string;
  pf: string; nps: string; section80D: string; homeLoan: string;
  rentPaid: string; metro: string;
}

const DEDUCTIONS_80C = [
  { name: "EPF (Employee PF)", key: "pf", max: 150000 },
  { name: "PPF", key: "ppf", max: 150000 },
  { name: "ELSS Mutual Funds", key: "elss", max: 150000 },
  { name: "Life Insurance Premium", key: "lic", max: 150000 },
  { name: "Children Tuition Fees", key: "tuition", max: 150000 },
  { name: "Home Loan Principal", key: "hlPrincipal", max: 150000 },
];

export default function TaxWizardPage() {
  const [salary, setSalary] = useState<SalaryStructure>({
    basic: "", hra: "", special: "", lta: "",
    pf: "", nps: "", section80D: "", homeLoan: "",
    rentPaid: "", metro: "yes",
  });
  const [deductions, setDeductions] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [missedDeductions, setMissedDeductions] = useState<string[]>([]);

  const update = (key: keyof SalaryStructure, val: string) => setSalary((p) => ({ ...p, [key]: val }));

  const calculate = () => {
    const basic = Number(salary.basic) || 0;
    const hra = Number(salary.hra) || 0;
    const special = Number(salary.special) || 0;
    const lta = Number(salary.lta) || 0;
    const annualIncome = (basic + hra + special + lta) * 12;

    // Calculate HRA exemption
    const rentPaid = Number(salary.rentPaid) || 0;
    const metroFactor = salary.metro === "yes" ? 0.5 : 0.4;
    const hraExempt = Math.min(hra * 12, rentPaid * 12 - basic * 12 * 0.1, basic * 12 * metroFactor);
    const actualHRA = Math.max(0, hraExempt);

    // Calculate 80C
    const total80C = Math.min(
      Object.values(deductions).reduce((s, v) => s + (Number(v) || 0), 0) + (Number(salary.pf) || 0) * 12,
      150000
    );

    const nps80CCD = Math.min((Number(salary.nps) || 0) * 12, 50000);
    const section80D = Math.min(Number(salary.section80D) || 0, 75000);
    const homeLoanInterest = Math.min(Number(salary.homeLoan) || 0, 200000);

    const totalDeductions = total80C + nps80CCD + section80D + homeLoanInterest + actualHRA;
    const taxResult = calculateTax(annualIncome, totalDeductions);

    // Find missed deductions
    const missed: string[] = [];
    if (total80C < 150000) missed.push(`💡 You can save ₹${(150000 - total80C).toLocaleString()} more under 80C — consider ELSS or PPF.`);
    if (!salary.nps || Number(salary.nps) === 0) missed.push(`💡 NPS contribution up to ₹50,000 gives extra 80CCD(1B) deduction beyond 80C.`);
    if (!salary.section80D || Number(salary.section80D) === 0) missed.push(`💡 Health insurance premium up to ₹25,000 (₹50,000 for seniors) is deductible under 80D.`);
    if (rentPaid > 0 && !salary.hra) missed.push(`💡 You're paying rent but not claiming HRA — could save ₹${Math.round(rentPaid * 12 * 0.3).toLocaleString()}/yr.`);
    if (annualIncome > 1500000 && !salary.homeLoan) missed.push(`💡 Home loan interest up to ₹2L is deductible under Section 24. Consider if buying a house.`);

    setMissedDeductions(missed);
    setResult({ ...taxResult, annualIncome, totalDeductions, total80C, nps80CCD, section80D, homeLoanInterest, actualHRA, savings: Math.abs(taxResult.oldRegimeTax - taxResult.newRegimeTax) });
  };

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="cams" />
      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2">
          🧙 TAX WIZARD
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8 heist-mono">Old vs New Regime • Deduction Finder • Salary Optimization</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="heist-card">
            <h3 className="text-xl font-bold text-foreground mb-4">💼 Monthly Salary Structure</h3>
            <div className="space-y-3">
              {([
                ["basic", "Basic Salary (₹/mo)", "40000"], ["hra", "HRA (₹/mo)", "16000"],
                ["special", "Special Allowance (₹/mo)", "20000"], ["lta", "LTA (₹/mo)", "4000"],
                ["pf", "PF Contribution (₹/mo)", "4800"], ["nps", "NPS Contribution (₹/mo)", "0"],
                ["rentPaid", "Monthly Rent Paid (₹)", "15000"], ["section80D", "Health Insurance (₹/yr)", "25000"],
                ["homeLoan", "Home Loan Interest (₹/yr)", "0"],
              ] as [keyof SalaryStructure, string, string][]).map(([key, label, ph]) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground heist-mono">{label}</label>
                  <input type="number" value={salary[key]} onChange={(e) => update(key, e.target.value)} placeholder={ph}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm focus:border-primary focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground heist-mono">Metro City?</label>
                <select value={salary.metro} onChange={(e) => update("metro", e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm">
                  <option value="yes">Yes (Delhi, Mumbai, Kolkata, Chennai)</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="heist-card">
            <h3 className="text-xl font-bold text-foreground mb-4">📋 Section 80C Investments (₹/yr)</h3>
            <div className="space-y-3">
              {DEDUCTIONS_80C.map((d) => (
                <div key={d.key}>
                  <label className="text-xs text-muted-foreground heist-mono">{d.name}</label>
                  <input type="number" value={deductions[d.key] || ""} onChange={(e) => setDeductions({ ...deductions, [d.key]: e.target.value })}
                    placeholder="0" className="w-full px-3 py-2 bg-secondary border border-border rounded text-foreground text-sm focus:border-primary focus:outline-none" />
                </div>
              ))}
              <p className="text-xs text-muted-foreground heist-mono">
                80C Total: ₹{Math.min(Object.values(deductions).reduce((s, v) => s + (Number(v) || 0), 0), 150000).toLocaleString()} / ₹1,50,000
              </p>
            </div>
          </motion.div>
        </div>

        <button onClick={calculate} className="w-full px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg heist-mono text-lg mb-8">
          CALCULATE TAX — OLD vs NEW REGIME
        </button>

        {result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card text-center">
                <p className="text-sm text-muted-foreground heist-mono">Old Regime Tax</p>
                <p className="text-3xl font-bold text-foreground mt-1">₹{result.oldRegimeTax.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Deductions: ₹{result.totalDeductions.toLocaleString()}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="heist-card text-center">
                <p className="text-sm text-muted-foreground heist-mono">New Regime Tax</p>
                <p className="text-3xl font-bold text-foreground mt-1">₹{result.newRegimeTax.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Standard Deduction: ₹75,000</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="heist-card text-center border-primary shadow-[0_0_20px_hsl(var(--heist-red)/0.3)]">
                <p className="text-sm text-muted-foreground heist-mono">Recommended</p>
                <p className="text-3xl font-bold text-primary mt-1">{result.recommendation}</p>
                <p className="text-xs text-heist-cyan mt-1">You save ₹{result.savings.toLocaleString()}</p>
              </motion.div>
            </div>

            {missedDeductions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heist-card mb-6">
                <h3 className="text-xl font-bold text-foreground mb-3">🔍 Missed Deductions Found!</h3>
                <div className="space-y-2">
                  {missedDeductions.map((tip, i) => (
                    <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="text-foreground p-3 bg-secondary rounded border-l-4 border-l-heist-gold">{tip}</motion.p>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="heist-card">
              <h3 className="text-lg font-bold text-foreground mb-3">📊 Deduction Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ["80C", result.total80C], ["NPS 80CCD(1B)", result.nps80CCD],
                  ["80D Health", result.section80D], ["HRA Exemption", result.actualHRA],
                  ["Home Loan 24", result.homeLoanInterest],
                ].map(([label, val], i) => (
                  <div key={i} className="p-3 bg-secondary rounded text-center">
                    <p className="text-xs text-muted-foreground heist-mono">{label as string}</p>
                    <p className="text-lg font-bold text-foreground">₹{(val as number).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
