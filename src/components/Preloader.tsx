"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   CINEMATIC CANVAS — particles, rays, light sweep
   ═══════════════════════════════════════════════ */

interface Mote {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  drift: number;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}

function CinematicCanvas({ phaseRef }: { phaseRef: React.RefObject<string> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const motesRef = useRef<Mote[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const startRef = useRef(0);

  const init = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Floating dust motes
    motesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -(Math.random() * 0.2 + 0.08),
      size: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.25 + 0.05,
      drift: Math.random() * Math.PI * 2,
    }));

    // Name-burst sparks (spawn later)
    sparksRef.current = [];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    init();
    startRef.current = performance.now();
    let sparkSpawned = false;

    const draw = () => {
      const now = performance.now();
      const t = (now - startRef.current) / 1000;
      ctx.clearRect(0, 0, w, h);
      const phase = phaseRef.current;

      // ── Volumetric light rays from center ──
      if (t > 0.3) {
        const rayAlpha = Math.min(0.03, (t - 0.3) * 0.015);
        const rayCount = 6;
        for (let i = 0; i < rayCount; i++) {
          const angle = (Math.PI * 2 / rayCount) * i + t * 0.02;
          const len = Math.min(w, h) * 0.6;
          const spread = 0.04;
          ctx.beginPath();
          ctx.moveTo(w / 2, h / 2);
          ctx.lineTo(
            w / 2 + Math.cos(angle - spread) * len,
            h / 2 + Math.sin(angle - spread) * len
          );
          ctx.lineTo(
            w / 2 + Math.cos(angle + spread) * len,
            h / 2 + Math.sin(angle + spread) * len
          );
          ctx.closePath();
          const rayGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, len);
          rayGrad.addColorStop(0, `rgba(20, 70, 160, ${rayAlpha})`);
          rayGrad.addColorStop(0.5, `rgba(15, 50, 120, ${rayAlpha * 0.5})`);
          rayGrad.addColorStop(1, "transparent");
          ctx.fillStyle = rayGrad;
          ctx.fill();
        }
      }

      // ── Central glow orb — pulses ──
      if (t > 0.2) {
        const pulse = Math.sin(t * 1.5) * 0.3 + 0.7;
        const orbAlpha = Math.min(0.06, (t - 0.2) * 0.02) * pulse;
        const orbGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.3);
        orbGrad.addColorStop(0, `rgba(30, 80, 180, ${orbAlpha})`);
        orbGrad.addColorStop(0.4, `rgba(20, 60, 140, ${orbAlpha * 0.5})`);
        orbGrad.addColorStop(1, "transparent");
        ctx.fillStyle = orbGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Floating dust motes ──
      for (const m of motesRef.current) {
        m.x += m.vx + Math.sin(t * 0.5 + m.drift) * 0.05;
        m.y += m.vy;
        if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
        if (m.x < -10) m.x = w + 10;
        if (m.x > w + 10) m.x = -10;

        const pulse = Math.sin(t * 0.8 + m.drift) * 0.3 + 0.7;
        const alpha = m.opacity * pulse;

        // Mote with soft glow
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size + 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 130, 180, ${alpha * 0.15})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(170, 180, 210, ${alpha})`;
        ctx.fill();
      }

      // ── Spawn burst sparks when name appears ──
      if (phase === "name" && !sparkSpawned) {
        sparkSpawned = true;
        const cx = w / 2;
        const cy = h / 2;
        for (let i = 0; i < 50; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 3 + 1;
          sparksRef.current.push({
            x: cx + (Math.random() - 0.5) * w * 0.4,
            y: cy + (Math.random() - 0.5) * 30,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.5,
            life: 1,
            maxLife: 1,
            size: Math.random() * 2 + 0.5,
          });
        }
      }

      // ── Draw & update sparks ──
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;
        s.vy *= 0.97;
        s.life -= 0.008;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }

        const alpha = s.life * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80, 130, 220, ${alpha})`;
        ctx.fill();
      }

      // ── Horizontal light sweep (scanner effect) ──
      if (t > 2.0 && t < 4.0) {
        const progress = (t - 2.0) / 2.0;
        const sweepX = progress * w;
        const sweepGrad = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0);
        sweepGrad.addColorStop(0, "transparent");
        sweepGrad.addColorStop(0.4, `rgba(60, 120, 220, 0.04)`);
        sweepGrad.addColorStop(0.5, `rgba(120, 160, 240, 0.08)`);
        sweepGrad.addColorStop(0.6, `rgba(60, 120, 220, 0.04)`);
        sweepGrad.addColorStop(1, "transparent");
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, h * 0.3, w, h * 0.4);
      }

      // ── Architectural grid lines (very faint) ──
      if (t > 0.8) {
        const gridAlpha = Math.min(0.025, (t - 0.8) * 0.01);
        ctx.strokeStyle = `rgba(80, 100, 140, ${gridAlpha})`;
        ctx.lineWidth = 0.3;
        // Vertical center guides
        ctx.beginPath();
        ctx.moveTo(w * 0.2, 0); ctx.lineTo(w * 0.2, h);
        ctx.moveTo(w * 0.8, 0); ctx.lineTo(w * 0.8, h);
        // Horizontal center guide
        ctx.moveTo(0, h * 0.5); ctx.lineTo(w, h * 0.5);
        ctx.stroke();
      }

      // ── Exit: radial burst ──
      if (phase === "exit") {
        const burstAlpha = 0.1;
        const burstGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5);
        burstGrad.addColorStop(0, `rgba(30, 80, 180, ${burstAlpha})`);
        burstGrad.addColorStop(1, "transparent");
        ctx.fillStyle = burstGrad;
        ctx.fillRect(0, 0, w, h);
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [init, phaseRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ═══════════════════════════════════════════════
   LOADING COUNTER — counts 0-100 with easing
   ═══════════════════════════════════════════════ */

function LoadingCounter({ duration, delay }: { duration: number; delay: number }) {
  const [value, setValue] = useState(0);
  const startRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const start = performance.now() + delay * 1000;
    startRef.current = start;

    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      if (elapsed < 0) { frameRef.current = requestAnimationFrame(tick); return; }
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * 100));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [duration, delay]);

  return (
    <motion.span
      className="font-sans tabular-nums"
      style={{
        fontSize: "clamp(0.5rem, 0.8vw, 0.6rem)",
        letterSpacing: "0.3em",
        color: "rgba(80, 95, 125, 0.35)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      {String(value).padStart(3, "0")}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PRELOADER COMPONENT
   ═══════════════════════════════════════════════ */

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<
    "blackout" | "ignite" | "name" | "sweep" | "subtitle" | "hold" | "exit" | "done"
  >("blackout");
  const phaseRef = useRef("blackout");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("ignite"), 300),
      setTimeout(() => setPhase("name"), 1100),
      setTimeout(() => setPhase("sweep"), 2400),
      setTimeout(() => setPhase("subtitle"), 3200),
      setTimeout(() => setPhase("hold"), 4200),
      setTimeout(() => setPhase("exit"), 4800),
      setTimeout(() => setPhase("done"), 5600),
      setTimeout(onComplete, 5800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const showIgnite = phase !== "blackout";
  const showName = !["blackout", "ignite"].includes(phase);
  const showSubtitle = !["blackout", "ignite", "name", "sweep"].includes(phase);
  const isExiting = phase === "exit";

  // Build letter stagger data
  const words = ["HEIN", "LATT", "AUNG"];
  let idx = 0;
  const wordData = words.map((word) => {
    const letters = word.split("").map((char) => {
      const delay = 0.05 * idx;
      idx++;
      return { char, delay };
    });
    idx++;
    return { word, letters };
  });

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{ width: "100%", height: "100vh", background: "#030308" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Canvas layer */}
          <CinematicCanvas phaseRef={phaseRef} />

          {/* ── Top-left corner frame ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ top: "clamp(1.5rem, 4vh, 3rem)", left: "clamp(1.5rem, 4vw, 3rem)", width: "clamp(40px, 5vw, 70px)", height: "1px", background: "linear-gradient(90deg, rgba(100, 120, 160, 0.3), transparent)", transformOrigin: "left" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: showIgnite ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute pointer-events-none"
            style={{ top: "clamp(1.5rem, 4vh, 3rem)", left: "clamp(1.5rem, 4vw, 3rem)", width: "1px", height: "clamp(40px, 5vh, 70px)", background: "linear-gradient(180deg, rgba(100, 120, 160, 0.3), transparent)", transformOrigin: "top" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: showIgnite ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* ── Bottom-right corner frame ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ bottom: "clamp(1.5rem, 4vh, 3rem)", right: "clamp(1.5rem, 4vw, 3rem)", width: "clamp(40px, 5vw, 70px)", height: "1px", background: "linear-gradient(270deg, rgba(100, 120, 160, 0.3), transparent)", transformOrigin: "right" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: showIgnite ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute pointer-events-none"
            style={{ bottom: "clamp(1.5rem, 4vh, 3rem)", right: "clamp(1.5rem, 4vw, 3rem)", width: "1px", height: "clamp(40px, 5vh, 70px)", background: "linear-gradient(0deg, rgba(100, 120, 160, 0.3), transparent)", transformOrigin: "bottom" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: showIgnite ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* ── Top-right loading counter ── */}
          <div
            className="absolute pointer-events-none"
            style={{ top: "clamp(1.5rem, 4vh, 3rem)", right: "clamp(1.5rem, 4vw, 3rem)" }}
          >
            <LoadingCounter duration={4.5} delay={0.3} />
          </div>

          {/* ── Central ignition line ── */}
          <motion.div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              height: "1px",
              zIndex: 2,
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: showIgnite ? "clamp(250px, 55vw, 700px)" : 0,
              opacity: showIgnite ? 1 : 0,
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent 0%, rgba(20, 70, 160, 0.6) 20%, rgba(160, 175, 210, 0.5) 50%, rgba(20, 70, 160, 0.6) 80%, transparent 100%)",
              }}
            />
            {/* Animated shimmer on the line */}
            <motion.div
              style={{
                position: "absolute",
                top: "-1px",
                height: "3px",
                width: "clamp(40px, 8vw, 60px)",
                background: "linear-gradient(90deg, transparent, rgba(180, 200, 240, 0.6), transparent)",
                filter: "blur(1px)",
              }}
              animate={{ left: ["-10%", "110%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            />
          </motion.div>

          {/* ── Glow bloom behind center ── */}
          {showIgnite && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "clamp(300px, 50vw, 600px)",
                height: "120px",
                background: "radial-gradient(ellipse, rgba(20, 70, 160, 0.07) 0%, transparent 70%)",
                filter: "blur(30px)",
                zIndex: 1,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}

          {/* ── Vertical accent lines (left + right) ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: "35%",
              left: "clamp(2rem, 8vw, 6rem)",
              width: "1px",
              background: "linear-gradient(180deg, transparent, rgba(40, 80, 160, 0.15), transparent)",
              transformOrigin: "top",
            }}
            initial={{ height: 0 }}
            animate={{ height: showName ? "30vh" : 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute pointer-events-none"
            style={{
              top: "35%",
              right: "clamp(2rem, 8vw, 6rem)",
              width: "1px",
              background: "linear-gradient(180deg, transparent, rgba(40, 80, 160, 0.15), transparent)",
              transformOrigin: "top",
            }}
            initial={{ height: 0 }}
            animate={{ height: showName ? "30vh" : 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* ══ NAME + SUBTITLE ══ */}
          <motion.div
            className="relative flex flex-col items-center"
            style={{ zIndex: 3 }}
            animate={{
              scale: isExiting ? 1.08 : 1,
              opacity: isExiting ? 0 : 1,
              filter: isExiting ? "blur(12px)" : "blur(0px)",
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Name reveal */}
            {showName && (
              <div
                className="flex flex-wrap items-center justify-center"
                style={{
                  gap: "clamp(0.5rem, 2vw, 1.2rem)",
                  marginBottom: "clamp(0.75rem, 1.5vh, 1.25rem)",
                  perspective: "1000px",
                  padding: "0 clamp(1rem, 4vw, 3rem)",
                }}
              >
                {wordData.map(({ word, letters }) => (
                  <div key={word} className="flex">
                    {letters.map(({ char, delay }, i) => (
                      <span key={`${word}-${i}`} className="relative inline-block overflow-hidden">
                        <motion.span
                          className="inline-block font-sans font-extralight uppercase"
                          style={{
                            fontSize: "clamp(2rem, 8vw, 6.5rem)",
                            letterSpacing: "0.18em",
                            color: "rgba(200, 210, 230, 0.12)",
                            WebkitTextStroke: "0.5px rgba(140, 155, 190, 0.18)",
                            textShadow: "0 0 60px rgba(20, 70, 160, 0.12), 0 4px 30px rgba(0,0,0,0.3)",
                            paintOrder: "stroke fill",
                          }}
                          initial={{ y: "120%", opacity: 0, rotateX: 50 }}
                          animate={{ y: "0%", opacity: 1, rotateX: 0 }}
                          transition={{
                            duration: 0.8,
                            delay,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {char}
                        </motion.span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Light sweep overlay on name (CSS animated) */}
            {showName && (
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  overflow: "hidden",
                  zIndex: 4,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    width: "clamp(50px, 10vw, 80px)",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(120, 160, 230, 0.08), rgba(180, 200, 240, 0.12), rgba(120, 160, 230, 0.08), transparent)",
                    filter: "blur(4px)",
                  }}
                  initial={{ left: "-15%" }}
                  animate={{ left: "115%" }}
                  transition={{ duration: 1.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </motion.div>
            )}

            {/* Subtitle */}
            {showSubtitle && (
              <motion.div className="flex flex-col items-center" style={{ gap: "clamp(0.4rem, 0.8vh, 0.6rem)" }}>
                {/* Thin divider */}
                <motion.div
                  style={{
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(60, 90, 150, 0.3), transparent)",
                    marginBottom: "clamp(0.4rem, 0.8vh, 0.6rem)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: "clamp(100px, 20vw, 220px)" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.p
                  className="uppercase font-sans font-light"
                  style={{
                    fontSize: "clamp(0.5rem, 1vw, 0.7rem)",
                    letterSpacing: "0.7em",
                    color: "rgba(100, 115, 145, 0.4)",
                  }}
                  initial={{ opacity: 0, y: 12, letterSpacing: "1.5em" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.7em" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  Full Stack Developer
                </motion.p>
                {/* Lower accent */}
                <motion.div
                  style={{
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(60, 90, 150, 0.2), transparent)",
                    marginTop: "clamp(0.2rem, 0.4vh, 0.4rem)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: "clamp(60px, 12vw, 140px)" }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                />
              </motion.div>
            )}
          </motion.div>

          {/* ── Bottom center: year + portfolio tag ── */}
          <motion.div
            className="absolute flex items-center"
            style={{
              bottom: "clamp(1.5rem, 4vh, 3rem)",
              left: "50%",
              transform: "translateX(-50%)",
              gap: "clamp(0.5rem, 1.5vw, 1rem)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showSubtitle ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span
              className="font-sans"
              style={{
                fontSize: "clamp(0.4rem, 0.65vw, 0.5rem)",
                letterSpacing: "0.4em",
                color: "rgba(70, 80, 105, 0.3)",
              }}
            >
              PORTFOLIO
            </span>
            <span style={{ width: "clamp(20px, 3vw, 40px)", height: "1px", background: "rgba(70, 80, 105, 0.15)" }} />
            <span
              className="font-sans tabular-nums"
              style={{
                fontSize: "clamp(0.4rem, 0.65vw, 0.5rem)",
                letterSpacing: "0.3em",
                color: "rgba(70, 80, 105, 0.3)",
              }}
            >
              {new Date().getFullYear()}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
