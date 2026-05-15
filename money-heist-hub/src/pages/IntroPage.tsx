import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const moneySymbols = ["$", "€", "£", "¥", "₹", "₿", "💵", "💰", "🪙", "💎"];

export default function IntroPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Money Symbols */}
        {moneySymbols.map((symbol, i) => (
          <motion.div
            key={`float-${i}`}
            className="absolute text-3xl opacity-[0.06]"
            initial={{ y: "110vh", x: `${5 + (i * 9) % 90}vw` }}
            animate={{ y: "-10vh", rotate: [0, 180, 360] }}
            transition={{
              duration: 12 + (i % 4) * 3,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "linear"
            }}
          >
            {symbol}
          </motion.div>
        ))}
        
        {/* Blue Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-yellow-900/20" />
        
        {/* Animated Glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)"
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <svg width="180" height="250" viewBox="0 0 200 280" className="mx-auto">
            <defs>
              <linearGradient id="introGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <filter id="introGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="maskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F5F5DC" />
                <stop offset="100%" stopColor="#D4C4A8" />
              </linearGradient>
            </defs>

            <motion.g
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              filter="url(#introGlow)"
            >
              <ellipse cx="100" cy="270" rx="35" ry="6" fill="rgba(0,0,0,0.5)" />

              <rect x="65" y="105" width="70" height="95" rx="8" fill="url(#introGradient)" />
              <rect x="70" y="110" width="60" height="35" rx="4" fill="#FFE66D" />
              <rect x="75" y="115" width="50" height="8" rx="2" fill="#FF6B6B" />
              <rect x="75" y="128" width="25" height="8" rx="2" fill="#4ECDC4" />

              <rect x="50" y="115" width="18" height="8" rx="3" fill="url(#introGradient)" />
              <rect x="132" y="115" width="18" height="8" rx="3" fill="url(#introGradient)" />
              <rect x="75" y="150" width="22" height="8" rx="3" fill="#FFE66D" />
              <rect x="103" y="150" width="22" height="8" rx="3" fill="#FFE66D" />

              <ellipse cx="100" cy="60" rx="30" ry="35" fill="url(#maskGrad)" />

              <ellipse cx="88" cy="55" rx="10" ry="12" fill="#1a1a1a" />
              <ellipse cx="112" cy="55" rx="10" ry="12" fill="#1a1a1a" />
              <ellipse cx="88" cy="55" rx="5" ry="6" fill="#333" />
              <ellipse cx="112" cy="55" rx="5" ry="6" fill="#333" />
              <circle cx="88" cy="55" r="2" fill="#fff" />
              <circle cx="112" cy="55" r="2" fill="#fff" />

              <path d="M88 40 Q100 30 112 40" stroke="#8B7355" strokeWidth="3" fill="none" />

              <ellipse cx="88" cy="72" rx="3" ry="1.5" fill="#D4C4A8" />
              <ellipse cx="112" cy="72" rx="3" ry="1.5" fill="#D4C4A8" />
              <path d="M92 82 Q100 86 108 82" stroke="#8B7355" strokeWidth="2" fill="none" strokeLinecap="round" />

              <ellipse cx="100" cy="22" rx="22" ry="7" fill="#1e40af" />
              <ellipse cx="100" cy="20" rx="19" ry="4" fill="#2563eb" />

              <rect x="48" y="118" width="12" height="60" rx="4" fill="url(#introGradient)" />
              <rect x="140" y="118" width="12" height="60" rx="4" fill="url(#introGradient)" />

              <rect x="70" y="200" width="25" height="45" rx="4" fill="url(#introGradient)" />
              <rect x="105" y="200" width="25" height="45" rx="4" fill="url(#introGradient)" />

              <rect x="88" y="175" width="24" height="6" rx="2" fill="#1e40af" />
              <rect x="88" y="188" width="24" height="6" rx="2" fill="#1e40af" />
            </motion.g>
          </svg>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 mb-4"
          style={{ textShadow: "0 0 60px rgba(251, 191, 36, 0.5)" }}
          animate={{
            textShadow: [
              "0 0 20px rgba(251, 191, 36, 0.4)",
              "0 0 40px rgba(251, 191, 36, 0.8)",
              "0 0 60px rgba(251, 191, 36, 0.4)"
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          SUTRAFI
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-blue-300/80 mb-8 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your Financial Heist Begins
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="w-3 h-3 bg-yellow-400 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="w-3 h-3 bg-yellow-400/60 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 bg-yellow-400/30 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-64 mx-auto bg-slate-800/50 rounded-full h-1 overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.5, ease: "linear" }}
          />
        </motion.div>

        <motion.button
          onClick={handleSkip}
          className="mt-6 px-6 py-2 text-sm text-blue-300/70 hover:text-yellow-400 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Skip intro →
        </motion.button>
      </div>

      {/* Money Emojis Floating */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`emoji-${i}`}
          className="fixed pointer-events-none text-4xl opacity-[0.08]"
          initial={{ y: "110vh", x: `${10 + i * 15}vw` }}
          animate={{ y: "-10vh" }}
          transition={{ duration: 15 + i * 2, repeat: Infinity, delay: i * 2, ease: "linear" }}
        >
          {["₹", "💰", "🏦", "💎", "📈", "🪙"][i]}
        </motion.div>
      ))}

      <motion.div
        className="fixed bottom-10 left-1/2 -translate-x-1/2 text-6xl"
        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        💰
      </motion.div>
    </div>
  );
}
