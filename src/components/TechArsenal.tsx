"use client";

import { motion } from "framer-motion";

interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
  span: string;
}

const groups: SkillGroup[] = [
  {
    category: "Frontend",
    icon: "layout",
    skills: ["Next.js", "React", "Vue.js", "JavaScript", "Tailwind CSS"],
    span: "md:col-span-2",
  },
  {
    category: "Backend / Database",
    icon: "server",
    skills: ["Node.js", "NestJS", "Express.js", "PHP", "Python", "PostgreSQL", "MongoDB", "MySQL"],
    span: "md:col-span-2",
  },
  {
    category: "Mobile",
    icon: "smartphone",
    skills: ["React Native"],
    span: "md:col-span-1",
  },
];

function IconSvg({ type }: { type: string }) {
  const size = "clamp(1.125rem, 2.2vw, 1.375rem)";
  switch (type) {
    case "layout":
      return (
        <svg style={{ width: size, height: size }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
        </svg>
      );
    case "server":
      return (
        <svg style={{ width: size, height: size }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
        </svg>
      );
    case "smartphone":
      return (
        <svg style={{ width: size, height: size }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      );
    default:
      return null;
  }
}

export function TechArsenal() {
  return (
    <section
      id="skills"
      className="relative"
      style={{ padding: "clamp(4rem, 8vh, 8rem) clamp(1.5rem, 5vw, 6rem)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "64rem" }}>
        <motion.div
          className="text-center"
          style={{ marginBottom: "clamp(2rem, 4vw, 4rem)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-[#555] uppercase font-sans"
            style={{ fontSize: "clamp(0.625rem, 1.1vw, 0.75rem)", letterSpacing: "0.3em" }}
          >
            Capabilities
          </span>
          <h2
            className="font-serif font-light"
            style={{ fontSize: "clamp(1.5rem, 4.5vw, 3rem)", marginTop: "0.5rem" }}
          >
            Technical{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B4D8]">
              Arsenal
            </span>
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-5"
          style={{ gap: "clamp(0.75rem, 1.5vw, 1rem)" }}
        >
          {groups.map((group, gi) => (
            <motion.div
              key={group.category}
              className={`${group.span} group relative transition-all duration-500 hover:border-[#00E5FF]/20`}
              style={{
                borderRadius: "clamp(10px, 1.4vw, 16px)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "clamp(1.25rem, 2.5vw, 1.75rem)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              whileHover={{
                boxShadow: "0 0 40px rgba(0, 229, 255, 0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ left: "1.5rem", right: "1.5rem" }}
              />

              <div
                className="flex items-center"
                style={{
                  gap: "clamp(0.5rem, 1vw, 0.75rem)",
                  marginBottom: "clamp(1rem, 2vw, 1.5rem)",
                }}
              >
                <div
                  className="flex items-center justify-center text-[#00E5FF]/60"
                  style={{
                    width: "clamp(2rem, 3.5vw, 2.5rem)",
                    height: "clamp(2rem, 3.5vw, 2.5rem)",
                    borderRadius: "clamp(6px, 0.8vw, 10px)",
                    background: "rgba(0, 229, 255, 0.05)",
                    border: "1px solid rgba(0, 229, 255, 0.08)",
                  }}
                >
                  <IconSvg type={group.icon} />
                </div>
                <h3
                  className="text-white/90 font-medium tracking-wide"
                  style={{ fontSize: "clamp(0.8rem, 1.3vw, 0.9rem)" }}
                >
                  {group.category}
                </h3>
              </div>

              <div className="flex flex-wrap" style={{ gap: "clamp(0.375rem, 0.8vw, 0.5rem)" }}>
                {group.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    className="text-[#bbb] hover:text-[#00E5FF] transition-all duration-300"
                    style={{
                      padding: "clamp(0.3rem, 0.6vw, 0.4rem) clamp(0.6rem, 1.2vw, 0.85rem)",
                      borderRadius: "clamp(6px, 0.8vw, 8px)",
                      fontSize: "clamp(0.65rem, 1.1vw, 0.75rem)",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: gi * 0.1 + si * 0.05 }}
                    whileHover={{
                      borderColor: "rgba(0, 229, 255, 0.2)",
                      background: "rgba(0, 229, 255, 0.04)",
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
