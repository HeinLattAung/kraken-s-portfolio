"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const KRAKEN_PATHS = [
  "M 10 10 L 10 50 M 10 30 L 30 10 M 10 30 L 30 50",
  "M 40 10 L 40 50 M 40 10 L 55 10 Q 62 10 62 20 Q 62 30 55 30 L 40 30 M 50 30 L 62 50",
  "M 72 50 L 82 10 L 92 50 M 76 35 L 88 35",
  "M 102 10 L 102 50 M 102 30 L 122 10 M 102 30 L 122 50",
  "M 132 10 L 132 50 M 132 10 L 152 10 M 132 30 L 148 30 M 132 50 L 152 50",
  "M 162 50 L 162 10 L 182 50 L 182 10",
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "shockwave" | "name" | "done">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("shockwave"), 1600);
    const t2 = setTimeout(() => setPhase("name"), 2000);
    const t3 = setTimeout(() => setPhase("done"), 3200);
    const t4 = setTimeout(onComplete, 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black"
          style={{ width: "100vw", height: "100dvh" }}
          exit={{ scale: 1.05, opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Shockwave ring */}
          <AnimatePresence>
            {(phase === "shockwave" || phase === "name") && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  border: "1px solid rgba(0, 229, 255, 0.4)",
                  boxShadow: "0 0 60px rgba(0, 229, 255, 0.2), inset 0 0 60px rgba(0, 229, 255, 0.1)",
                }}
                initial={{ width: 0, height: 0, opacity: 1 }}
                animate={{ width: "min(600px, 90vw)", height: "min(600px, 90vw)", opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          {/* Center glow pulse */}
          <AnimatePresence>
            {(phase === "shockwave" || phase === "name") && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 200,
                  height: 200,
                  background: "radial-gradient(circle, rgba(0, 229, 255, 0.3) 0%, transparent 70%)",
                  filter: "blur(40px)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 1.5], opacity: [0, 0.8, 0] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          {/* KRAKEN SVG */}
          <motion.svg
            viewBox="0 0 192 60"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              width: "clamp(14rem, 40vw, 24rem)",
              height: "auto",
              marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
            }}
          >
            {KRAKEN_PATHS.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 1.2, ease: "easeInOut", delay: i * 0.15 },
                  opacity: { duration: 0.1, delay: i * 0.15 },
                }}
              />
            ))}
            {KRAKEN_PATHS.map((d, i) => (
              <motion.path
                key={`glow-${i}`}
                d={d}
                stroke="#00E5FF"
                strokeWidth="4"
                opacity="0.3"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{
                  pathLength: { duration: 1.2, ease: "easeInOut", delay: i * 0.15 },
                  opacity: { duration: 0.1, delay: i * 0.15 },
                }}
              />
            ))}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </motion.svg>

          {/* Name reveal */}
          <AnimatePresence>
            {phase === "name" && (
              <motion.div
                className="flex flex-wrap items-center justify-center"
                style={{ gap: "clamp(0.5rem, 2vw, 1rem)" }}
                exit={{ opacity: 0, y: -10 }}
              >
                {["HEIN", "LATT", "AUNG"].map((word, i) => (
                  <motion.span
                    key={word}
                    className="font-serif text-white font-light"
                    style={{
                      fontSize: "clamp(1.25rem, 4vw, 2.5rem)",
                      letterSpacing: "0.3em",
                    }}
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtitle */}
          <AnimatePresence>
            {phase === "name" && (
              <motion.p
                className="text-[#00E5FF]/50 uppercase font-sans"
                style={{
                  fontSize: "clamp(0.55rem, 1.2vw, 0.75rem)",
                  letterSpacing: "0.5em",
                  marginTop: "clamp(0.75rem, 1.5vh, 1.25rem)",
                }}
                initial={{ opacity: 0, letterSpacing: "1em" }}
                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                exit={{ opacity: 0 }}
              >
                Full Stack Developer
              </motion.p>
            )}
          </AnimatePresence>

          {/* Horizontal line accent */}
          <motion.div
            className="absolute"
            style={{
              bottom: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.3), transparent)",
            }}
            initial={{ width: 0 }}
            animate={{ width: "clamp(100px, 30vw, 300px)" }}
            transition={{ delay: 2.2, duration: 1, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
