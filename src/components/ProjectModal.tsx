"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { VideoPreview } from "./VideoPreview";

interface ProjectModalData {
  id: number;
  title: string;
  subtitle?: string;
  problem: string;
  solution: string;
  challenges: string;
  tags?: string[];
  liveUrl: string;
  githubUrl: string;
  videoSrc: string;
  accentColor: string;
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectModalData | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key={`modal-${project.id}`}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[min(600px,92vw)] lg:w-[min(760px,85vw)] bg-[#0d0d0d] z-[101] overflow-y-auto overflow-x-hidden"
            style={{
              // prevent iOS rubber-band from the modal bleeding into the page
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              maxWidth: "100vw",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
          >
            {/* Shared-element hero video */}
            <motion.div
              layoutId={`project-video-${project.id}`}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "16/9", background: "#111" }}
            >
              <VideoPreview
                src={project.videoSrc}
                className="w-full h-full"
                style={{ aspectRatio: "16/9" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 55%, rgba(13,13,13,0.85) 100%)",
                }}
              />
            </motion.div>

            <div
              style={{
                padding: "clamp(1.25rem, 4vw, 3rem)",
                paddingTop: "clamp(1rem, 2.5vw, 1.75rem)",
              }}
            >
              {/* Close */}
              <button
                onClick={onClose}
                data-magnetic
                className="absolute rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors backdrop-blur-md bg-black/40"
                style={{
                  top: "clamp(1rem, 3vw, 1.5rem)",
                  right: "clamp(1rem, 3vw, 1.5rem)",
                  width: "clamp(2.25rem, 5vw, 2.5rem)",
                  height: "clamp(2.25rem, 5vw, 2.5rem)",
                  zIndex: 2,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1L13 13M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <span
                  className="text-xs tracking-[0.3em] uppercase"
                  style={{ color: project.accentColor }}
                >
                  Case Study
                </span>

                <h2
                  className="font-serif font-light"
                  style={{
                    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                    marginTop: "0.5rem",
                    marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
                  }}
                >
                  {project.title}
                </h2>
              </motion.div>

              {/* Sections */}
              {[
                { label: "The Problem", content: project.problem },
                { label: "My Solution", content: project.solution },
                { label: "Technical Challenges", content: project.challenges },
              ].map((section, i) => (
                <motion.div
                  key={section.label}
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.1 }}
                >
                  <h3
                    className="uppercase"
                    style={{
                      color: project.accentColor,
                      fontSize: "clamp(0.7rem, 1.2vw, 0.875rem)",
                      letterSpacing: "0.15em",
                      marginBottom: "clamp(0.5rem, 1.5vw, 0.75rem)",
                    }}
                  >
                    {section.label}
                  </h3>
                  <p
                    className="text-[#aaa] leading-relaxed"
                    style={{ fontSize: "clamp(0.8rem, 1.3vw, 0.875rem)" }}
                  >
                    {section.content}
                  </p>
                </motion.div>
              ))}

              {project.tags && project.tags.length > 0 && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <h3
                    className="uppercase"
                    style={{
                      color: project.accentColor,
                      fontSize: "clamp(0.7rem, 1.2vw, 0.875rem)",
                      letterSpacing: "0.15em",
                      marginBottom: "clamp(0.5rem, 1.5vw, 0.75rem)",
                    }}
                  >
                    Tech Stack
                  </h3>
                  <div
                    className="flex flex-wrap"
                    style={{ gap: "clamp(0.375rem, 1vw, 0.5rem)" }}
                  >
                    {project.tags.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border"
                        style={{
                          padding:
                            "clamp(0.375rem, 1vw, 0.5rem) clamp(0.75rem, 1.5vw, 1rem)",
                          fontSize: "clamp(0.65rem, 1.1vw, 0.75rem)",
                          borderColor: `${project.accentColor}30`,
                          color: project.accentColor,
                          background: `${project.accentColor}08`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sticky Bottom Buttons */}
            <div
              className="sticky bottom-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent"
              style={{ padding: "clamp(1rem, 3vw, 1.5rem)" }}
            >
              <div className="flex" style={{ gap: "clamp(0.75rem, 2vw, 1rem)" }}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
                  className="flex-1 rounded-full text-center uppercase font-medium"
                  style={{
                    padding: "clamp(0.625rem, 1.5vw, 0.75rem)",
                    fontSize: "clamp(0.65rem, 1.1vw, 0.75rem)",
                    letterSpacing: "0.15em",
                    background: project.accentColor,
                    color: "#000",
                  }}
                >
                  Live Link
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
                  className="flex-1 rounded-full text-center uppercase border border-white/20 hover:border-white/50 transition-colors"
                  style={{
                    padding: "clamp(0.625rem, 1.5vw, 0.75rem)",
                    fontSize: "clamp(0.65rem, 1.1vw, 0.75rem)",
                    letterSpacing: "0.15em",
                  }}
                >
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
