import { motion } from "framer-motion";

interface MoneyHeistAnimationProps {
  variant: "dashboard" | "arcade" | "knowledge" | "galaxy" | "cams" | "books" | "fire" | "health" | "life" | "tax" | "couple" | "calculators";
}

const SILHOUETTES: Record<string, { emoji: string; animation: string; positions: { bottom: string; left?: string; right?: string; delay: number }[] }> = {
  dashboard: {
    emoji: "🎭",
    animation: "run-right",
    positions: [
      { bottom: "5%", left: "0", delay: 0 },
      { bottom: "15%", right: "0", delay: 4 },
    ],
  },
  arcade: {
    emoji: "🕹️",
    animation: "float-up",
    positions: [
      { bottom: "0", left: "10%", delay: 0 },
      { bottom: "0", right: "10%", delay: 3 },
      { bottom: "0", left: "50%", delay: 6 },
    ],
  },
  knowledge: {
    emoji: "📖",
    animation: "run-left",
    positions: [
      { bottom: "10%", left: "0", delay: 0 },
      { bottom: "20%", left: "0", delay: 5 },
    ],
  },
  galaxy: {
    emoji: "🌟",
    animation: "float-up",
    positions: [
      { bottom: "0", left: "20%", delay: 0 },
      { bottom: "0", right: "20%", delay: 2 },
      { bottom: "0", left: "60%", delay: 4 },
      { bottom: "0", right: "40%", delay: 6 },
    ],
  },
  cams: {
    emoji: "📊",
    animation: "run-right",
    positions: [
      { bottom: "5%", left: "0", delay: 0 },
      { bottom: "12%", left: "0", delay: 3 },
    ],
  },
  books: {
    emoji: "📚",
    animation: "run-left",
    positions: [
      { bottom: "5%", left: "0", delay: 1 },
      { bottom: "10%", left: "0", delay: 4 },
    ],
  },
};

// Money Heist themed SVG silhouettes
const HeistFigure = ({ style, delay, variant }: { style: React.CSSProperties; delay: number; variant: string }) => {
  const figures = {
    dashboard: (
      // Running figure with mask (Dali mask heist crew)
      <svg viewBox="0 0 100 200" width="120" height="200" style={style}>
        <g fill="currentColor" opacity="0.07">
          {/* Body in red jumpsuit running */}
          <ellipse cx="50" cy="30" rx="18" ry="22" /> {/* Head */}
          <rect x="35" y="50" width="30" height="50" rx="8" /> {/* Torso */}
          <rect x="25" y="55" width="15" height="40" rx="5" transform="rotate(-30 32 55)" /> {/* Left arm */}
          <rect x="60" y="55" width="15" height="40" rx="5" transform="rotate(30 68 55)" /> {/* Right arm */}
          <rect x="35" y="95" width="14" height="50" rx="5" transform="rotate(-15 42 95)" /> {/* Left leg */}
          <rect x="51" y="95" width="14" height="50" rx="5" transform="rotate(20 58 95)" /> {/* Right leg */}
        </g>
      </svg>
    ),
    arcade: (
      <svg viewBox="0 0 80 80" width="80" height="80" style={style}>
        <g fill="currentColor" opacity="0.06">
          <circle cx="40" cy="20" r="15" />
          <rect x="25" y="35" width="30" height="30" rx="5" />
          <text x="40" y="55" textAnchor="middle" fontSize="20" fill="currentColor">💰</text>
        </g>
      </svg>
    ),
    default: (
      <svg viewBox="0 0 100 180" width="100" height="180" style={style}>
        <g fill="currentColor" opacity="0.06">
          <circle cx="50" cy="25" r="20" />
          <rect x="30" y="45" width="40" height="60" rx="10" />
          <rect x="30" y="100" width="15" height="50" rx="5" />
          <rect x="55" y="100" width="15" height="50" rx="5" />
        </g>
      </svg>
    ),
  };

  return (
    <motion.div
      className="character-silhouette"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
      style={{ color: "hsl(358, 93%, 45%)", ...style }}
    >
      {figures[variant as keyof typeof figures] || figures.default}
    </motion.div>
  );
};

export default function MoneyHeistAnimation({ variant }: MoneyHeistAnimationProps) {
  const config = SILHOUETTES[variant] || SILHOUETTES.dashboard;
  const bgClass = `bg-heist-${variant}`;

  return (
    <>
      {/* Background gradient */}
      <div className={`fixed inset-0 ${bgClass} -z-10`} />
      {/* Matrix overlay */}
      <div className="matrix-overlay" />
      {/* Scan line */}
      <div className="scan-line" />
      {/* Animated character silhouettes */}
      {config.positions.map((pos, i) => (
        <HeistFigure
          key={i}
          variant={variant}
          delay={pos.delay}
          style={{
            position: "fixed",
            bottom: pos.bottom,
            left: pos.left,
            right: pos.right,
            zIndex: 0,
          }}
        />
      ))}
      {/* Floating money symbols */}
      {variant === "dashboard" && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`money-${i}`}
              className="fixed pointer-events-none z-0 text-4xl opacity-[0.04]"
              initial={{ y: "100vh", x: `${15 + i * 15}vw` }}
              animate={{ y: "-100vh" }}
              transition={{ duration: 15 + i * 3, repeat: Infinity, delay: i * 2, ease: "linear" }}
            >
              {["₹", "💰", "📈", "🏦", "💎", "🪙"][i]}
            </motion.div>
          ))}
        </>
      )}
      {variant === "arcade" && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`game-${i}`}
              className="fixed pointer-events-none z-0 text-2xl"
              style={{ 
                left: `${5 + (i * 7) % 90}%`, 
                top: `${(i * 11) % 80}%` 
              }}
              animate={{ 
                y: [0, -20, 0],
                rotate: [-10, 10, -10],
                opacity: [0.06, 0.12, 0.06]
              }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.4 }}
            >
              {["🎮", "🕹️", "🏆", "🎯", "🎲", "🎪", "🎨", "🎭", "🎪", "🎯", "🎲", "🎮"][i]}
            </motion.div>
          ))}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`coin-${i}`}
              className="fixed pointer-events-none z-0 text-3xl"
              initial={{ y: "100vh", x: `${10 + i * 15}vw` }}
              animate={{ y: "-20vh", rotate: 360 }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.2, ease: "linear" }}
            >
              🪙
            </motion.div>
          ))}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="fixed pointer-events-none z-0 text-lg"
              style={{ left: `${15 + i * 25}%`, top: `${10 + i * 20}%` }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.04, 0.1, 0.04]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
      {variant === "galaxy" && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="fixed pointer-events-none z-0"
              style={{ 
                left: `${5 + (i * 4.5) % 90}%`, 
                top: `${(i * 7) % 90}%`,
                fontSize: i % 3 === 0 ? '24px' : i % 3 === 1 ? '16px' : '12px'
              }}
              animate={{ 
                opacity: [0.03, 0.15, 0.03], 
                scale: [1, 1.5, 1],
                y: [0, -10, 0]
              }}
              transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
            >
              {i % 4 === 0 ? '✦' : i % 4 === 1 ? '⭐' : i % 4 === 2 ? '✨' : '🌟'}
            </motion.div>
          ))}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`planet-${i}`}
              className="fixed pointer-events-none z-0 text-4xl opacity-[0.08]"
              style={{ 
                left: `${10 + i * 12}%`, 
                top: `${20 + (i % 3) * 25}%` 
              }}
              animate={{ 
                x: [0, 20, 0],
                y: [0, -15, 0]
              }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            >
              {["🪐", "🌍", "🌙", "☄️", "💫", "🔮", "💎", "🌌"][i]}
            </motion.div>
          ))}
        </>
      )}
      {variant === "knowledge" && (
        <>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`book-${i}`}
              className="fixed pointer-events-none z-0 text-3xl"
              style={{ 
                right: `${5 + i * 9}%`, 
                top: `${10 + (i % 4) * 22}%` 
              }}
              animate={{ 
                y: [0, -25, 0], 
                rotate: [-3, 3, -3],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{ duration: 5 + (i % 3), repeat: Infinity, delay: i * 0.6 }}
            >
              {["📚", "📖", "📕", "📗", "📘", "📙", "📓", "📔", "📒", "📑"][i]}
            </motion.div>
          ))}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`elem-${i}`}
              className="fixed pointer-events-none z-0 text-2xl"
              style={{ 
                left: `${8 + i * 15}%`, 
                top: `${15 + (i % 3) * 28}%` 
              }}
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
                opacity: [0.04, 0.08, 0.04]
              }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            >
              {["✏️", "📝", "🖊️", "🔍", "💡", "🎓"][i]}
            </motion.div>
          ))}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="fixed pointer-events-none z-0 text-lg"
              style={{ left: `${20 + i * 20}%`, top: `${30 + i * 15}%` }}
              animate={{ 
                opacity: [0.03, 0.08, 0.03],
                scale: [1, 1.3, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
      {variant === "cams" && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`doc-${i}`}
              className="fixed pointer-events-none z-0 text-4xl opacity-[0.04]"
              initial={{ y: "100vh", x: `${20 + i * 20}vw` }}
              animate={{ y: "-20vh" }}
              transition={{ duration: 12 + i * 3, repeat: Infinity, delay: i * 2, ease: "linear" }}
            >
              📄
            </motion.div>
          ))}
        </>
      )}
      {variant === "books" && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`book-${i}`}
              className="fixed pointer-events-none z-0 text-4xl"
              style={{ 
                left: `${5 + i * 12}%`, 
                top: `${15 + (i % 5) * 18}%` 
              }}
              animate={{ 
                y: [0, -20, 0], 
                rotate: [-2, 2, -2],
                opacity: [0.06, 0.12, 0.06]
              }}
              transition={{ duration: 6 + (i % 3), repeat: Infinity, delay: i * 0.5 }}
            >
              {["📚", "📖", "📕", "📗", "📘", "📙", "📓", "📔"][i]}
            </motion.div>
          ))}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`reading-${i}`}
              className="fixed pointer-events-none z-0 text-2xl"
              style={{ 
                right: `${8 + i * 14}%`, 
                top: `${20 + (i % 4) * 20}%` 
              }}
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
                opacity: [0.05, 0.09, 0.05]
              }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            >
              {["📜", "📃", "🗒️", "📋", "📄", "📑"][i]}
            </motion.div>
          ))}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`lamp-${i}`}
              className="fixed pointer-events-none z-0 text-xl"
              style={{ left: `${12 + i * 18}%`, top: `${25 + i * 12}%` }}
              animate={{ 
                opacity: [0.04, 0.1, 0.04],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
            >
              {["🕯️", "💡", "🔮", "📎", "🖋️"][i]}
            </motion.div>
          ))}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="fixed pointer-events-none z-0 text-base"
              style={{ left: `${15 + i * 22}%`, top: `${35 + i * 10}%` }}
              animate={{ 
                opacity: [0.03, 0.07, 0.03]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
    </>
  );
}
