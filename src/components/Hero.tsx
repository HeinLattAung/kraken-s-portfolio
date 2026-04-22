"use client";

import { motion, useMotionValue, useTransform, useScroll, useSpring } from "framer-motion";
import { useCallback, useRef, useEffect, useState } from "react";
import { HeroParticles } from "./HeroParticles";
import { HeroTorus } from "./HeroTorus";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 80, damping: 20, mass: 0.5 });
  const mouseY = useSpring(rawMouseY, { stiffness: 80, damping: 20, mass: 0.5 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Global scroll parallax (window-based) for background/foreground layers
  const { scrollY } = useScroll();
  const bgParallaxY = useTransform(scrollY, [0, 800], [0, 60]);
  const nameParallaxY = useTransform(scrollY, [0, 800], [0, -30]);
  const fgParallaxY = useTransform(scrollY, [0, 800], [0, -50]);

  // Section-scoped scroll for scale-out-on-exit parallax
  const { scrollYProgress: sectionProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const exitScale = useTransform(sectionProgress, [0, 1], [1, 0.92]);
  const exitOpacity = useTransform(sectionProgress, [0, 0.6, 1], [1, 0.8, 0]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawMouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawMouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawMouseX, rawMouseY, isTouchDevice]
  );

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  }, [rawMouseX, rawMouseY]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const words = ["HEIN", "LATT", "AUNG"];

  return (
    <motion.section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden hero-dvh"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: "clamp(5rem, 10vh, 8rem) clamp(0.75rem, 4vw, 4rem) clamp(2rem, 4vh, 4rem)",
        scale: exitScale,
        opacity: exitOpacity,
        transformOrigin: "50% 30%",
      }}
    >
      {/* Background parallax layer — particles + floating torus */}
      <motion.div className="absolute inset-0" style={{ y: bgParallaxY }}>
        <HeroParticles />
        {!isTouchDevice && <HeroTorus mouseX={mouseX} mouseY={mouseY} />}
      </motion.div>

      {/* Main content — centered */}
      <div
        className="relative flex flex-col items-center w-full mx-auto"
        style={{ maxWidth: "80rem", zIndex: 1 }}
      >
        <motion.div
          className="relative flex flex-col items-center select-none"
          style={{ y: nameParallaxY }}
        >
          {/* Name — clip-path mask reveal + gradient shimmer */}
          <div
            className="flex flex-wrap items-center justify-center"
            style={{
              gap: "clamp(0.5rem, 2vw, 1.5rem)",
              marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
            }}
          >
            {words.map((word, wi) => (
              <motion.span
                key={word}
                className="inline-block font-sans font-extralight uppercase"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 8rem)",
                  lineHeight: 1,
                  letterSpacing: "0.15em",
                  background:
                    "linear-gradient(135deg, rgba(235, 240, 255, 0.98) 0%, rgba(160, 190, 240, 0.85) 25%, rgba(255, 255, 255, 1) 50%, rgba(140, 180, 240, 0.9) 75%, rgba(235, 240, 255, 0.98) 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  filter:
                    "drop-shadow(0 0 18px rgba(140, 180, 255, 0.35)) drop-shadow(0 0 40px rgba(40, 110, 220, 0.2))",
                  willChange: "clip-path, background-position",
                  paddingBottom: "0.08em",
                }}
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{
                  clipPath: "inset(0% 0% 0% 0%)",
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  clipPath: {
                    duration: 1.1,
                    delay: 0.2 + wi * 0.12,
                    ease: [0.77, 0, 0.175, 1],
                  },
                  backgroundPosition: {
                    duration: 6,
                    delay: 1.4 + wi * 0.3,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Thin cobalt filament line through the name */}
          <motion.div
            style={{
              width: "clamp(120px, 40vw, 400px)",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(140, 180, 255, 0.9), rgba(0, 229, 255, 0.75), rgba(140, 180, 255, 0.9), transparent)",
              boxShadow:
                "0 0 20px rgba(140, 180, 255, 0.4), 0 0 40px rgba(0, 229, 255, 0.22)",
              marginBottom: "clamp(1.5rem, 3vh, 3rem)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          />
        </motion.div>

        {/* Foreground content — role + description + CTAs */}
        <motion.div
          className="flex flex-col items-center text-center"
          style={{ y: fgParallaxY }}
        >
          <motion.div
            className="flex items-center"
            style={{
              gap: "clamp(0.4rem, 0.8vw, 0.75rem)",
              marginBottom: "clamp(1rem, 2vh, 1.5rem)",
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div
              className="rounded-full"
              style={{
                width: "clamp(4px, 0.5vw, 6px)",
                height: "clamp(4px, 0.5vw, 6px)",
                background: "rgba(0, 229, 255, 1)",
                boxShadow:
                  "0 0 10px rgba(0, 229, 255, 0.9), 0 0 20px rgba(0, 180, 216, 0.5)",
              }}
            />
            <p
              className="text-[#a8a8b0] uppercase font-sans"
              style={{
                fontSize: "clamp(0.6rem, 1.1vw, 0.8rem)",
                letterSpacing: "0.25em",
              }}
            >
              Full Stack Developer
            </p>
          </motion.div>

          <motion.h1
            className="font-serif font-light"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              lineHeight: 1.2,
              marginBottom: "clamp(0.75rem, 1.5vw, 1.25rem)",
              color: "#eef0f5",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Crafting{" "}
            <span
              className="italic"
              style={{
                background:
                  "linear-gradient(135deg, #3a7bd5 0%, #00D4F5 50%, #80F3FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Digital
            </span>{" "}
            Experiences
          </motion.h1>

          <motion.p
            className="text-[#9a9aa5] font-sans"
            style={{
              fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)",
              maxWidth: "28rem",
              lineHeight: 1.7,
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95 }}
          >
            Building performant, elegant web applications with modern
            technologies and meticulous attention to detail.
          </motion.p>

          <motion.div
            className="flex items-center flex-wrap justify-center"
            style={{ gap: "clamp(0.5rem, 1.5vw, 1.25rem)" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <button
              onClick={scrollToProjects}
              data-magnetic
              className="group relative rounded-full uppercase font-sans transition-all duration-300 hover:border-[#00E5FF]/60 hover:shadow-[0_0_40px_rgba(0,229,255,0.25)] hover:text-white active:scale-95 text-[#e8e8f0]"
              style={{
                padding: "clamp(0.625rem, 1.5vw, 1rem) clamp(1.25rem, 3vw, 2rem)",
                fontSize: "clamp(0.6rem, 1.1vw, 0.8rem)",
                letterSpacing: "0.12em",
                border: "1px solid rgba(255,255,255,0.28)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(0,229,255,0.04))",
                boxShadow:
                  "0 0 20px rgba(0, 229, 255, 0.08), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <span className="relative z-10">Selected Works</span>
            </button>

            <a
              href="#contact"
              data-magnetic
              className="text-[#b0b0ba] hover:text-[#00E5FF] active:text-[#00E5FF] transition-colors duration-300 uppercase font-sans"
              style={{
                fontSize: "clamp(0.55rem, 1vw, 0.75rem)",
                letterSpacing: "0.12em",
              }}
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex-col items-center hidden sm:flex"
        style={{ bottom: "clamp(1rem, 3vh, 2.5rem)", gap: "0.5rem" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <span
          className="text-[#888] uppercase font-sans"
          style={{ fontSize: "clamp(0.5rem, 0.9vw, 0.65rem)", letterSpacing: "0.15em" }}
        >
          Scroll
        </span>
        <motion.div
          style={{
            width: "1px",
            height: "clamp(1.25rem, 3vh, 2rem)",
            background:
              "linear-gradient(to bottom, rgba(0,229,255,0.7), rgba(0,180,216,0.2))",
            boxShadow: "0 0 8px rgba(0, 229, 255, 0.35)",
          }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.section>
  );
}
