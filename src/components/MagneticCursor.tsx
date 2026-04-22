"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorVariant = "default" | "hover" | "3d";

export function MagneticCursor() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only show on devices with a precise, hover-capable pointer (mouse/trackpad).
    // Excludes phones and touch-only tablets; includes iPad with trackpad.
    const supportsHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!supportsHover) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      });
    };

    const resolveVariant = (target: EventTarget | null): CursorVariant => {
      if (!(target instanceof HTMLElement) && !(target instanceof SVGElement)) {
        return "default";
      }
      const el = target as HTMLElement;
      if (el.closest('[data-cursor="3d"]')) return "3d";
      if (
        el.closest("a, button, [data-magnetic]") ||
        el.tagName === "A" ||
        el.tagName === "BUTTON"
      ) {
        return "hover";
      }
      return "default";
    };

    const onMouseOver = (e: MouseEvent) => setVariant(resolveVariant(e.target));
    const onMouseOut = (e: MouseEvent) => {
      const next = resolveVariant(e.relatedTarget);
      setVariant(next);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const isHover = variant === "hover";
  const is3d = variant === "3d";

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
      style={{ x, y }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: is3d ? 72 : isHover ? 60 : 12,
          height: is3d ? 72 : isHover ? 60 : 12,
          backgroundColor: is3d ? "rgba(255,255,255,0)" : "#ffffff",
          borderWidth: is3d ? 1.5 : 0,
          borderColor: "rgba(255,255,255,0.85)",
          filter: isHover ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ borderStyle: "solid" }}
      />
    </motion.div>
  );
}
