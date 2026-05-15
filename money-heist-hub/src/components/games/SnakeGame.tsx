import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

const GRID = 20;
const CANVAS_SIZE = 400;
const SPEED = 100;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const snakeRef = useRef<Point[]>([{ x: 200, y: 200 }]);
  const dirRef = useRef<Point>({ x: GRID, y: 0 });
  const appleRef = useRef<Point>({ x: 100, y: 100 });
  const intervalRef = useRef<number>();

  const randomApple = useCallback(() => {
    return {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID)) * GRID,
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID)) * GRID,
    };
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const snake = snakeRef.current;
    const dir = dirRef.current;
    const apple = appleRef.current;

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wrap around
    if (head.x < 0) head.x = CANVAS_SIZE - GRID;
    if (head.x >= CANVAS_SIZE) head.x = 0;
    if (head.y < 0) head.y = CANVAS_SIZE - GRID;
    if (head.y >= CANVAS_SIZE) head.y = 0;

    // Check self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      setGameOver(true);
      clearInterval(intervalRef.current);
      return;
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
      setScore((s) => s + 10);
      appleRef.current = randomApple();
    } else {
      snake.pop();
    }

    // Draw
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid lines
    ctx.strokeStyle = "rgba(229, 9, 20, 0.1)";
    for (let i = 0; i < CANVAS_SIZE; i += GRID) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
    }

    // Apple (coin)
    ctx.fillStyle = "#E50914";
    ctx.beginPath();
    ctx.arc(apple.x + GRID / 2, apple.y + GRID / 2, GRID / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFD700";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("₹", apple.x + GRID / 2, apple.y + GRID / 2 + 4);

    // Snake
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#00FFCC" : `rgba(0, 255, 204, ${1 - i * 0.03})`;
      ctx.fillRect(s.x + 1, s.y + 1, GRID - 2, GRID - 2);
    });
  }, [randomApple]);

  const startGame = useCallback(() => {
    snakeRef.current = [{ x: 200, y: 200 }];
    dirRef.current = { x: GRID, y: 0 };
    appleRef.current = randomApple();
    setScore(0);
    setGameOver(false);
    setStarted(true);
    clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(draw, SPEED);
  }, [draw, randomApple]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const dir = dirRef.current;
      if (e.key === "ArrowUp" && dir.y === 0) dirRef.current = { x: 0, y: -GRID };
      if (e.key === "ArrowDown" && dir.y === 0) dirRef.current = { x: 0, y: GRID };
      if (e.key === "ArrowLeft" && dir.x === 0) dirRef.current = { x: -GRID, y: 0 };
      if (e.key === "ArrowRight" && dir.x === 0) dirRef.current = { x: GRID, y: 0 };
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      clearInterval(intervalRef.current);
    };
  }, []);

  // Touch controls
  const touchStart = useRef<Point | null>(null);

  return (
    <div className="heist-card max-w-lg mx-auto text-center">
      <h2 className="heist-title text-2xl text-foreground mb-2">🐍 SNAKE: MONEY COLLECTOR</h2>
      <p className="heist-mono text-primary text-xl mb-4">SCORE: {score}</p>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="mx-auto border-2 border-primary rounded shadow-[0_0_20px_hsl(var(--heist-red)/0.3)]"
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          if (!touchStart.current) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - touchStart.current.x;
          const dy = t.clientY - touchStart.current.y;
          const dir = dirRef.current;
          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && dir.x === 0) dirRef.current = { x: GRID, y: 0 };
            if (dx < 0 && dir.x === 0) dirRef.current = { x: -GRID, y: 0 };
          } else {
            if (dy > 0 && dir.y === 0) dirRef.current = { x: 0, y: GRID };
            if (dy < 0 && dir.y === 0) dirRef.current = { x: 0, y: -GRID };
          }
        }}
      />
      {gameOver && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary text-xl mt-4 heist-mono">
          GAME OVER! Score: {score}
        </motion.p>
      )}
      <button onClick={startGame} className="mt-4 px-8 py-3 bg-primary text-primary-foreground font-bold rounded heist-mono">
        {started ? "RESTART" : "START GAME"}
      </button>
      <p className="text-xs text-muted-foreground mt-3">Use arrow keys or swipe to control</p>

      {/* Mobile directional buttons */}
      <div className="mt-4 flex flex-col items-center gap-2 md:hidden">
        <button onClick={() => dirRef.current.y === 0 && (dirRef.current = { x: 0, y: -GRID })} className="px-6 py-2 bg-secondary text-foreground rounded border border-border">↑</button>
        <div className="flex gap-4">
          <button onClick={() => dirRef.current.x === 0 && (dirRef.current = { x: -GRID, y: 0 })} className="px-6 py-2 bg-secondary text-foreground rounded border border-border">←</button>
          <button onClick={() => dirRef.current.x === 0 && (dirRef.current = { x: GRID, y: 0 })} className="px-6 py-2 bg-secondary text-foreground rounded border border-border">→</button>
        </div>
        <button onClick={() => dirRef.current.y === 0 && (dirRef.current = { x: 0, y: GRID })} className="px-6 py-2 bg-secondary text-foreground rounded border border-border">↓</button>
      </div>
    </div>
  );
}
