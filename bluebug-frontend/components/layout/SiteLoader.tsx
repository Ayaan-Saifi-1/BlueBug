"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueBugLogo } from "@/components/ui/BlueBugLogo";
import { LoaderCanvas } from "@/components/ui/LoaderCanvas";

export function SiteLoader() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Stages:
  // "boot" (0 - 700ms): Reticle viewfinder locks in, emblem & hexagon initialize
  // "scan" (700ms - 3200ms): Reactor core charge, particles converge, telemetry ticker 0% -> 99%
  // "energize" (3200ms - 4100ms): 100% SYSTEM ONLINE, shockwave pulse & core flash
  // "dock" (4100ms - 5000ms): Emblem glides and scales smoothly into navbar logo
  // "done" (5000ms+): Complete & unmounted
  const [stage, setStage] = useState<"boot" | "scan" | "energize" | "dock" | "done">("boot");
  const [progress, setProgress] = useState(0);

  const [targetOffset, setTargetOffset] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });

  // Responsive mobile screen detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth cinematic telemetry counter (0% -> 100% over 3.4 seconds)
  useEffect(() => {
    let frameId: number;
    const startTime = performance.now();
    const duration = 3400; // 3.4s to reach 100% for an unhurried, luxury feel

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Smooth cubic ease out
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        frameId = requestAnimationFrame(updateCounter);
      }
    };

    frameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("site-intro-active");

    const t1 = setTimeout(() => setStage("scan"), 700);
    const t2 = setTimeout(() => setStage("energize"), 3200);

    const t3 = setTimeout(() => {
      const targetEl =
        document.getElementById("navbar-brand-icon-target") ||
        document.getElementById("navbar-brand-logo");

      const mob = window.innerWidth < 640;
      const emblemBaseSize = mob ? 80 : 116;

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;

        const deltaX = targetCenterX - centerX;
        const deltaY = targetCenterY - centerY;
        const scale = (rect.width || 46) / emblemBaseSize;

        setTargetOffset({ x: deltaX, y: deltaY, scale });
      } else {
        setTargetOffset({
          x: -(window.innerWidth / 2) + (mob ? 34 : 54),
          y: -(window.innerHeight / 2) + 34,
          scale: 46 / emblemBaseSize,
        });
      }
      setStage("dock");
    }, 4100);

    const t4 = setTimeout(() => {
      document.body.classList.remove("site-intro-active");
      setStage("done");
    }, 5000);

    const handleSkip = (e: KeyboardEvent | MouseEvent) => {
      if ("key" in e && e.key !== "Escape") return;
      document.body.classList.remove("site-intro-active");
      setStage("done");
    };

    window.addEventListener("keydown", handleSkip);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.classList.remove("site-intro-active");
      window.removeEventListener("keydown", handleSkip);
    };
  }, []);

  if (!mounted) return null;

  const isDocking = stage === "dock";

  // Dynamic telemetry status text based on counter
  let statusText = "INITIALIZING BLUEBUG KERNEL";
  if (progress > 30 && progress <= 75) {
    statusText = "SYNCHRONIZING SECURE ARCHITECTURE";
  } else if (progress > 75 && progress < 100) {
    statusText = "CALIBRATING ASSETS & NEURAL PATHS";
  } else if (progress >= 100) {
    statusText = "SYSTEM ONLINE // DOCKING";
  }

  const emblemSize = isMobile ? 80 : 116;
  const hexSize = isMobile ? 152 : 216;
  const hudSize = isMobile ? 200 : 276;
  const outerRingSize = isMobile ? 172 : 240;
  const nebulaSize = isMobile ? "360px" : "750px";

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
          key="site-loader-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: isDocking ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: isDocking ? 0.3 : 0 }}
          onClick={() => {
            document.body.classList.remove("site-intro-active");
            setStage("done");
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "#030712",
            cursor: "pointer",
            overflow: "hidden",
            pointerEvents: isDocking ? "none" : "auto",
          }}
        >
          {/* Deep Ambient Space Nebula */}
          <motion.div
            animate={{
              scale: stage === "energize" ? [1, 1.25, 1.1] : [1, 1.08, 1],
              opacity: stage === "energize" ? [0.35, 0.6, 0.35] : [0.3, 0.45, 0.3],
            }}
            transition={{ duration: stage === "energize" ? 0.6 : 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: nebulaSize,
              height: nebulaSize,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(20, 129, 248, 0.35) 0%, rgba(56, 189, 248, 0.12) 40%, transparent 70%)",
              filter: isMobile ? "blur(45px)" : "blur(75px)",
              pointerEvents: "none",
            }}
          />

          {/* Holographic Background Matrix Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)",
              backgroundSize: isMobile ? "28px 28px" : "40px 40px",
              backgroundPosition: "center center",
              pointerEvents: "none",
              opacity: isDocking ? 0 : 0.8,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* Three.js Holographic Bug Assembly & Quantum Warp Canvas */}
          <LoaderCanvas progress={progress} stage={stage} />

          {/* Central Telemetry Viewfinder Frame (HUD): pinned at exact dead-center */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: `${hudSize}px`,
              height: `${hudSize}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            {/* Viewfinder Reticle Corner Brackets [  ] */}
            <motion.div
              initial={{ scale: 1.35, opacity: 0 }}
              animate={{
                scale: isDocking ? 0.8 : stage === "energize" ? 1.05 : 1,
                opacity: isDocking ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              {/* Top-Left Bracket */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: isMobile ? "16px" : "20px",
                  height: isMobile ? "16px" : "20px",
                  borderTop: "2px solid #38bdf8",
                  borderLeft: "2px solid #38bdf8",
                  filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))",
                }}
              />
              {/* Top-Right Bracket */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: isMobile ? "16px" : "20px",
                  height: isMobile ? "16px" : "20px",
                  borderTop: "2px solid #38bdf8",
                  borderRight: "2px solid #38bdf8",
                  filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))",
                }}
              />
              {/* Bottom-Left Bracket */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: isMobile ? "16px" : "20px",
                  height: isMobile ? "16px" : "20px",
                  borderBottom: "2px solid #38bdf8",
                  borderLeft: "2px solid #38bdf8",
                  filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))",
                }}
              />
              {/* Bottom-Right Bracket */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: isMobile ? "16px" : "20px",
                  height: isMobile ? "16px" : "20px",
                  borderBottom: "2px solid #38bdf8",
                  borderRight: "2px solid #38bdf8",
                  filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.8))",
                }}
              />
            </motion.div>

            {/* Outer Concentric Caliper Ring (Clockwise) */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isDocking ? 0.3 : 1,
                opacity: isDocking ? 0 : 0.4,
                rotate: 360,
              }}
              transition={{
                rotate: { duration: 22, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.5 },
                opacity: { duration: 0.4 },
              }}
              style={{
                position: "absolute",
                width: `${outerRingSize}px`,
                height: `${outerRingSize}px`,
                borderRadius: "50%",
                border: "1px dashed rgba(56, 189, 248, 0.35)",
                boxShadow: "0 0 15px rgba(20, 129, 248, 0.15)",
                pointerEvents: "none",
              }}
            />

            {/* High-Energy Shockwave Pulse on 100% Lock-in */}
            {stage === "energize" && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0.95 }}
                animate={{ scale: 2.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: `${hexSize}px`,
                  height: `${hexSize}px`,
                  borderRadius: "50%",
                  border: "2px solid #38bdf8",
                  boxShadow: "0 0 35px #1481f8, inset 0 0 25px #38bdf8",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
            )}

            {/* Cyber-Hexagon Containment Shield: Exactly concentric around the bug logo */}
            <motion.svg
              width={hexSize}
              height={hexSize}
              viewBox="0 0 200 200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isDocking ? 0.3 : stage === "energize" ? [1, 1.05, 1] : 1,
                opacity: isDocking ? 0 : 1,
              }}
              transition={{
                scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.4 },
              }}
              style={{
                position: "absolute",
                pointerEvents: "none",
                zIndex: 4,
                overflow: "visible",
                filter: "drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))",
              }}
            >
              {/* Outer Glowing Hexagon */}
              <polygon
                points="100,4 183,52 183,148 100,196 17,148 17,52"
                fill="rgba(20, 129, 248, 0.04)"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* Inner Dashed Tech Hexagon */}
              <polygon
                points="100,16 172,58 172,142 100,184 28,142 28,58"
                fill="none"
                stroke="#1481f8"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                strokeOpacity="0.75"
              />

              {/* 6 Glowing Corner Node Pips at Vertices */}
              <circle cx="100" cy="4" r="3" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
              <circle cx="183" cy="52" r="3" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
              <circle cx="183" cy="148" r="3" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
              <circle cx="100" cy="196" r="3" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
              <circle cx="17" cy="148" r="3" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
              <circle cx="17" cy="52" r="3" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />

              {/* Calibration Ticks at midpoint edges */}
              <line x1="141.5" y1="28" x2="141.5" y2="33" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="183" y1="100" x2="178" y2="100" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="141.5" y1="172" x2="141.5" y2="167" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="58.5" y1="172" x2="58.5" y2="167" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="17" y1="100" x2="22" y2="100" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="58.5" y1="28" x2="58.5" y2="33" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.8" />
            </motion.svg>

            {/* THE EMBLEM: Centered with exact geometry and reactor core pulse */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={
                isDocking
                  ? {
                      x: targetOffset.x,
                      y: targetOffset.y,
                      scale: targetOffset.scale,
                      opacity: 1,
                    }
                  : stage === "energize"
                  ? {
                      scale: [1, 1.1, 1.04],
                      opacity: 1,
                      x: 0,
                      y: 0,
                    }
                  : {
                      scale: [0.6, 1.05, 1],
                      opacity: 1,
                      x: 0,
                      y: 0,
                    }
              }
              transition={
                isDocking
                  ? {
                      duration: 0.85,
                      ease: [0.16, 1, 0.3, 1],
                    }
                  : stage === "energize"
                  ? {
                      duration: 0.45,
                      ease: "easeInOut",
                    }
                  : {
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }
              }
              style={{
                position: "relative",
                width: emblemSize,
                height: emblemSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              {/* Reactor Core Light Pulse (No sheen effect!) */}
              <motion.div
                animate={{
                  scale: stage === "energize" ? [1, 1.35, 1] : [1, 1.12, 1],
                  opacity: stage === "energize" ? [0.6, 0.95, 0.65] : [0.35, 0.7, 0.35],
                }}
                transition={{ duration: stage === "energize" ? 0.4 : 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  width: isMobile ? "36px" : "48px",
                  height: isMobile ? "50px" : "66px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.85) 0%, rgba(20, 129, 248, 0.4) 50%, transparent 85%)",
                  filter: "blur(10px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Exact Geometry SVG Vector Emblem */}
              <BlueBugLogo size={emblemSize} glow={true} />
            </motion.div>
          </div>

          {/* TELEMETRY HUD & NUMERIC COUNTER: Centered cleanly vertically below the central hub */}
          <div
            style={{
              position: "absolute",
              top: `calc(50% + ${hudSize / 2 + (isMobile ? 14 : 22)}px)`,
              left: 0,
              right: 0,
              margin: "0 auto",
              zIndex: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              width: "100%",
              maxWidth: isMobile ? "280px" : "360px",
              padding: "0 1rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: isDocking ? 0 : 1,
                y: isDocking ? -12 : 0,
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Numeric Percentage Ticker */}
              <div
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: isMobile ? "1.25rem" : "1.45rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#FFFFFF",
                  display: "inline-flex",
                  alignItems: "baseline",
                  justifyContent: "center",
                  gap: "0.25rem",
                  textShadow: "0 0 16px rgba(56, 189, 248, 0.7)",
                }}
              >
                <span>{String(progress).padStart(2, "0")}</span>
                <span style={{ fontSize: "0.85rem", color: "#38bdf8" }}>%</span>
              </div>

              {/* Glowing Linear Progress Bar */}
              <div
                style={{
                  width: isMobile ? "130px" : "170px",
                  height: "3px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  margin: "0.5rem 0 0.45rem 0",
                  position: "relative",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #1481f8, #38bdf8)",
                    boxShadow: "0 0 10px #38bdf8",
                    borderRadius: "999px",
                    transition: "width 0.1s linear",
                  }}
                />
              </div>

              {/* Dynamic Telemetry Status Line */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  fontSize: isMobile ? "0.6rem" : "0.68rem",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  letterSpacing: isMobile ? "0.08em" : "0.14em",
                  textTransform: "uppercase",
                  color: stage === "energize" ? "#38bdf8" : "rgba(148, 163, 184, 0.8)",
                  transition: "color 0.3s ease",
                  padding: "0 0.5rem",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    minWidth: "5px",
                    borderRadius: "50%",
                    backgroundColor: stage === "energize" ? "#38bdf8" : "#1481f8",
                    boxShadow: "0 0 8px #38bdf8",
                    display: "inline-block",
                  }}
                />
                <span>{statusText}</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Skip Prompt */}
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? "1.5rem" : "2.5rem",
              left: 0,
              right: 0,
              margin: "0 auto",
              textAlign: "center",
              fontSize: isMobile ? "0.65rem" : "0.72rem",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              color: "rgba(148, 163, 184, 0.4)",
              letterSpacing: "0.1em",
              width: "100%",
              pointerEvents: "none",
            }}
          >
            TAP OR CLICK TO BYPASS
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
