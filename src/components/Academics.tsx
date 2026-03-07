"use client";

import { motion } from "framer-motion";

const modules = [
  { name: "Introduction to Programming with Python", score: 83, grade: "Distinction" },
  { name: "Digital World", score: 81, grade: "Distinction" },
  { name: "Introduction to Computer Science", score: 78, grade: "Distinction" },
  { name: "Study and Presentation Skills", score: 76, grade: "Distinction" },
  { name: "Mathematical Skills for Computing", score: 51, grade: "Pass" },
];

function ScoreRing({ score, delay, id, grade }: { score: number; delay: number; id: string; grade: string }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="relative flex-shrink-0 flex items-center justify-center"
      style={{
        width: "clamp(3rem, 7vw, 5rem)",
        height: "clamp(3rem, 7vw, 5rem)",
      }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a1a" strokeWidth="4" />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={grade === "Distinction" ? "#00E5FF" : "#888"} />
            <stop offset="100%" stopColor={grade === "Distinction" ? "#00B4D8" : "#666"} />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="relative text-white font-light"
        style={{ fontSize: "clamp(0.75rem, 1.6vw, 1rem)" }}
      >
        {score}
      </span>
    </div>
  );
}

export function Academics() {
  return (
    <section
      id="academics"
      className="relative"
      style={{ padding: "clamp(3rem, 8vh, 8rem) clamp(1.25rem, 5vw, 6rem)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "64rem" }}>
        <motion.div
          className="text-center"
          style={{ marginBottom: "clamp(1.5rem, 4vw, 4rem)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-[#555] uppercase font-sans"
            style={{ fontSize: "clamp(0.6rem, 1.1vw, 0.75rem)", letterSpacing: "0.3em" }}
          >
            Academic Excellence
          </span>
          <h2
            className="font-serif font-light"
            style={{
              fontSize: "clamp(1.5rem, 4.5vw, 3rem)",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            L3 Diploma in{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B4D8]">
              Computing
            </span>
          </h2>
          <p
            className="text-[#666] mx-auto"
            style={{
              fontSize: "clamp(0.7rem, 1.3vw, 0.875rem)",
              maxWidth: "32rem",
              lineHeight: 1.7,
            }}
          >
            KMD College, Myanmar &mdash; NCC Education, UK
          </p>
          <div
            className="inline-flex items-center rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/[0.04]"
            style={{
              marginTop: "clamp(0.5rem, 1.5vw, 1rem)",
              padding: "clamp(0.2rem, 0.5vw, 0.375rem) clamp(0.5rem, 1.2vw, 1rem)",
              gap: "clamp(0.25rem, 0.5vw, 0.5rem)",
            }}
          >
            <div
              className="rounded-full bg-[#00E5FF] animate-pulse"
              style={{ width: "clamp(4px, 0.5vw, 6px)", height: "clamp(4px, 0.5vw, 6px)" }}
            />
            <span
              className="text-[#00E5FF] uppercase font-medium"
              style={{ fontSize: "clamp(0.55rem, 0.9vw, 0.7rem)", letterSpacing: "0.1em" }}
            >
              Distinction
            </span>
          </div>
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: "clamp(0.5rem, 1.2vw, 1rem)" }}
        >
          {modules.map((mod, i) => (
            <motion.div
              key={mod.name}
              className={`group relative bg-[#0c0c0c] flex items-center transition-all duration-500 hover:border-[#00E5FF]/15 hover:shadow-[0_0_40px_rgba(0,229,255,0.06)] ${
                i === modules.length - 1 && modules.length % 2 !== 0 ? "sm:col-span-2 sm:max-w-[50%] sm:mx-auto" : ""
              }`}
              style={{
                borderRadius: "clamp(8px, 1.2vw, 12px)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "clamp(0.75rem, 2vw, 1.5rem)",
                gap: "clamp(0.5rem, 1.5vw, 1.25rem)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className="absolute top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ left: "1.5rem", right: "1.5rem" }}
              />

              <ScoreRing score={mod.score} delay={0.2 + i * 0.1} id={`grad-${i}`} grade={mod.grade} />

              <div className="flex-1 min-w-0">
                <h3
                  className="text-white font-medium leading-snug"
                  style={{
                    fontSize: "clamp(0.7rem, 1.2vw, 0.875rem)",
                    marginBottom: "clamp(0.15rem, 0.4vw, 0.375rem)",
                  }}
                >
                  {mod.name}
                </h3>
                <div className="flex items-center" style={{ gap: "clamp(0.2rem, 0.4vw, 0.4rem)" }}>
                  {mod.grade === "Distinction" && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ width: "clamp(0.7rem, 1.1vw, 0.875rem)", height: "clamp(0.7rem, 1.1vw, 0.875rem)", flexShrink: 0 }}
                    >
                      <path
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                        stroke="#00E5FF"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <span
                    className={`${mod.grade === "Distinction" ? "text-[#00E5FF]/70" : "text-[#888]"} uppercase`}
                    style={{ fontSize: "clamp(0.55rem, 0.9vw, 0.7rem)", letterSpacing: "0.1em" }}
                  >
                    {mod.grade}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
