"use client";

import React from "react";

interface BlueBugLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

/**
 * Exact vector logo for BlueBug.
 * Directly renders the exact geometry from public/logo.svg.
 */
export function BlueBugLogo({
  size = 48,
  className = "",
  glow = true,
  animated = false,
}: BlueBugLogoProps) {
  return (
    <div
      className={`bluebug-logo-container ${className}`}
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {/* Ambient Neon Aura */}
      {glow && (
        <div
          className="bluebug-aura"
          style={{
            position: "absolute",
            inset: "-15%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(20, 129, 248, 0.45) 0%, rgba(56, 189, 248, 0.15) 45%, transparent 75%)",
            filter: "blur(8px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* Exact Vector SVG from public/logo.svg */}
      <img
        src="/logo.svg"
        alt="BlueBug Logo"
        width={size}
        height={size}
        className={`bluebug-logo-vector ${animated ? "spin-pulse" : ""}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
          filter: glow
            ? `drop-shadow(0 0 ${Math.max(4, size * 0.1)}px rgba(20, 129, 248, 0.85)) drop-shadow(0 0 ${Math.max(8, size * 0.22)}px rgba(56, 189, 248, 0.45))`
            : "none",
          transition: "filter 0.3s ease, transform 0.3s ease",
        }}
      />
    </div>
  );
}
