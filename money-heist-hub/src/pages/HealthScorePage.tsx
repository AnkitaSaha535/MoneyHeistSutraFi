import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";

interface Dimension {
  name: string;
  emoji: string;
  questions: { q: string; options: { label: string; score: number }[] }[];
}

const DIMENSIONS: Dimension[] = [
  {
    name: "Emergency Preparedness", emoji: "🆘",
    questions: [
      { q: "How many months of expenses do you have saved?", options: [{ label: "Less than 1 month", score: 10 }, { label: "1-3 months", score: 40 }, { label: "3-6 months", score: 70 }, { label: "6+ months", score: 100 }] },
      { q: "Do you have a separate emergency fund account?", options: [{ label: "No", score: 20 }, { label: "Mixed with savings", score: 50 }, { label: "Yes, dedicated account", score: 100 }] },
    ],
  },
  {
    name: "Insurance Coverage", emoji: "🛡️",
    questions: [
      { q: "Do you have term life insurance?", options: [{ label: "No insurance", score: 0 }, { label: "Only employer cover", score: 30 }, { label: "Personal term plan < 50L", score: 60 }, { label: "Term plan ≥ 1 Cr", score: 100 }] },
      { q: "Do you have health insurance?", options: [{ label: "No", score: 0 }, { label: "Only employer", score: 40 }, { label: "Personal < 5L", score: 60 }, { label: "Personal ≥ 10L + super top-up", score: 100 }] },
    ],
  },
  {
    name: "Investment Diversification", emoji: "📊",
    questions: [
      { q: "Where is your money invested?", options: [{ label: "Only savings/FD", score: 20 }, { label: "FD + 1 MF", score: 40 }, { label: "MFs + stocks", score: 70 }, { label: "MFs + stocks + gold + debt", score: 100 }] },
      { q: "Do you have SIPs running?", options: [{ label: "No", score: 10 }, { label: "1 SIP", score: 40 }, { label: "2-4 SIPs", score: 70 }, { label: "5+ SIPs with rebalancing", score: 100 }] },
    ],
  },
  {
    name: "Debt Health", emoji: "💳",
    questions: [
      { q: "What's your EMI-to-income ratio?", options: [{ label: "Over 50%", score: 10 }, { label: "30-50%", score: 40 }, { label: "10-30%", score: 70 }, { label: "Under 10% or no debt", score: 100 }] },
      { q: "Do you have credit card debt?", options: [{ label: "Yes, revolving balance", score: 10 }, { label: "Occasionally", score: 50 }, { label: "Always pay full", score: 100 }] },
    ],
  },
  {
    name: "Tax Efficiency", emoji: "📋",
    questions: [
      { q: "Do you use 80C deductions fully?", options: [{ label: "Don't know what 80C is", score: 10 }, { label: "Partially", score: 40 }, { label: "Full ₹1.5L used", score: 80 }, { label: "80C + 80D + NPS + HRA", score: 100 }] },
      { q: "Which tax regime do you follow?", options: [{ label: "Don't know", score: 10 }, { label: "Default/not compared", score: 30 }, { label: "Compared & chosen optimal", score: 100 }] },
    ],
  },
  {
    name: "Retirement Readiness", emoji: "🏖️",
    questions: [
      { q: "Do you have a retirement plan?", options: [{ label: "Haven't thought about it", score: 10 }, { label: "Relying on EPF only", score: 30 }, { label: "EPF + some MFs", score: 60 }, { label: "Clear FIRE plan with timeline", score: 100 }] },
      { q: "At current rate, can you retire by 50?", options: [{ label: "Definitely not", score: 10 }, { label: "Not sure", score: 30 }, { label: "Possibly with changes", score: 60 }, { label: "Yes, on track", score: 100 }] },
    ],
  },
];

export default function HealthScorePage() {
  const [step, setStep] = useState(0); // 0 = intro, 1-6 = dimensions, 7 = result
  const [answers, setAnswers] = useState<number[][]>(DIMENSIONS.map((d) => d.questions.map(() => -1)));
  const [currentQ, setCurrentQ] = useState(0);

  const totalQuestions = DIMENSIONS.reduce((s, d) => s + d.questions.length, 0);
  const answeredCount = answers.flat().filter((a) => a >= 0).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const dimIndex = step - 1;
  const currentDim = DIMENSIONS[dimIndex];

  const handleAnswer = (qIdx: number, score: number) => {
    const newAnswers = [...answers];
    newAnswers[dimIndex] = [...newAnswers[dimIndex]];
    newAnswers[dimIndex][qIdx] = score;
    setAnswers(newAnswers);
    if (qIdx < currentDim.questions.length - 1) {
      setCurrentQ(qIdx + 1);
    } else {
      setTimeout(() => { setStep(step + 1); setCurrentQ(0); }, 400);
    }
  };

  const dimScores = DIMENSIONS.map((d, i) => {
    const scores = answers[i].filter((a) => a >= 0);
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  });
  const overallScore = Math.round(dimScores.reduce((a, b) => a + b, 0) / 6);

  const getGrade = (s: number) => s >= 80 ? "A" : s >= 60 ? "B" : s >= 40 ? "C" : s >= 20 ? "D" : "F";
  const getColor = (s: number) => s >= 80 ? "text-heist-cyan" : s >= 60 ? "text-heist-gold" : "text-primary";

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="dashboard" />
      <div className="relative z-10 p-4 md:p-8 max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2">
          🩺 MONEY HEALTH SCORE
        </motion.h1>
        <p className="text-center text-muted-foreground mb-6 heist-mono">5-Minute Financial Wellness Assessment</p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground heist-mono mb-1">
            <span>{answeredCount}/{totalQuestions} questions</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="heist-card text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready for your Financial Health Checkup?</h2>
              <p className="text-muted-foreground mb-6">Answer 12 quick questions across 6 dimensions to get your comprehensive financial wellness score.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {DIMENSIONS.map((d, i) => (
                  <div key={i} className="p-3 bg-secondary rounded text-center">
                    <span className="text-2xl">{d.emoji}</span>
                    <p className="text-xs text-foreground mt-1">{d.name}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded heist-mono">START ASSESSMENT</button>
            </motion.div>
          )}

          {step >= 1 && step <= 6 && currentDim && (
            <motion.div key={`dim-${step}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="heist-card">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{currentDim.emoji}</span>
                <div>
                  <p className="text-xs text-primary heist-mono">DIMENSION {step}/6</p>
                  <h2 className="text-xl font-bold text-foreground">{currentDim.name}</h2>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-lg text-foreground mb-4">{currentDim.questions[currentQ].q}</p>
                <div className="space-y-2">
                  {currentDim.questions[currentQ].options.map((opt, oi) => (
                    <motion.button key={oi} onClick={() => handleAnswer(currentQ, opt.score)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-4 py-3 rounded border transition-colors ${
                        answers[dimIndex][currentQ] === opt.score ? "bg-primary/20 border-primary text-foreground" : "bg-secondary border-border text-foreground hover:border-primary/50"
                      }`}>
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground heist-mono">Question {currentQ + 1}/{currentDim.questions.length}</p>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="heist-card text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Your Financial Health Score</h2>
                <div className={`text-8xl font-bold heist-title ${getColor(overallScore)}`}>{overallScore}</div>
                <p className="text-2xl font-bold text-foreground mt-2">Grade: {getGrade(overallScore)}</p>
                <p className="text-muted-foreground mt-2">
                  {overallScore >= 80 ? "Excellent! You're financially fit." : overallScore >= 60 ? "Good, but room for improvement." : overallScore >= 40 ? "Needs attention in several areas." : "Critical — take action now!"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {DIMENSIONS.map((d, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="heist-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{d.emoji}</span>
                      <span className={`text-2xl font-bold ${getColor(dimScores[i])}`}>{dimScores[i]}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{d.name}</h3>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden mt-2">
                      <motion.div className={`h-full rounded-full ${dimScores[i] >= 70 ? "bg-heist-cyan" : dimScores[i] >= 40 ? "bg-heist-gold" : "bg-primary"}`}
                        initial={{ width: 0 }} animate={{ width: `${dimScores[i]}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
                    </div>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => { setStep(0); setAnswers(DIMENSIONS.map((d) => d.questions.map(() => -1))); setCurrentQ(0); }}
                className="w-full px-6 py-3 bg-secondary text-foreground font-bold rounded heist-mono border border-border hover:border-primary">
                RETAKE ASSESSMENT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
