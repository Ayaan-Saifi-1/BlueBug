"use client";
import { useRef, useCallback } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;   // max degrees of tilt, default 8
}

export function TiltCard({ children, className = "", style, maxTilt = 8 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const shine = shineRef.current;
    if (!card || !shine) return;

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      // cx, cy: 0 to 1 position within card
      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;
      // rotateY: positive when cursor is right, negative when left
      const rotY = (cx - 0.5) * maxTilt * 2;
      // rotateX: positive when cursor is top, negative when bottom (inverted)
      const rotX = (0.5 - cy) * maxTilt * 2;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;

      // Move shine gradient to follow cursor position
      const shineX = cx * 100;
      const shineY = cy * 100;
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(56, 189, 248, 0.13) 0%, transparent 60%)`;
      shine.style.opacity = "1";
    });
  }, [maxTilt]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const shine = shineRef.current;
    if (!card || !shine) return;
    cancelAnimationFrame(frameRef.current);
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    card.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
    shine.style.opacity = "0";

    // Remove transition override after reset completes
    setTimeout(() => {
      if (card) card.style.transition = "";
    }, 450);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      style={{
        position: "relative",
        willChange: "transform",
        transformStyle: "preserve-3d",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic shine overlay — pointer-events none */}
      <div
        ref={shineRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          opacity: 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
