import { motion } from "framer-motion";
import MoneyHeistAnimation from "@/components/MoneyHeistAnimation";
import { useHeist } from "@/context/HeistContext";
import { getUnlockedStories, STORIES } from "@/data/stories";
import { useState } from "react";

const LEARNING_RESOURCES = [
  { category: "SIP & Compounding", title: "Power of Compounding", url: "https://www.youtube.com/watch?v=wfJEkIFtLUM" },
  { category: "Tax Saving", title: "Tax Saving Basics", url: "https://www.youtube.com/watch?v=3-M2zP0nB18" },
  { category: "Budgeting", title: "Budgeting 101", url: "https://www.youtube.com/watch?v=sVKQn2I4niY" },
  { category: "Insurance", title: "Why You Need Term Insurance", url: "https://www.youtube.com/results?search_query=term+insurance+india" },
];

export default function KnowledgePage() {
  const { userData } = useHeist();
  const unlockedStories = getUnlockedStories(userData.streak_days);
  const [expandedStory, setExpandedStory] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen">
      <MoneyHeistAnimation variant="knowledge" />
      <div className="relative z-10 p-4 md:p-8 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heist-title text-4xl md:text-5xl text-foreground text-center mb-2"
        >
          📚 PROFESSOR'S BLUEPRINTS
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8">Unlock stories every 5 streak days | Learning resources for your mission</p>

        {/* Stories */}
        <h2 className="heist-title text-2xl text-foreground mb-4">📖 FINANCIAL STORIES</h2>
        <div className="space-y-3 mb-10">
          {STORIES.map((story, i) => {
            const isUnlocked = i < unlockedStories.length;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={isUnlocked ? "heist-card cursor-pointer" : "heist-card-locked"}
                onClick={() => isUnlocked && setExpandedStory(expandedStory === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">{isUnlocked ? story.title : `🔒 Story ${i + 1} (Streak ${(i + 1) * 5} needed)`}</h3>
                  {isUnlocked && <span className="text-primary text-sm">{expandedStory === i ? "▲" : "▼"}</span>}
                </div>
                {expandedStory === i && isUnlocked && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 text-muted-foreground leading-relaxed"
                  >
                    {story.content}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Learning Resources */}
        <h2 className="heist-title text-2xl text-foreground mb-4">🎓 LEARNING RESOURCES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LEARNING_RESOURCES.map((res, i) => (
            <motion.a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="heist-card block"
            >
              <span className="heist-mono text-xs text-primary">{res.category}</span>
              <h3 className="font-bold text-foreground mt-1">{res.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">📺 Watch on YouTube →</p>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
