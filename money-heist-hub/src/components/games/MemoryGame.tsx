import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FINANCIAL_CARDS = [
  { id: 1, emoji: "💰", label: "Savings" },
  { id: 2, emoji: "📈", label: "Stocks" },
  { id: 3, emoji: "🏦", label: "Bank" },
  { id: 4, emoji: "💎", label: "Assets" },
  { id: 5, emoji: "🪙", label: "Gold" },
  { id: 6, emoji: "🏠", label: "Real Estate" },
  { id: 7, emoji: "📊", label: "Mutual Fund" },
  { id: 8, emoji: "💵", label: "Cash Flow" },
];

interface Card {
  id: number;
  emoji: string;
  label: string;
  uid: number;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initGame = () => {
    const doubled = [...FINANCIAL_CARDS, ...FINANCIAL_CARDS].map((c, i) => ({
      ...c,
      uid: i,
      flipped: false,
      matched: false,
    }));
    // Shuffle
    for (let i = doubled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
    }
    setCards(doubled);
    setFlippedIds([]);
    setMoves(0);
    setMatched(0);
    setGameWon(false);
  };

  useEffect(() => { initGame(); }, []);

  const handleFlip = (uid: number) => {
    if (flippedIds.length >= 2) return;
    const card = cards.find((c) => c.uid === uid);
    if (!card || card.flipped || card.matched) return;

    const newCards = cards.map((c) => (c.uid === uid ? { ...c, flipped: true } : c));
    setCards(newCards);
    const newFlipped = [...flippedIds, uid];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped.map((id) => newCards.find((c) => c.uid === id)!);
      if (a.id === b.id) {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === a.id ? { ...c, matched: true } : c)));
          setMatched((m) => {
            const newM = m + 1;
            if (newM === FINANCIAL_CARDS.length) setGameWon(true);
            return newM;
          });
          setFlippedIds([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (newFlipped.includes(c.uid) ? { ...c, flipped: false } : c)));
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  return (
    <div className="heist-card max-w-lg mx-auto text-center">
      <h2 className="heist-title text-2xl text-foreground mb-2">🧠 FINANCIAL MEMORY MATCH</h2>
      <div className="flex justify-center gap-6 mb-4">
        <span className="heist-mono text-primary">MOVES: {moves}</span>
        <span className="heist-mono text-heist-cyan">MATCHED: {matched}/{FINANCIAL_CARDS.length}</span>
      </div>

      {gameWon ? (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <p className="text-2xl text-primary heist-title mb-4">🎉 MISSION COMPLETE!</p>
          <p className="text-foreground mb-4">Completed in {moves} moves</p>
          <button onClick={initGame} className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded heist-mono">
            PLAY AGAIN
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
          {cards.map((card) => (
            <motion.button
              key={card.uid}
              onClick={() => handleFlip(card.uid)}
              className={`aspect-square rounded-lg text-2xl font-bold flex flex-col items-center justify-center transition-all duration-300 ${
                card.matched
                  ? "bg-primary/30 border-2 border-primary"
                  : card.flipped
                  ? "bg-secondary border-2 border-heist-cyan"
                  : "bg-muted border-2 border-border hover:border-primary cursor-pointer"
              }`}
              whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : undefined}
              whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : undefined}
            >
              {card.flipped || card.matched ? (
                <>
                  <span className="text-3xl">{card.emoji}</span>
                  <span className="text-[9px] text-muted-foreground mt-1 heist-mono">{card.label}</span>
                </>
              ) : (
                <span className="text-xl text-muted-foreground">?</span>
              )}
            </motion.button>
          ))}
        </div>
      )}

      <button onClick={initGame} className="mt-4 px-6 py-2 bg-secondary text-foreground rounded heist-mono border border-border">
        RESET
      </button>
    </div>
  );
}
