"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { VideoPreview } from "./VideoPreview";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  liveUrl: string;
  videoSrc: string;
  accentColor: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Anime Library",
    subtitle: "Immersive Streaming Experience",
    description:
      "A full-featured anime streaming platform with real-time API integration, dynamic content loading, and an immersive user experience inspired by Netflix.",
    tags: ["React", "TypeScript", "Tailwind CSS", "REST API"],
    liveUrl: "https://movie-beryl-gamma-68.vercel.app/",
    videoSrc: "/videos/anime-demo.mp4",
    accentColor: "#E50914",
  },
  {
    id: 2,
    title: "LuxeStore",
    subtitle: "Premium E-commerce Platform",
    description:
      "A luxury e-commerce platform with secure Stripe payment integration, advanced cart logic, and sophisticated state management for a seamless checkout flow.",
    tags: ["Next.js", "Stripe", "Zustand", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://kluxestore.vercel.app/",
    videoSrc: "/videos/luxestore-demo.mp4",
    accentColor: "#C9A84C",
  },
  {
    id: 3,
    title: "Queue PWA",
    subtitle: "Offline-First Progressive Web App",
    description:
      "A progressive web application for queue management and booking with offline-first capability, push notifications, and seamless service worker integration.",
    tags: ["Next.js", "PWA", "Service Workers", "IndexedDB"],
    liveUrl: "https://queue-blush.vercel.app/",
    videoSrc: "/videos/queue-demo.mp4",
    accentColor: "#00D4AA",
  },
];

function StickyProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);

  // Glass-reveal: track mouse position for iridescent light sweep
  const [isHovered, setIsHovered] = useState(false);
  const sweepX = useMotionValue(0);
  const sweepY = useMotionValue(0);
  // Weighted spring: quick flick start, heavy smooth settle
  const smoothSweepX = useSpring(sweepX, { stiffness: 150, damping: 25 });
  const smoothSweepY = useSpring(sweepY, { stiffness: 150, damping: 25 });

  const handleCardMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      sweepX.set(((e.clientX - rect.left) / rect.width) * 100);
      sweepY.set(((e.clientY - rect.top) / rect.height) * 100);
    },
    [sweepX, sweepY]
  );

  return (
    <div
      ref={cardRef}
      className="lg:sticky"
      style={{
        minHeight: "auto",
        top: `calc(10vh + ${index * 2}vh)`,
        zIndex: index + 1,
      }}
      onMouseMove={handleCardMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="overflow-hidden relative"
        style={{
          scale,
          opacity,
          background: `linear-gradient(145deg, #0f0f0f 0%, #0a0a0a 60%, ${project.accentColor}08 100%)`,
          borderRadius: "clamp(12px, 2vw, 20px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Glass-reveal iridescent light sweep overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 10,
            borderRadius: "inherit",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            background: useTransform(
              [smoothSweepX, smoothSweepY],
              ([x, y]: number[]) =>
                `radial-gradient(600px circle at ${x}% ${y}%, rgba(200, 170, 100, 0.07), rgba(0, 229, 255, 0.04) 40%, transparent 70%)`
            ),
          }}
        />
        {/* Glass border glow on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 10,
            borderRadius: "inherit",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.5s ease",
            border: `1px solid rgba(200, 170, 100, 0.12)`,
            boxShadow: "inset 0 0 60px rgba(200, 170, 100, 0.03), 0 0 30px rgba(0, 229, 255, 0.03)",
          }}
        />
        <div className="flex flex-col lg:flex-row">
          {/* Left - Info */}
          <div
            className="flex-1 flex flex-col justify-center"
            style={{ padding: "clamp(1.25rem, 4vw, 3.5rem)" }}
          >
            <span
              className="uppercase font-sans font-medium"
              style={{
                color: project.accentColor,
                fontSize: "clamp(0.6rem, 1.2vw, 0.75rem)",
                letterSpacing: "0.3em",
                marginBottom: "clamp(0.4rem, 1vw, 0.75rem)",
              }}
            >
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>

            <h2
              className="font-serif font-light text-white"
              style={{
                fontSize: "clamp(1.5rem, 5vw, 3.75rem)",
                lineHeight: 1.1,
                marginBottom: "clamp(0.2rem, 0.5vw, 0.5rem)",
              }}
            >
              {project.title}
            </h2>
            <p
              className="text-[#666] tracking-wide"
              style={{
                fontSize: "clamp(0.7rem, 1.4vw, 0.875rem)",
                marginBottom: "clamp(0.75rem, 2vw, 1.5rem)",
              }}
            >
              {project.subtitle}
            </p>

            <p
              className="text-[#999] leading-relaxed hidden sm:block"
              style={{
                fontSize: "clamp(0.7rem, 1.3vw, 0.875rem)",
                marginBottom: "clamp(0.75rem, 2vw, 1.5rem)",
                maxWidth: "28rem",
              }}
            >
              {project.description}
            </p>

            {/* Tags */}
            <div
              className="flex flex-wrap"
              style={{
                gap: "clamp(0.3rem, 0.8vw, 0.5rem)",
                marginBottom: "clamp(1rem, 2.5vw, 2rem)",
              }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.06] text-[#888] bg-white/[0.02]"
                  style={{
                    padding: "clamp(0.2rem, 0.5vw, 0.375rem) clamp(0.4rem, 1vw, 0.75rem)",
                    fontSize: "clamp(0.55rem, 1vw, 0.7rem)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              className="group inline-flex items-center self-start border border-white/10 hover:border-[#00E5FF]/30 active:scale-95 transition-all duration-300"
              style={{
                gap: "clamp(0.4rem, 1vw, 0.75rem)",
                padding: "clamp(0.5rem, 1.2vw, 0.875rem) clamp(1rem, 2vw, 1.75rem)",
                borderRadius: "9999px",
                fontSize: "clamp(0.6rem, 1.1vw, 0.75rem)",
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                fontWeight: 500,
              }}
            >
              <span>View Live</span>
              <svg
                className="transition-transform group-hover:translate-x-1"
                style={{ width: "clamp(0.75rem, 1.5vw, 1rem)", height: "clamp(0.75rem, 1.5vw, 1rem)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </a>
          </div>

          {/* Right - Video */}
          <div
            className="flex-1 flex items-center justify-center"
            style={{ padding: "clamp(0.75rem, 2vw, 3rem)" }}
          >
            <div
              className="w-full overflow-hidden border border-white/[0.06]"
              style={{
                maxWidth: "clamp(100%, 40vw, 32rem)",
                borderRadius: "clamp(8px, 1.2vw, 12px)",
              }}
            >
              {/* Browser chrome */}
              <div
                className="bg-[#1a1a1a] flex items-center"
                style={{
                  padding: "clamp(0.3rem, 0.8vw, 0.625rem) clamp(0.4rem, 1vw, 1rem)",
                  gap: "clamp(0.3rem, 0.5vw, 0.5rem)",
                }}
              >
                <div className="flex" style={{ gap: "clamp(3px, 0.4vw, 6px)" }}>
                  <div className="rounded-full bg-[#ff5f57]" style={{ width: "clamp(6px, 0.8vw, 10px)", height: "clamp(6px, 0.8vw, 10px)" }} />
                  <div className="rounded-full bg-[#ffbd2e]" style={{ width: "clamp(6px, 0.8vw, 10px)", height: "clamp(6px, 0.8vw, 10px)" }} />
                  <div className="rounded-full bg-[#28ca41]" style={{ width: "clamp(6px, 0.8vw, 10px)", height: "clamp(6px, 0.8vw, 10px)" }} />
                </div>
                <div className="flex-1 min-w-0" style={{ margin: "0 clamp(0.2rem, 0.6vw, 0.75rem)" }}>
                  <div
                    className="bg-[#0d0d0d] rounded-md text-[#555] truncate"
                    style={{
                      padding: "clamp(2px, 0.3vw, 4px) clamp(4px, 0.8vw, 12px)",
                      fontSize: "clamp(7px, 0.9vw, 10px)",
                    }}
                  >
                    {project.liveUrl.replace("https://", "")}
                  </div>
                </div>
              </div>
              <VideoPreview
                src={project.videoSrc}
                className="w-full"
                style={{ aspectRatio: "16/9" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="relative"
      style={{ padding: "clamp(2rem, 6vw, 6rem) clamp(1rem, 4vw, 6rem)" }}
    >
      <motion.div
        className="mx-auto"
        style={{ maxWidth: "80rem", marginBottom: "clamp(1.5rem, 4vw, 4rem)" }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span
          className="text-[#555] uppercase font-sans"
          style={{ fontSize: "clamp(0.6rem, 1.1vw, 0.75rem)", letterSpacing: "0.3em" }}
        >
          Portfolio
        </span>
        <h2
          className="font-serif font-light"
          style={{ fontSize: "clamp(1.5rem, 4.5vw, 3rem)", marginTop: "0.5rem" }}
        >
          Selected{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B4D8]">
            Works
          </span>
        </h2>
      </motion.div>

      <div className="mx-auto" style={{ maxWidth: "80rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.25rem, 3vw, 2rem)" }}>
          {projects.map((project, i) => (
            <StickyProjectCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
