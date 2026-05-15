export interface GameConfig {
  genre: string;
  title: string;
  milestone: string;
  type: "external" | "snake" | "memory" | "calculator-si" | "calculator-ci" | "calculator-sip";
}

export const GAMES: GameConfig[] = [
  { genre: "The Tokyo Strategy", title: "Simple Interest Calculator", milestone: "Calculate simple interest", type: "calculator-si" },
  { genre: "The Denver Reflex", title: "Compound Interest Calculator", milestone: "Understanding compound interest", type: "calculator-ci" },
  { genre: "The Berlin Defense", title: "SIP Calculator", milestone: "Plan your SIP investments", type: "calculator-sip" },
  { genre: "The Moscow Gambit", title: "Memory Match", milestone: "Test your financial memory", type: "memory" },
  { genre: "The Rio Maneuver", title: "Snake: Money Collector", milestone: "Collect coins in snake game", type: "snake" },
  { genre: "The Helsinki Protocol", title: "Memory Match Pro", milestone: "Advanced memory challenge", type: "memory" },
  { genre: "The Oslo Network", title: "Simple Interest Pro", milestone: "Advanced SI calculations", type: "calculator-si" },
  { genre: "The Nairobi Strike", title: "Compound Interest Pro", milestone: "Master compound interest", type: "calculator-ci" },
  { genre: "The Bogota Blueprint", title: "SIP Growth Planner", milestone: "Long-term SIP planning", type: "calculator-sip" },
  { genre: "The Manila Operation", title: "Financial Memory", milestone: "Financial terms memory game", type: "memory" },
];

export function getUnlockedGames(streak: number): { unlocked: GameConfig[]; all: GameConfig[] } {
  const unlockedCount = Math.min(1 + Math.floor(streak / 3), GAMES.length);
  return { unlocked: GAMES.slice(0, unlockedCount), all: GAMES };
}
