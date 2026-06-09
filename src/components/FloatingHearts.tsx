import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface HearthParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: "heart" | "petal" | "sparkle";
}

export default function FloatingHearts({ active = true }: { active?: boolean }) {
  const [particles, setParticles] = useState<HearthParticle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Generate cute elements scattered on screen
    const items: HearthParticle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage x-axis
      y: Math.random() * 40 + 60, // starting lower half of screen
      size: Math.random() * 20 + 10, // size in px
      delay: Math.random() * 5,
      duration: Math.random() * 12 + 8,
      type: i % 3 === 0 ? "heart" : i % 3 === 1 ? "petal" : "sparkle"
    }));

    setParticles(items);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => {
        const style = {
          left: `${p.x}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
        };

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full text-rose-300 opacity-60"
            style={style}
            initial={{ y: "110vh", opacity: 0, rotate: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.6, 0.8, 0.6, 0],
              x: [`${p.x}%`, `${p.x + (Math.random() * 20 - 10)}%`, `${p.x + (Math.random() * 40 - 20)}%`],
              rotate: [0, Math.random() * 180 - 90, Math.random() * 360 - 180]
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {p.type === "heart" && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-rose-400/50 drop-shadow-sm">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
            {p.type === "petal" && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-pink-300/40 drop-shadow-sm">
                <path d="M12 2C12 2 3 9 3 14c0 4.97 4.03 9 9 9s9-4.03 9-9c0-5-9-12-9-12z" />
              </svg>
            )}
            {p.type === "sparkle" && (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-amber-200/50 animate-pulse">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
