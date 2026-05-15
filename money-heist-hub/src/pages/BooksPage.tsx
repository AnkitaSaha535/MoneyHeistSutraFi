import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";
import { useHeist } from "@/context/HeistContext";
import { getUnlockedBooks, BOOKS } from "@/data/library";

export default function BooksPage() {
  const { userData } = useHeist();
  const { unlocked } = getUnlockedBooks(userData.daily_tasks);
  const [expandedBook, setExpandedBook] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="books" />
      <div className="relative z-10 p-4 md:p-8 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2"
        >
          📖 BOOK VAULT
        </motion.h1>
        <p className="text-center text-muted-foreground mb-2">Complete daily tasks to unlock book summaries</p>
        <p className="text-center text-primary heist-mono mb-8">
          UNLOCKED: {unlocked.length} / {BOOKS.length}
        </p>

        <div className="space-y-3">
          {BOOKS.map((book, i) => {
            const isUnlocked = i < unlocked.length;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.5) }}
                className={isUnlocked ? "heist-card cursor-pointer" : "heist-card-locked"}
                onClick={() => isUnlocked && setExpandedBook(expandedBook === i ? null : i)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="heist-mono text-xs text-primary">Blueprint {String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-bold text-foreground text-lg mt-1">
                      {isUnlocked ? book.title : `🔒 Task ${i + 1} required`}
                    </h3>
                    {isUnlocked && <p className="text-sm text-muted-foreground mt-1">by {book.author}</p>}
                  </div>
                  {isUnlocked && (
                    <span className="text-primary text-sm mt-2">{expandedBook === i ? "▲" : "▼"}</span>
                  )}
                </div>

                {isUnlocked && (
                  <p className="mt-2 text-foreground italic border-l-2 border-primary pl-3">
                    "{book.lesson}"
                  </p>
                )}

                <AnimatePresence>
                  {expandedBook === i && isUnlocked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <h4 className="font-bold text-foreground mb-2 heist-mono">📋 BOOK SUMMARY</h4>
                      <p className="text-muted-foreground leading-relaxed">{book.summary}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
