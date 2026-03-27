"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ProjectModalData {
  title: string;
  problem: string;
  solution: string;
  challenges: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
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
            className="fixed right-0 top-0 bottom-0 w-full md:w-[600px] lg:w-[700px] bg-[#0d0d0d] z-[101] overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div style={{ padding: "clamp(1.25rem, 4vw, 3rem)" }}>
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors"
                style={{
                  top: "clamp(1rem, 3vw, 1.5rem)",
                  right: "clamp(1rem, 3vw, 1.5rem)",
                  width: "clamp(2.25rem, 5vw, 2.5rem)",
                  height: "clamp(2.25rem, 5vw, 2.5rem)",
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
                  transition={{ delay: 0.2 + i * 0.1 }}
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

              {/* Tech Stack */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                <div className="flex flex-wrap" style={{ gap: "clamp(0.375rem, 1vw, 0.5rem)" }}>
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border"
                      style={{
                        padding: "clamp(0.375rem, 1vw, 0.5rem) clamp(0.75rem, 1.5vw, 1rem)",
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
