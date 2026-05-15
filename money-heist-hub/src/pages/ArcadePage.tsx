import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";
import { useHeist } from "@/context/HeistContext";
import { getUnlockedGames, type GameConfig } from "@/data/gamesConfig";
import { calculateSimpleInterest, calculateCompoundInterest, calculateSIP } from "@/data/engine";
import SnakeGame from "@/components/games/SnakeGame";
import MemoryGame from "@/components/games/MemoryGame";

export default function ArcadePage() {
  const { userData } = useHeist();
  const { unlocked, all } = getUnlockedGames(userData.streak_days);
  const [activeGame, setActiveGame] = useState<GameConfig | null>(null);

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="arcade" />
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2"
        >
          🕹️ TACTICAL SIMULATION HUB
        </motion.h1>
        <p className="text-center text-muted-foreground mb-6 heist-mono">
          Unlock a new game every 3 streak days | Unlocked: {unlocked.length}/{all.length}
        </p>

        <AnimatePresence mode="wait">
          {activeGame ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button
                onClick={() => setActiveGame(null)}
                className="mb-4 px-4 py-2 bg-secondary text-foreground rounded heist-mono border border-border hover:border-primary"
              >
                ← BACK TO ARCADE
              </button>
              <GameRenderer game={activeGame} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {all.map((game, i) => {
                const isUnlocked = i < unlocked.length;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={isUnlocked ? "heist-card cursor-pointer" : "heist-card-locked"}
                    onClick={() => isUnlocked && setActiveGame(game)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="heist-mono text-xs text-primary">{game.genre}</span>
                      {!isUnlocked && <span className="text-xs text-muted-foreground">🔒 LOCKED</span>}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{game.title}</h3>
                    <p className="text-sm text-muted-foreground">{game.milestone}</p>
                    {isUnlocked && (
                      <button className="mt-3 w-full px-3 py-2 bg-primary text-primary-foreground rounded font-bold text-sm heist-mono">
                        LAUNCH
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GameRenderer({ game }: { game: GameConfig }) {
  if (game.type === "snake") return <SnakeGame />;
  if (game.type === "memory") return <MemoryGame />;
  if (game.type === "calculator-si") return <SimpleInterestGame />;
  if (game.type === "calculator-ci") return <CompoundInterestGame />;
  if (game.type === "calculator-sip") return <SIPGame />;
  return <div className="heist-card text-center text-foreground">Game loading...</div>;
}

function SimpleInterestGame() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState<any>(null);

  const calc = () => {
    if (principal && rate && time) {
      setResult(calculateSimpleInterest(Number(principal), Number(rate), Number(time)));
    }
  };

  return (
    <div className="heist-card max-w-xl mx-auto">
      <h2 className="heist-title text-2xl text-foreground mb-4">SIMPLE INTEREST CALCULATOR</h2>
      <div className="space-y-3">
        <InputField label="Principal Amount (₹)" value={principal} onChange={setPrincipal} placeholder="e.g. 100000" />
        <InputField label="Annual Rate (%)" value={rate} onChange={setRate} placeholder="e.g. 8" />
        <InputField label="Time (years)" value={time} onChange={setTime} placeholder="e.g. 5" />
        <button onClick={calc} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded heist-mono">CALCULATE</button>
      </div>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-3 gap-3">
          <ResultBox label="Principal" value={`₹${result.principal.toLocaleString()}`} />
          <ResultBox label="Interest" value={`₹${result.interest.toLocaleString()}`} />
          <ResultBox label="Total" value={`₹${result.total.toLocaleString()}`} highlight />
        </motion.div>
      )}
    </div>
  );
}

function CompoundInterestGame() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [n, setN] = useState("12");
  const [result, setResult] = useState<any>(null);

  const calc = () => {
    if (principal && rate && time) {
      setResult(calculateCompoundInterest(Number(principal), Number(rate), Number(time), Number(n)));
    }
  };

  return (
    <div className="heist-card max-w-xl mx-auto">
      <h2 className="heist-title text-2xl text-foreground mb-4">COMPOUND INTEREST CALCULATOR</h2>
      <div className="space-y-3">
        <InputField label="Principal Amount (₹)" value={principal} onChange={setPrincipal} placeholder="e.g. 100000" />
        <InputField label="Annual Rate (%)" value={rate} onChange={setRate} placeholder="e.g. 12" />
        <InputField label="Time (years)" value={time} onChange={setTime} placeholder="e.g. 10" />
        <InputField label="Compounding Frequency/year" value={n} onChange={setN} placeholder="12" />
        <button onClick={calc} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded heist-mono">CALCULATE</button>
      </div>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-3 gap-3">
          <ResultBox label="Principal" value={`₹${result.principal.toLocaleString()}`} />
          <ResultBox label="Interest" value={`₹${result.interest.toLocaleString()}`} />
          <ResultBox label="Total" value={`₹${result.total.toLocaleString()}`} highlight />
        </motion.div>
      )}
    </div>
  );
}

function SIPGame() {
  const [monthly, setMonthly] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState<any>(null);

  const calc = () => {
    if (monthly && years && rate) {
      setResult(calculateSIP(Number(monthly), Number(years), Number(rate)));
    }
  };

  return (
    <div className="heist-card max-w-xl mx-auto">
      <h2 className="heist-title text-2xl text-foreground mb-4">SIP CALCULATOR</h2>
      <div className="space-y-3">
        <InputField label="Monthly Investment (₹)" value={monthly} onChange={setMonthly} placeholder="e.g. 5000" />
        <InputField label="Tenure (years)" value={years} onChange={setYears} placeholder="e.g. 15" />
        <InputField label="Expected Annual Return (%)" value={rate} onChange={setRate} placeholder="e.g. 12" />
        <button onClick={calc} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded heist-mono">CALCULATE</button>
      </div>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-3 gap-3">
          <ResultBox label="Invested" value={`₹${result.investedAmount.toLocaleString()}`} />
          <ResultBox label="Returns" value={`₹${result.estimatedReturns.toLocaleString()}`} />
          <ResultBox label="Total" value={`₹${result.totalValue.toLocaleString()}`} highlight />
        </motion.div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-sm text-muted-foreground heist-mono block mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-secondary border border-border rounded text-foreground focus:border-primary focus:outline-none transition-colors"
      />
    </div>
  );
}

function ResultBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded p-3 text-center ${highlight ? "bg-primary/20 border border-primary" : "bg-secondary"}`}>
      <p className="text-xs text-muted-foreground heist-mono">{label}</p>
      <p className={`text-lg font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
