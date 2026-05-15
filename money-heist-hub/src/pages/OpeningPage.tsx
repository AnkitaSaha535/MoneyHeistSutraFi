import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useHeist } from "@/context/HeistContext";

export default function OpeningPage() {
  const navigate = useNavigate();
  const { startHeist } = useHeist();

  const handleEnter = () => {
    startHeist();
    navigate("/intro");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="matrix-overlay" />
      <div className="scan-line" />

      <div className="relative z-10 text-center px-4">
        <motion.h1
          className="heist-title text-6xl md:text-8xl text-primary mb-4"
          animate={{
            textShadow: [
              "0 0 20px hsl(358 93% 45% / 0.4)",
              "0 0 40px hsl(358 93% 45% / 0.8)",
              "0 0 60px hsl(358 93% 45% / 0.4)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SutraFi
        </motion.h1>

        <motion.p
          className="heist-mono text-lg md:text-xl text-primary/70 mb-12 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          PLAN YOUR FINANCIAL HEIST
        </motion.p>

        <motion.div
          className="mb-12"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <svg width="200" height="280" viewBox="0 0 200 280" className="mx-auto">
            <defs>
              <linearGradient id="professorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4444" />
                <stop offset="100%" stopColor="#CC0000" />
              </linearGradient>
              <filter id="professorGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="maskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F5F5DC" />
                <stop offset="100%" stopColor="#D4C4A8" />
              </linearGradient>
            </defs>

            <motion.g
              animate={{
                y: [0, -10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              filter="url(#professorGlow)"
            >
              <ellipse cx="100" cy="270" rx="40" ry="8" fill="rgba(0,0,0,0.5)" />

              <rect x="60" y="100" width="80" height="110" rx="10" fill="url(#professorGradient)" />
              <rect x="65" y="105" width="70" height="40" rx="5" fill="#FFE66D" />
              <rect x="70" y="110" width="60" height="10" rx="3" fill="#FF6B6B" />
              <rect x="70" y="125" width="30" height="10" rx="2" fill="#4ECDC4" />

              <rect x="45" y="110" width="20" height="10" rx="3" fill="url(#professorGradient)" />
              <rect x="135" y="110" width="20" height="10" rx="3" fill="url(#professorGradient)" />
              <rect x="70" y="150" width="25" height="10" rx="3" fill="#FFE66D" />
              <rect x="105" y="150" width="25" height="10" rx="3" fill="#FFE66D" />

              <ellipse cx="100" cy="55" rx="35" ry="40" fill="url(#maskGradient)" />

              <ellipse cx="85" cy="50" rx="12" ry="15" fill="#1a1a1a" />
              <ellipse cx="115" cy="50" rx="12" ry="15" fill="#1a1a1a" />

              <ellipse cx="85" cy="50" rx="6" ry="8" fill="#333" />
              <ellipse cx="115" cy="50" rx="6" ry="8" fill="#333" />
              <circle cx="85" cy="50" r="2" fill="#fff" />
              <circle cx="115" cy="50" r="2" fill="#fff" />

              <path
                d="M85 35 Q100 25 115 35"
                stroke="#8B7355"
                strokeWidth="4"
                fill="none"
              />

              <ellipse cx="85" cy="70" rx="4" ry="2" fill="#D4C4A8" />
              <ellipse cx="115" cy="70" rx="4" ry="2" fill="#D4C4A8" />

              <path
                d="M90 80 Q100 85 110 80"
                stroke="#8B7355"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />

              <ellipse cx="100" cy="15" rx="25" ry="8" fill="#2C3E50" />
              <ellipse cx="100" cy="12" rx="22" ry="5" fill="#34495E" />

              <rect x="40" y="115" width="15" height="70" rx="5" fill="url(#professorGradient)" />
              <rect x="145" y="115" width="15" height="70" rx="5" fill="url(#professorGradient)" />

              <rect x="65" y="210" width="30" height="50" rx="5" fill="url(#professorGradient)" />
              <rect x="105" y="210" width="30" height="50" rx="5" fill="url(#professorGradient)" />

              <rect x="85" y="180" width="30" height="8" rx="2" fill="#2C3E50" />
              <rect x="85" y="195" width="30" height="8" rx="2" fill="#2C3E50" />

              <motion.g
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ transformOrigin: '100px 60px' }}
              >
                <rect x="75" y="5" width="50" height="8" rx="2" fill="#1a1a1a" />
              </motion.g>

              <motion.g
                animate={{
                  x: [0, 10, 0],
                  y: [0, -5, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: '170px 80px' }}
              >
                <rect x="160" y="70" width="30" height="20" rx="3" fill="#8B4513" />
                <rect x="163" y="73" width="24" height="14" rx="2" fill="#A0522D" />
                <text x="168" y="84" fontSize="10" fill="#FFE66D" fontWeight="bold">₹</text>
              </motion.g>
            </motion.g>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={handleEnter}
            className="px-12 py-5 bg-primary text-primary-foreground font-bold text-xl rounded-lg heist-mono tracking-widest uppercase relative overflow-hidden group hover:scale-105 transition-transform"
          >
            ENTER SUTRAFI
          </button>
        </motion.div>

        <div className="flex justify-center gap-4 mt-12">
          {["💰", "📈", "🎯", "🏦"].map((emoji, i) => (
            <motion.span
              key={i}
              className="text-3xl"
              animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -5, 0] }}
              transition={{ delay: 1 + i * 0.2, duration: 2, repeat: Infinity }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <motion.p
          className="text-sm text-muted-foreground mt-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Your ultimate financial planning companion. Plan, track, and achieve your money goals.
        </motion.p>
      </div>
    </div>
  );
}
