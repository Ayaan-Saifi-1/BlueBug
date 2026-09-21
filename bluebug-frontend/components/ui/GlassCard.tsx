"use client";
import { useRef, useCallback } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean; // if true, adds glow border on hover
}

export function GlassCard({ children, className = "", style, hover = true }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !hover) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--gx", `${x}%`);
    el.style.setProperty("--gy", `${y}%`);
  }, [hover]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el || !hover) return;
    el.style.setProperty("--gx", "50%");
    el.style.setProperty("--gy", "50%");
  }, [hover]);

  return (
    <div
      ref={ref}
      className={`glass-card ${hover ? "glass-card--hover" : ""} ${className}`}
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
