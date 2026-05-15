import { motion } from "framer-motion";
import { useHeist } from "@/context/HeistContext";
import { useNavigate } from "react-router-dom";

const moneySymbols = ["$", "€", "£", "¥", "₹", "₿", "💵", "💰", "🪙", "💎"];

export default function SplashPage() {
  const { startHeist } = useHeist();
  const navigate = useNavigate();

  const handleStart = () => {
    startHeist();
    navigate("/intro");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Floating Money Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {moneySymbols.map((symbol, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-[0.08]"
            initial={{ y: "110vh", x: `${5 + (i * 9) % 90}vw` }}
            animate={{ y: "-10vh", rotate: [0, 180, 360] }}
            transition={{
              duration: 15 + (i % 5) * 3,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
          >
            {symbol}
          </motion.div>
        ))}
        
        {/* Gold Coin Circles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`coin-${i}`}
            className="absolute w-24 h-24 rounded-full border-4 border-yellow-500/10"
            style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4
            }}
          />
        ))}
        
        {/* Dollar Signs Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          {[...Array(20)].map((_, i) => (
            <span
              key={`grid-${i}`}
              className="absolute text-6xl text-green-400"
              style={{
                left: `${5 + i * 5}%`,
                top: `${10 + (i % 4) * 25}%`,
                transform: `rotate(${i % 2 === 0 ? 0 : 45}deg)`
              }}
            >
              $
            </span>
          ))}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/50" />
        
        {/* Animated Glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)"
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-emerald-400 to-yellow-400 mb-4"
          style={{ textShadow: "0 0 60px rgba(16, 185, 129, 0.5)" }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SUTRAFI
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-emerald-300/80 mb-2 tracking-widest uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your Ultimate Financial Heist
        </motion.p>
        
        <motion.p
          className="text-sm text-slate-400 mb-12 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          95% of Indians lack a financial plan. We make planning accessible for everyone.
        </motion.p>
        
        <motion.button
          onClick={handleStart}
          className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xl rounded-lg shadow-lg shadow-emerald-500/30 relative overflow-hidden group"
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(16, 185, 129, 0.6)" }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span className="relative z-10 tracking-widest">ENTER SUTRAFI</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-300"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.3 }}
            style={{ opacity: 0.2 }}
          />
        </motion.button>
      </div>
      
      {/* Money Icons at Bottom */}
      <div className="absolute bottom-8 flex gap-4 text-3xl opacity-30">
        {["💰", "💵", "🪙", "💎", "📈", "🏦"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
