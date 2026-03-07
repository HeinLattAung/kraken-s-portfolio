"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useCallback, useRef, useEffect, useState } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const springConfig = { damping: 20, stiffness: 400 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const glowX = useTransform(smoothX, [-0.5, 0.5], ["30%", "70%"]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ["30%", "70%"]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
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
      className="relative flex items-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: "100dvh",
        padding: "clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 6rem) clamp(2rem, 4vh, 4rem)",
        perspective: isTouchDevice ? "none" : "1200px",
      }}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-2 w-full mx-auto items-center"
        style={{ maxWidth: "80rem", gap: "clamp(1.5rem, 4vw, 3rem)" }}
      >
        {/* Profile Photo - shows first on mobile */}
        <motion.div
          className="flex items-center justify-center order-first lg:order-last"
          style={{ minHeight: "clamp(200px, 40vw, 500px)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="relative"
            style={{
              width: "clamp(200px, 55vw, 440px)",
              height: "clamp(200px, 55vw, 440px)",
              ...(isTouchDevice ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" as const }),
            }}
          >
            <motion.div
              className="relative w-full h-full"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Outer purple halo glow */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "-20%",
                  background: "radial-gradient(circle, rgba(74, 32, 128, 0.35) 0%, rgba(96, 48, 176, 0.12) 35%, transparent 65%)",
                  filter: "blur(50px)",
                }}
              />

              {/* Dynamic light following cursor - desktop only */}
              {!isTouchDevice && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-10%",
                    background: `radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(0, 229, 255, 0.12) 0%, transparent 60%)`,
                    filter: "blur(30px)",
                    // @ts-expect-error CSS custom properties
                    "--glow-x": glowX,
                    "--glow-y": glowY,
                  }}
                />
              )}

              {/* Animated glowing border ring */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "-4px",
                  padding: "2px",
                  background: "conic-gradient(from 0deg, #00E5FF44, #4a208055, #00E5FF22, #00B4D855, #4a208044, #00E5FF44)",
                  animation: "spin 8s linear infinite",
                }}
              >
                <div className="w-full h-full rounded-full bg-[#080808]" />
              </div>

              {/* Subtle inner ring */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: "0",
                  border: "1px solid rgba(0, 229, 255, 0.1)",
                  boxShadow: "inset 0 0 30px rgba(0, 229, 255, 0.05), 0 0 40px rgba(0, 229, 255, 0.05)",
                }}
              />

              {/* Profile image */}
              <div
                className="absolute rounded-full overflow-hidden"
                style={{ inset: "-6%" }}
              >
                <Image
                  src="/portfolio/profile.png"
                  alt="Hein Latt Aung"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 55vw, (max-width: 1024px) 40vw, 440px"
                />
              </div>

              {/* Purple orb overlay for depth */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: "-6%",
                  background: "radial-gradient(circle at 55% 30%, rgba(74, 32, 128, 0.15) 0%, transparent 50%)",
                }}
              />

              {/* Bottom gradient fade */}
              <div
                className="absolute rounded-full pointer-events-none overflow-hidden"
                style={{ inset: "-6%" }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "30%",
                    background: "linear-gradient(to top, rgba(8, 8, 8, 0.6), transparent)",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Text */}
        <div className="flex flex-col justify-center z-10 order-last lg:order-first text-center lg:text-left">
          <motion.div
            className="flex items-center justify-center lg:justify-start"
            style={{
              gap: "clamp(0.4rem, 1vw, 0.75rem)",
              marginBottom: "clamp(0.5rem, 1.5vw, 1rem)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              className="rounded-full bg-[#00E5FF]"
              style={{
                width: "clamp(5px, 0.6vw, 7px)",
                height: "clamp(5px, 0.6vw, 7px)",
                boxShadow: "0 0 10px rgba(0, 229, 255, 0.5)",
              }}
            />
            <p
              className="text-[#666] uppercase font-sans"
              style={{
                fontSize: "clamp(0.65rem, 1.2vw, 0.875rem)",
                letterSpacing: "0.2em",
              }}
            >
              Full Stack Developer
            </p>
          </motion.div>

          <motion.h1
            className="font-serif font-light"
            style={{
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              lineHeight: 1.05,
              marginBottom: "clamp(0.75rem, 2vw, 1.5rem)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Crafting{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B4D8]">
              Digital
            </span>
            <br />
            Experiences
          </motion.h1>

          <motion.p
            className="text-[#666] font-sans mx-auto lg:mx-0"
            style={{
              fontSize: "clamp(0.8rem, 1.4vw, 1.05rem)",
              maxWidth: "26rem",
              lineHeight: 1.7,
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Building performant, elegant web applications with modern
            technologies and meticulous attention to detail.
          </motion.p>

          <motion.div
            className="flex items-center justify-center lg:justify-start flex-wrap"
            style={{ gap: "clamp(0.5rem, 1.5vw, 1.25rem)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={scrollToProjects}
              data-magnetic
              className="group relative border border-white/15 rounded-full uppercase font-sans transition-all duration-300 hover:border-[#00E5FF]/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.08)] active:scale-95"
              style={{
                padding: "clamp(0.625rem, 1.5vw, 1rem) clamp(1.25rem, 3vw, 2rem)",
                fontSize: "clamp(0.65rem, 1.2vw, 0.875rem)",
                letterSpacing: "0.12em",
              }}
            >
              <span className="relative z-10">Selected Works</span>
            </button>

            <a
              href="#contact"
              data-magnetic
              className="text-[#555] hover:text-[#00E5FF] active:text-[#00E5FF] transition-colors duration-300 uppercase font-sans"
              style={{
                fontSize: "clamp(0.6rem, 1.1vw, 0.8rem)",
                letterSpacing: "0.12em",
              }}
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - hidden on very short screens */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex-col items-center hidden sm:flex"
        style={{ bottom: "clamp(1rem, 3vh, 2.5rem)", gap: "0.5rem" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <span
          className="text-[#444] uppercase font-sans"
          style={{ fontSize: "clamp(0.55rem, 1vw, 0.7rem)", letterSpacing: "0.15em" }}
        >
          Scroll
        </span>
        <motion.div
          className="bg-gradient-to-b from-[#00E5FF]/50 to-transparent"
          style={{ width: "1px", height: "clamp(1.25rem, 3vh, 2rem)" }}
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
