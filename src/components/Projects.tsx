"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, LayoutGroup } from "framer-motion";
import { VideoPreview } from "./VideoPreview";
import { ProjectModal } from "./ProjectModal";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  videoSrc: string;
  accentColor: string;
  problem: string;
  solution: string;
  challenges: string;
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
    githubUrl: "#",
    videoSrc: "/videos/anime-demo.mp4",
    accentColor: "#E50914",
    problem:
      "Deliver a performant streaming UI that handles large catalogs and real-time metadata without jank on low-end devices.",
    solution:
      "Built around React Suspense, virtualized lists, and an aggressive caching layer over a REST API, with skeleton states tuned for perceived performance.",
    challenges:
      "Coordinating image preloads, video thumbnails, and API rate limits while keeping time-to-interactive under 1s on mid-tier hardware.",
  },
  {
    id: 2,
    title: "LuxeStore",
    subtitle: "Premium E-commerce Platform",
    description:
      "A luxury e-commerce platform with secure Stripe payment integration, advanced cart logic, and sophisticated state management for a seamless checkout flow.",
    tags: ["Next.js", "Stripe", "Zustand", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://kluxestore.vercel.app/",
    githubUrl: "#",
    videoSrc: "/videos/luxestore-demo.mp4",
    accentColor: "#C9A84C",
    problem:
      "A luxury storefront needed a checkout flow that felt editorial, not transactional, while staying PCI-safe and resilient to cart-state edge cases.",
    solution:
      "Server components for catalog pages, client-side Zustand for cart, and Stripe Checkout for payments — wrapped in a slow-paced, type-driven motion language.",
    challenges:
      "Reconciling server vs. client cart state across auth transitions, and handling Stripe webhooks with idempotency for order fulfillment.",
  },
  {
    id: 3,
    title: "Queue PWA",
    subtitle: "Offline-First Progressive Web App",
    description:
      "A progressive web application for queue management and booking with offline-first capability, push notifications, and seamless service worker integration.",
    tags: ["Next.js", "PWA", "Service Workers", "IndexedDB"],
    liveUrl: "https://queue-blush.vercel.app/",
    githubUrl: "#",
    videoSrc: "/videos/queue-demo.mp4",
    accentColor: "#00D4AA",
    problem:
      "Staff at busy venues needed to manage queues and bookings reliably even when the Wi-Fi dropped — the app had to be usable offline and sync on reconnect.",
    solution:
      "A service-worker-first architecture: IndexedDB as the source of truth on-device, background sync to the API, and push notifications for status changes.",
    challenges:
      "Conflict resolution between offline edits and server state, and keeping the PWA install experience polished across iOS and Android quirks.",
  },
];

function StickyProjectCard({
  project,
  index,
  total,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  onOpen: (project: Project) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);

  const [isHovered, setIsHovered] = useState(false);

  const openModal = useCallback(() => onOpen(project), [onOpen, project]);

  return (
    <motion.div
      ref={cardRef}
      className="lg:sticky"
      style={{
        top: `calc(10vh + ${index * 2}vh)`,
        zIndex: index + 1,
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative overflow-hidden group"
        style={{
          scale,
          opacity,
          borderRadius: "clamp(12px, 2vw, 20px)",
        }}
      >
        {/* Rotating conic-gradient border glow — visible on hover */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: "-60%",
            borderRadius: "inherit",
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${project.accentColor} 60deg, transparent 140deg, #00E5FF 240deg, transparent 320deg)`,
            opacity: isHovered ? 0.85 : 0,
            transition: "opacity 0.45s ease",
            filter: "blur(2px)",
          }}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />

        {/* Glass inner panel — sits inside the conic ring to form a 1px border effect */}
        <div
          className="relative"
          style={{
            margin: "1px",
            borderRadius: "calc(clamp(12px, 2vw, 20px) - 1px)",
            background:
              "linear-gradient(145deg, rgba(15,15,15,0.72) 0%, rgba(10,10,10,0.78) 60%, rgba(15,15,15,0.72) 100%)",
            backdropFilter: "blur(24px) saturate(130%)",
            WebkitBackdropFilter: "blur(24px) saturate(130%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.04), 0 30px 60px -20px rgba(0,0,0,0.6)",
          }}
        >
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
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
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
                      padding:
                        "clamp(0.2rem, 0.5vw, 0.375rem) clamp(0.4rem, 1vw, 0.75rem)",
                      fontSize: "clamp(0.55rem, 1vw, 0.7rem)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div
                className="flex flex-wrap items-center"
                style={{ gap: "clamp(0.5rem, 1.5vw, 1rem)" }}
              >
                <button
                  type="button"
                  onClick={openModal}
                  data-magnetic
                  className="group/cta inline-flex items-center self-start border border-white/10 hover:border-[#00E5FF]/30 active:scale-95 transition-all duration-300"
                  style={{
                    gap: "clamp(0.4rem, 1vw, 0.75rem)",
                    padding:
                      "clamp(0.5rem, 1.2vw, 0.875rem) clamp(1rem, 2vw, 1.75rem)",
                    borderRadius: "9999px",
                    fontSize: "clamp(0.6rem, 1.1vw, 0.75rem)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    fontWeight: 500,
                  }}
                >
                  <span>Case Study</span>
                  <svg
                    className="transition-transform group-hover/cta:translate-x-1"
                    style={{
                      width: "clamp(0.75rem, 1.5vw, 1rem)",
                      height: "clamp(0.75rem, 1.5vw, 1rem)",
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
                  className="text-[#666] hover:text-[#00E5FF] transition-colors duration-300 uppercase font-sans"
                  style={{
                    fontSize: "clamp(0.55rem, 1vw, 0.7rem)",
                    letterSpacing: "0.12em",
                  }}
                >
                  View Live ↗
                </a>
              </div>
            </div>

            {/* Right - Video (shared element) */}
            <div
              className="flex-1 flex items-center justify-center"
              style={{ padding: "clamp(0.75rem, 2vw, 3rem)" }}
            >
              <motion.div
                layoutId={`project-video-${project.id}`}
                className="w-full overflow-hidden border border-white/[0.06] cursor-pointer"
                onClick={openModal}
                data-magnetic
                style={{
                  maxWidth: "100%",
                  borderRadius: "clamp(8px, 1.2vw, 12px)",
                }}
              >
                <div
                  className="bg-[#1a1a1a] flex items-center"
                  style={{
                    padding:
                      "clamp(0.3rem, 0.8vw, 0.625rem) clamp(0.4rem, 1vw, 1rem)",
                    gap: "clamp(0.3rem, 0.5vw, 0.5rem)",
                  }}
                >
                  <div
                    className="flex"
                    style={{ gap: "clamp(3px, 0.4vw, 6px)" }}
                  >
                    <div
                      className="rounded-full bg-[#ff5f57]"
                      style={{
                        width: "clamp(6px, 0.8vw, 10px)",
                        height: "clamp(6px, 0.8vw, 10px)",
                      }}
                    />
                    <div
                      className="rounded-full bg-[#ffbd2e]"
                      style={{
                        width: "clamp(6px, 0.8vw, 10px)",
                        height: "clamp(6px, 0.8vw, 10px)",
                      }}
                    />
                    <div
                      className="rounded-full bg-[#28ca41]"
                      style={{
                        width: "clamp(6px, 0.8vw, 10px)",
                        height: "clamp(6px, 0.8vw, 10px)",
                      }}
                    />
                  </div>
                  <div
                    className="flex-1 min-w-0"
                    style={{ margin: "0 clamp(0.2rem, 0.6vw, 0.75rem)" }}
                  >
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
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <LayoutGroup>
      <section
        id="projects"
        className="relative"
        style={{ padding: "clamp(2rem, 6vw, 6rem) clamp(1rem, 4vw, 6rem)" }}
      >
        <motion.div
          className="mx-auto"
          style={{
            maxWidth: "80rem",
            marginBottom: "clamp(1.5rem, 4vw, 4rem)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-[#555] uppercase font-sans"
            style={{
              fontSize: "clamp(0.6rem, 1.1vw, 0.75rem)",
              letterSpacing: "0.3em",
            }}
          >
            Portfolio
          </span>
          <h2
            className="font-serif font-light"
            style={{
              fontSize: "clamp(1.5rem, 4.5vw, 3rem)",
              marginTop: "0.5rem",
            }}
          >
            Selected{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B4D8]">
              Works
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto" style={{ maxWidth: "80rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(1.25rem, 3vw, 2rem)",
            }}
          >
            {projects.map((project, i) => (
              <StickyProjectCard
                key={project.id}
                project={project}
                index={i}
                total={projects.length}
                onOpen={setSelected}
              />
            ))}
          </div>
        </div>

        <ProjectModal
          project={selected}
          onClose={() => setSelected(null)}
        />
      </section>
    </LayoutGroup>
  );
}
