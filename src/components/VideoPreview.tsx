"use client";

import { useRef, useEffect, useState, useCallback, CSSProperties } from "react";

interface VideoPreviewProps {
  src: string;
  className?: string;
  style?: CSSProperties;
}

export function VideoPreview({ src, className = "", style }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Intersection Observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Force load when in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;
    video.load();
  }, [isInView]);

  // Auto-play on mobile when in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView || !isLoaded) return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) {
      video.playbackRate = 0.5;
      video.play().catch(() => {});
    }
  }, [isInView, isLoaded]);

  // Pause when out of view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!isInView && isLoaded) {
      video.pause();
    }
  }, [isInView, isLoaded]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.5;
      video.play().catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#111] ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#0a0a0a] flex items-center justify-center z-10">
          <div
            className="border-2 border-[#00E5FF]/30 border-t-[#00E5FF] rounded-full animate-spin"
            style={{ width: "clamp(1.25rem, 3vw, 2rem)", height: "clamp(1.25rem, 3vw, 2rem)" }}
          />
        </div>
      )}

      {isInView && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={handleCanPlay}
          onLoadedData={handleCanPlay}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
        style={{
          opacity: isHovered ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
