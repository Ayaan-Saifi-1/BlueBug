"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueBugLogo } from "@/components/ui/BlueBugLogo";

export function SiteLoader() {
  const [mounted, setMounted] = useState(false);
  // Stages:
  // "boot" (0 - 500ms): Reticle viewfinder locks in, emblem enters with spring
  // "scan" (500ms - 1750ms): Laser sheen sweep, reactor core charge, telemetry ticker 0% -> 90%
  // "energize" (1750ms - 2350ms): 100% SYSTEM ONLINE, shockwave pulse & flash
  // "dock" (2350ms - 3150ms): Emblem glides and scales into navbar
  // "done" (3150ms+): Complete
  const [stage, setStage] = useState<"boot" | "scan" | "energize" | "dock" | "done">("boot");
  const [progress, setProgress] = useState(0);

  const [targetOffset, setTargetOffset] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });

  // Animated Telemetry Counter (0% -> 100%)
  useEffect(() => {
    let frameId: number;
    const startTime = performance.now();
    const duration = 2100; // 2.1s to reach 100%

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

    const t1 = setTimeout(() => setStage("scan"), 500);
    const t2 = setTimeout(() => setStage("energize"), 1800);

    const t3 = setTimeout(() => {
      const targetEl =
        document.getElementById("navbar-brand-icon-target") ||
        document.getElementById("navbar-brand-logo");

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;

        const deltaX = targetCenterX - centerX;
        const deltaY = targetCenterY - centerY;
        const scale = (rect.width || 48) / 130;

        setTargetOffset({ x: deltaX, y: deltaY, scale });
      } else {
        setTargetOffset({
          x: -(window.innerWidth / 2) + 54,
          y: -(window.innerHeight / 2) + 34,
          scale: 48 / 130,
        });
      }
      setStage("dock");
    }, 2400);

    const t4 = setTimeout(() => {
      document.body.classList.remove("site-intro-active");
      setStage("done");
    }, 3250);

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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
              width: "750px",
              height: "750px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(20, 129, 248, 0.35) 0%, rgba(56, 189, 248, 0.12) 40%, transparent 70%)",
              filter: "blur(75px)",
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
              backgroundSize: "40px 40px",
              backgroundPosition: "center center",
              pointerEvents: "none",
              opacity: isDocking ? 0 : 0.8,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* Central Telemetry Viewfinder Frame (HUD) */}
          <div
            style={{
              position: "relative",
              width: "280px",
              height: "280px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                  width: "20px",
                  height: "20px",
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
                  width: "20px",
                  height: "20px",
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
                  width: "20px",
                  height: "20px",
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
                  width: "20px",
                  height: "20px",
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
                opacity: isDocking ? 0 : 0.45,
                rotate: 360,
              }}
              transition={{
                rotate: { duration: 16, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.5 },
                opacity: { duration: 0.4 },
              }}
              style={{
                position: "absolute",
                width: "230px",
                height: "230px",
                borderRadius: "50%",
                border: "1px dashed rgba(56, 189, 248, 0.4)",
                boxShadow: "0 0 15px rgba(20, 129, 248, 0.2)",
                pointerEvents: "none",
              }}
            />

            {/* Inner Concentric Caliper Ring (Counter-Clockwise) */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isDocking ? 0.3 : 1,
                opacity: isDocking ? 0 : 0.3,
                rotate: -360,
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.5 },
                opacity: { duration: 0.4 },
              }}
              style={{
                position: "absolute",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                border: "1px dotted rgba(14, 165, 233, 0.5)",
                pointerEvents: "none",
              }}
            />

            {/* High-Energy Shockwave Pulse on 100% Lock-in */}
            {stage === "energize" && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0.9 }}
                animate={{ scale: 2.6, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  border: "2px solid #38bdf8",
                  boxShadow: "0 0 35px #1481f8, inset 0 0 25px #38bdf8",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* THE EMBLEM: Features Holographic Laser Sheen & Docking Flight */}
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
                      scale: [1, 1.12, 1.05],
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
                width: 130,
                height: 130,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              {/* Laser Beam Sheen / Liquid Light Scan */}
              <div
                style={{
                  position: "absolute",
                  inset: "-10%",
                  overflow: "hidden",
                  borderRadius: "50%",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                <motion.div
                  initial={{ x: "-150%", opacity: 0 }}
                  animate={{
                    x: ["-120%", "140%"],
                    opacity: stage !== "boot" && !isDocking ? [0, 0.9, 0] : 0,
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: isDocking ? 0 : Infinity,
                    repeatDelay: 0.4,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "50%",
                    background:
                      "linear-gradient(105deg, transparent 15%, rgba(255, 255, 255, 0.7) 48%, rgba(56, 189, 248, 0.9) 52%, transparent 80%)",
                    transform: "skewX(-20deg)",
                    mixBlendMode: "color-dodge",
                  }}
                />
              </div>

              {/* Reactor Core Light Pulse */}
              <motion.div
                animate={{
                  scale: stage === "energize" ? [1, 1.4, 1] : [1, 1.15, 1],
                  opacity: stage === "energize" ? [0.6, 1, 0.7] : [0.4, 0.8, 0.4],
                }}
                transition={{ duration: stage === "energize" ? 0.4 : 1.6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  width: "50px",
                  height: "70px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.9) 0%, rgba(20, 129, 248, 0.5) 50%, transparent 85%)",
                  filter: "blur(10px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Exact Geometry SVG Vector Emblem */}
              <BlueBugLogo size={130} glow={true} />
            </motion.div>
          </div>

          {/* TELEMETRY HUD & NUMERIC COUNTER (Fades out cleanly upon docking) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: isDocking ? 0 : 1,
              y: isDocking ? -15 : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              marginTop: "2rem",
              textAlign: "center",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            {/* Numeric Percentage Ticker */}
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "baseline",
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
                width: "180px",
                height: "3px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "999px",
                overflow: "hidden",
                margin: "0.75rem 0 0.6rem 0",
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
                gap: "0.5rem",
                fontSize: "0.68rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: stage === "energize" ? "#38bdf8" : "rgba(148, 163, 184, 0.8)",
                transition: "color 0.3s ease",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: stage === "energize" ? "#38bdf8" : "#1481f8",
                  boxShadow: "0 0 8px #38bdf8",
                  display: "inline-block",
                }}
              />
              <span>{statusText}</span>
            </div>
          </motion.div>

          {/* Quick Skip Prompt */}
          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              fontSize: "0.72rem",
              fontFamily: "ui-monospace, monospace",
              color: "rgba(148, 163, 184, 0.35)",
              letterSpacing: "0.08em",
            }}
          >
            CLICK OR ESC TO BYPASS
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
