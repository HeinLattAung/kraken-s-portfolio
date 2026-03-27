"use client";

import { motion, useMotionValue, useTransform, useScroll } from "framer-motion";
import { useCallback, useRef, useEffect, useState } from "react";
import { HeroParticles } from "./HeroParticles";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const { scrollY } = useScroll();
  const bgParallaxY = useTransform(scrollY, [0, 800], [0, 60]);
  const nameParallaxY = useTransform(scrollY, [0, 800], [0, -30]);
  const fgParallaxY = useTransform(scrollY, [0, 800], [0, -50]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY, isTouchDevice]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: "100dvh",
        padding: "clamp(5rem, 10vh, 8rem) clamp(0.75rem, 4vw, 4rem) clamp(2rem, 4vh, 4rem)",
      }}
    >
      {/* Background layer — obsidian shards + cobalt filaments (0.1x parallax) */}
      <motion.div className="absolute inset-0" style={{ y: bgParallaxY }}>
        <HeroParticles />
      </motion.div>

      {/* Main content — centered */}
      <div
        className="relative flex flex-col items-center w-full mx-auto"
        style={{ maxWidth: "80rem", zIndex: 1 }}
      >
        {/* Ghost Glass Name — structural foundation */}
        <motion.div
          className="relative flex flex-col items-center select-none"
          style={{ y: nameParallaxY }}
        >
          {/* Name — ghost glass effect */}
          <motion.div
            className="flex flex-wrap items-center justify-center"
            style={{
              gap: "clamp(0.5rem, 2vw, 1.5rem)",
              marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            {["HEIN", "LATT", "AUNG"].map((word, wi) => (
              <motion.span
                key={word}
                className="font-sans font-extralight uppercase"
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 8rem)",
                  lineHeight: 1,
                  letterSpacing: "0.15em",
                  background: "linear-gradient(135deg, rgba(200, 210, 240, 0.7) 0%, rgba(120, 140, 200, 0.45) 25%, rgba(220, 225, 245, 0.85) 50%, rgba(100, 130, 200, 0.5) 75%, rgba(200, 210, 240, 0.7) 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  WebkitTextStroke: "1px rgba(180, 195, 230, 0.25)",
                  textShadow: "0 0 40px rgba(100, 150, 255, 0.15), 0 0 80px rgba(20, 70, 160, 0.1), 0 0 120px rgba(0, 180, 216, 0.06)",
                  filter: "drop-shadow(0 0 25px rgba(100, 150, 255, 0.12)) drop-shadow(0 0 50px rgba(20, 70, 160, 0.08))",
                  paintOrder: "stroke fill",
                }}
                initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + wi * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  backgroundPosition: {
                    duration: 6,
                    delay: 1 + wi * 0.3,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Thin cobalt filament line through the name */}
          <motion.div
            style={{
              width: "clamp(120px, 40vw, 400px)",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(100, 150, 255, 0.5), rgba(0, 229, 255, 0.35), rgba(100, 150, 255, 0.5), transparent)",
              boxShadow: "0 0 15px rgba(100, 150, 255, 0.15), 0 0 30px rgba(0, 229, 255, 0.08)",
              marginBottom: "clamp(1.5rem, 3vh, 3rem)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
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
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div
              className="rounded-full"
              style={{
                width: "clamp(4px, 0.5vw, 6px)",
                height: "clamp(4px, 0.5vw, 6px)",
                background: "rgba(20, 70, 160, 0.8)",
                boxShadow: "0 0 12px rgba(20, 70, 160, 0.4)",
              }}
            />
            <p
              className="text-[#555] uppercase font-sans"
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
              color: "#c8c8d0",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Crafting{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg, #1446a0 0%, #00B4D8 50%, #00E5FF 100%)",
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
            className="text-[#555] font-sans"
            style={{
              fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)",
              maxWidth: "28rem",
              lineHeight: 1.7,
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            Building performant, elegant web applications with modern
            technologies and meticulous attention to detail.
          </motion.p>

          <motion.div
            className="flex items-center flex-wrap justify-center"
            style={{ gap: "clamp(0.5rem, 1.5vw, 1.25rem)" }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <button
              onClick={scrollToProjects}
              data-magnetic
              className="group relative border border-white/10 rounded-full uppercase font-sans transition-all duration-300 hover:border-[#1446a0]/40 hover:shadow-[0_0_30px_rgba(20,70,160,0.1)] active:scale-95"
              style={{
                padding: "clamp(0.625rem, 1.5vw, 1rem) clamp(1.25rem, 3vw, 2rem)",
                fontSize: "clamp(0.6rem, 1.1vw, 0.8rem)",
                letterSpacing: "0.12em",
              }}
            >
              <span className="relative z-10">Selected Works</span>
            </button>

            <a
              href="#contact"
              data-magnetic
              className="text-[#444] hover:text-[#1446a0] active:text-[#1446a0] transition-colors duration-300 uppercase font-sans"
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
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span
          className="text-[#333] uppercase font-sans"
          style={{ fontSize: "clamp(0.5rem, 0.9vw, 0.65rem)", letterSpacing: "0.15em" }}
        >
          Scroll
        </span>
        <motion.div
          style={{ width: "1px", height: "clamp(1.25rem, 3vh, 2rem)", background: "rgba(20, 70, 160, 0.3)" }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
