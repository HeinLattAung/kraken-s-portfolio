"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between backdrop-blur-sm bg-[#06060a]/70"
        style={{
          padding: "clamp(0.875rem, 2vh, 1.25rem) clamp(1.5rem, 5vw, 6rem)",
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <a
          href="#"
          className="font-sans text-white uppercase"
          style={{
            fontSize: "clamp(0.6rem, 1.1vw, 0.75rem)",
            letterSpacing: "0.35em",
            fontWeight: 500,
            background: "linear-gradient(135deg, #c0c0c8 0%, #8a8a95 40%, #e0e0e5 60%, #a0a0aa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Hein Latt Aung
        </a>

        <nav className="hidden md:flex items-center" style={{ gap: "clamp(1.5rem, 3vw, 2rem)" }}>
          {[
            { label: "Works", href: "#projects" },
            { label: "Skills", href: "#skills" },
            { label: "Academics", href: "#academics" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#777] hover:text-[#00E5FF] transition-colors duration-300 uppercase font-sans"
              style={{
                fontSize: "clamp(0.6rem, 1vw, 0.75rem)",
                letterSpacing: "0.15em",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden flex flex-col items-end justify-center"
          style={{ gap: "5px", width: "48px", height: "48px" }}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="bg-white" style={{ width: "22px", height: "1.5px", borderRadius: "1px" }} />
          <span className="bg-white" style={{ width: "16px", height: "1.5px", borderRadius: "1px" }} />
        </button>
      </motion.header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
