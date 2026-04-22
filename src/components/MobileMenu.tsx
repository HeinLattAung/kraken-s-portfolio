"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Works", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Academics", href: "#academics" },
  { label: "Contact", href: "#contact" },
];

export function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#06060a] z-[90] flex flex-col items-center justify-center md:hidden"
          data-fullscreen="true"
          style={{
            touchAction: "none",
            maxWidth: "100vw",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
          initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
          animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
          exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <button
            onClick={onClose}
            className="absolute flex items-center justify-center text-white"
            style={{
              top: "clamp(1rem, 3vh, 1.5rem)",
              right: "clamp(1.25rem, 5vw, 1.5rem)",
              width: "48px",
              height: "48px",
            }}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>

          <nav className="flex flex-col items-center" style={{ gap: "clamp(1.5rem, 4vh, 2.5rem)" }}>
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="font-serif font-light text-white hover:text-[#00E5FF] active:text-[#00E5FF] transition-colors"
                style={{ fontSize: "clamp(1.75rem, 5vh, 2.5rem)" }}
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
