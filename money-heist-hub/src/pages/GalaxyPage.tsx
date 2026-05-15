import { motion } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";
import { useHeist } from "@/context/HeistContext";
import { GOAL_DATA } from "@/data/goals";
import { getHeistStrategy } from "@/data/engine";
import { useState } from "react";

export default function GalaxyPage() {
  const { userData } = useHeist();
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="galaxy" />
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2"
        >
          🌌 SUTRAFI GLOBAL OPERATIONS MAP
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8">Navigate your expanded financial operations universe</p>

        {/* Galaxy visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="heist-card mb-8 relative overflow-hidden"
          style={{ minHeight: "350px" }}
        >
          <svg viewBox="0 0 600 350" className="w-full h-full">
            {/* Center sun */}
            <circle cx="300" cy="175" r="25" fill="hsl(var(--heist-red))" opacity="0.8" />
            <text x="300" y="180" textAnchor="middle" fill="white" fontSize="12" fontFamily="var(--font-mono)">YOU</text>

            {/* Orbits */}
            {[80, 130, 170].map((r, i) => (
              <circle key={i} cx="300" cy="175" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4 4" />
            ))}

            {/* Goal planets */}
            {GOAL_DATA.map((goal, i) => {
              const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
              const r = 80 + (i % 3) * 50;
              const x = 300 + r * Math.cos(angle);
              const y = 175 + r * Math.sin(angle);
              const isSelected = selectedGoal === i;
              return (
                <g key={i} onClick={() => setSelectedGoal(i)} className="cursor-pointer">
                  <circle cx={x} cy={y} r={isSelected ? 22 : 18} fill={goal.progress > 50 ? "hsl(var(--heist-cyan))" : "hsl(var(--heist-red))"} opacity={isSelected ? 1 : 0.7} />
                  <text x={x} y={y - 25} textAnchor="middle" fill="white" fontSize="10" fontFamily="var(--font-mono)">{goal.name}</text>
                  <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{goal.progress}%</text>
                </g>
              );
            })}

            {/* Legend */}
            <text x="20" y="20" fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="var(--font-mono)">
              STREAK: {userData.streak_days} | TASKS: {userData.daily_tasks}
            </text>
          </svg>
        </motion.div>

        {/* Target Operations */}
        <h2 className="heist-title text-3xl text-center text-foreground mb-6">🎯 TACTICAL TARGET OPERATIONS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOAL_DATA.map((goal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`heist-card ${selectedGoal === i ? "border-primary shadow-[0_0_20px_hsl(var(--heist-red)/0.3)]" : ""}`}
              onClick={() => setSelectedGoal(i)}
            >
              <h3 className="font-bold text-foreground text-lg mb-2">{goal.name}</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">🎯 Target: <span className="text-foreground font-bold">{goal.target}</span></p>
                <p className="text-muted-foreground">💰 Current: <span className="text-heist-cyan font-bold">{goal.current}</span></p>
                <p className="text-muted-foreground">⏳ ETA: {goal.years} Years</p>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-3 bg-secondary rounded-full overflow-hidden border border-border">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 heist-mono">{goal.progress}% Secured</p>

              {selectedGoal === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 p-3 bg-secondary rounded border border-primary text-sm"
                >
                  <p className="text-foreground">{getHeistStrategy(goal.target, goal.current)}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
