"use client";

import { motion } from "framer-motion";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative flex flex-col"
      style={{
        minHeight: "min(60dvh, 800px)",
        padding: "clamp(3rem, 8vh, 8rem) clamp(1.25rem, 5vw, 6rem) clamp(1.5rem, 3vh, 3rem)",
      }}
    >
      <div className="flex-1 flex items-center">
        <div className="w-full mx-auto" style={{ maxWidth: "80rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-[#555] uppercase font-sans"
            style={{ fontSize: "clamp(0.6rem, 1.1vw, 0.75rem)", letterSpacing: "0.3em" }}
          >
            Get in Touch
          </span>
          <h2
            className="font-serif font-light"
            style={{
              fontSize: "clamp(1.75rem, 6vw, 4.5rem)",
              marginTop: "0.5rem",
              marginBottom: "clamp(0.75rem, 2vw, 1.5rem)",
            }}
          >
            Let&apos;s work{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B4D8]">
              together
            </span>
          </h2>
          <p
            className="text-[#777]"
            style={{
              fontSize: "clamp(0.8rem, 1.4vw, 1.05rem)",
              maxWidth: "32rem",
              marginBottom: "clamp(1.5rem, 4vw, 3rem)",
              lineHeight: 1.7,
            }}
          >
            Have a project in mind or just want to chat? Feel free to reach out.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap"
          style={{ gap: "clamp(0.5rem, 1.5vw, 1rem)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { label: "Email Me", href: "mailto:heinlattaung237@gmail.com" },
            { label: "GitHub", href: "https://github.com/HeinLattAung", external: true },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/hein-latt-aung-b1767b355/", external: true },
            { label: "Call Me", href: "tel:+66637489590" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              data-magnetic
              className="border border-white/15 rounded-full uppercase font-sans transition-all duration-300 hover:border-[#00E5FF]/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.08)] active:scale-95"
              style={{
                padding: "clamp(0.625rem, 1.2vw, 0.875rem) clamp(1.25rem, 2.5vw, 1.75rem)",
                fontSize: "clamp(0.65rem, 1.1vw, 0.8rem)",
                letterSpacing: "0.12em",
              }}
            >
              {link.label}
            </a>
          ))}
        </motion.div>

        </div>
      </div>

      {/* Footer */}
      <div
        className="w-full mx-auto border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left mt-auto"
        style={{
          maxWidth: "80rem",
          paddingTop: "clamp(0.75rem, 2vw, 1.5rem)",
          gap: "clamp(0.25rem, 0.8vw, 0.75rem)",
        }}
      >
        <p className="text-[#444] font-sans" style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.7rem)", letterSpacing: "0.05em" }}>
          &copy; {new Date().getFullYear()} Hein Latt Aung. All rights reserved.
        </p>
        <p className="text-[#444] font-sans" style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.7rem)", letterSpacing: "0.05em" }}>
          Designed & Built with precision
        </p>
      </div>
    </section>
  );
}
