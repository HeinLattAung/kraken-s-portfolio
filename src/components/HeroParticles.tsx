"use client";

import { useEffect, useRef, useCallback } from "react";

// --- Obsidian shard (dark angular floating shape) ---
interface Shard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  size: number;
  sides: number;
  opacity: number;
}

// --- Cobalt filament (thin glowing line) ---
interface Filament {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  phase: number;
  speed: number;
  opacity: number;
}

function drawShard(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, sides: number, rotation: number, opacity: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 / sides) * i;
    const r = size * (0.7 + Math.sin(i * 2.1) * 0.3);
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  // Fill: deep charcoal
  ctx.fillStyle = `rgba(18, 18, 28, ${opacity * 0.6})`;
  ctx.fill();

  // Edge: subtle lighter rim
  ctx.strokeStyle = `rgba(50, 55, 75, ${opacity * 0.3})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.restore();
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const shardsRef = useRef<Shard[]>([]);
  const filamentsRef = useRef<Filament[]>([]);
  const frameRef = useRef<number>(0);

  const init = useCallback((w: number, h: number) => {
    // Create obsidian shards
    const isMobile = w < 768;
    const shardCount = Math.min(Math.floor((w * h) / (isMobile ? 60000 : 40000)), isMobile ? 12 : 25);
    shardsRef.current = Array.from({ length: shardCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.12,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.003,
      size: Math.random() * 25 + 8,
      sides: Math.floor(Math.random() * 3) + 4,
      opacity: Math.random() * 0.4 + 0.15,
    }));

    // Create cobalt filaments
    const filCount = Math.min(Math.floor((w * h) / (isMobile ? 80000 : 60000)), isMobile ? 8 : 15);
    filamentsRef.current = Array.from({ length: filCount }, () => {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const angle = Math.random() * Math.PI * 2;
      const len = Math.random() * 120 + 40;
      return {
        x1: cx - Math.cos(angle) * len / 2,
        y1: cy - Math.sin(angle) * len / 2,
        x2: cx + Math.cos(angle) * len / 2,
        y2: cy + Math.sin(angle) * len / 2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.3,
        opacity: Math.random() * 0.2 + 0.08,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(rect.width, rect.height);
    };

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const handleMouse = (e: MouseEvent) => {
      if (isTouch) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    resize();

    let lastTime = performance.now();

    const draw = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const time = now / 1000;

      const w = canvas.width / Math.min(window.devicePixelRatio, 2);
      const h = canvas.height / Math.min(window.devicePixelRatio, 2);
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // --- Draw cobalt filaments ---
      for (const f of filamentsRef.current) {
        const pulse = Math.sin(time * f.speed + f.phase) * 0.5 + 0.5;
        const alpha = f.opacity * (0.5 + pulse * 0.5);

        ctx.beginPath();
        ctx.moveTo(f.x1, f.y1);
        ctx.lineTo(f.x2, f.y2);
        ctx.strokeStyle = `rgba(20, 70, 160, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Glow layer
        ctx.beginPath();
        ctx.moveTo(f.x1, f.y1);
        ctx.lineTo(f.x2, f.y2);
        ctx.strokeStyle = `rgba(30, 90, 200, ${alpha * 0.3})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // --- Draw obsidian shards ---
      for (const s of shardsRef.current) {
        // Mouse interaction — subtle drift away
        const dx = s.x - mx;
        const dy = s.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = ((200 - dist) / 200) * 0.15;
          s.vx += (dx / dist) * force * dt * 60;
          s.vy += (dy / dist) * force * dt * 60;
        }

        // Slow organic drift
        s.vx += Math.sin(time * 0.4 + s.rotation) * 0.003;
        s.vy += Math.cos(time * 0.3 + s.size) * 0.002;

        s.vx *= 0.995;
        s.vy *= 0.995;
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        // Wrap
        if (s.x < -50) s.x = w + 50;
        if (s.x > w + 50) s.x = -50;
        if (s.y < -50) s.y = h + 50;
        if (s.y > h + 50) s.y = -50;

        drawShard(ctx, s.x, s.y, s.size, s.sides, s.rotation, s.opacity);
      }

      // --- Connections between nearby shards (thin cobalt) ---
      const shards = shardsRef.current;
      for (let i = 0; i < shards.length; i++) {
        for (let j = i + 1; j < shards.length; j++) {
          const d = Math.hypot(shards[i].x - shards[j].x, shards[i].y - shards[j].y);
          if (d < 180) {
            const alpha = (1 - d / 180) * 0.05;
            ctx.beginPath();
            ctx.moveTo(shards[i].x, shards[i].y);
            ctx.lineTo(shards[j].x, shards[j].y);
            ctx.strokeStyle = `rgba(20, 70, 160, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.8, background: "transparent" }}
      aria-hidden="true"
    />
  );
}
