"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueBugLogo } from "@/components/ui/BlueBugLogo";

export function SiteLoader() {
  const [mounted, setMounted] = useState(false);
  // Stages:
  // "pop" (0 - 500ms): Emblem pops into center
  // "rotate" (500ms - 2300ms): Majestic 360° spin with radiant aura
  // "hold" (2300ms - 2700ms): Brand lock-in pulse
  // "dock" (2700ms - 3600ms): Fly and scale into navbar
  // "done" (3600ms+): Complete
  const [stage, setStage] = useState<"pop" | "rotate" | "hold" | "dock" | "done">("pop");

  const [targetOffset, setTargetOffset] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });

  useEffect(() => {
    setMounted(true);
    // Mark body as intro loading so navbar mark doesn't double-render
    document.body.classList.add("site-intro-active");

    const t1 = setTimeout(() => {
      setStage("rotate");
    }, 500);

    const t2 = setTimeout(() => {
      setStage("hold");
    }, 2300);

    const t3 = setTimeout(() => {
      // Measure the exact position of the navbar logo target
      const targetEl =
        document.getElementById("navbar-brand-icon-target") ||
        document.getElementById("navbar-brand-logo");

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        // Target center
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;

        const deltaX = targetCenterX - centerX;
        const deltaY = targetCenterY - centerY;
        // Ratio of navbar size (48px) to loader emblem size (130px)
        const scale = (rect.width || 48) / 130;

        setTargetOffset({ x: deltaX, y: deltaY, scale });
      } else {
        // Fallback target: top-left corner with standard navbar padding
        setTargetOffset({
          x: -(window.innerWidth / 2) + 54,
          y: -(window.innerHeight / 2) + 34,
          scale: 48 / 130,
        });
      }
      setStage("dock");
    }, 2700);

    const t4 = setTimeout(() => {
      document.body.classList.remove("site-intro-active");
      setStage("done");
    }, 3650);

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

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
          key="site-loader-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: isDocking ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: isDocking ? 0.35 : 0 }}
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
          {/* Deep Ambient Space Glow */}
          <div
            style={{
              position: "absolute",
              width: "700px",
              height: "700px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(20, 129, 248, 0.3) 0%, rgba(56, 189, 248, 0.1) 40%, transparent 70%)",
              filter: "blur(70px)",
              pointerEvents: "none",
            }}
          />

          {/* High-Tech Orbital Rings (Rotating opposite direction) */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{
              scale: isDocking ? 0.4 : 1,
              opacity: isDocking ? 0 : [0.4, 0.7, 0.4],
              rotate: 360,
            }}
            transition={{
              rotate: { duration: 12, repeat: Infinity, ease: "linear" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.6 },
            }}
            style={{
              position: "absolute",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              border: "1px dashed rgba(56, 189, 248, 0.35)",
              pointerEvents: "none",
            }}
          />

          {/* Shockwave Rings on Pop */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.6, 2.2, 2.8],
              opacity: [0, 0.55, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: 0,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              border: "2px solid rgba(56, 189, 248, 0.6)",
              boxShadow: "0 0 35px rgba(20, 129, 248, 0.6)",
              pointerEvents: "none",
            }}
          />

          {/* ONLY the pure Blue Emblem moves & flies to its designated place */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 35 }}
            animate={
              isDocking
                ? {
                    x: targetOffset.x,
                    y: targetOffset.y,
                    scale: targetOffset.scale,
                    opacity: 1,
                  }
                : stage === "hold"
                ? {
                    scale: [1, 1.08, 1],
                    rotate: 360,
                    opacity: 1,
                    y: 0,
                  }
                : stage === "rotate"
                ? {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    rotate: [0, 360],
                  }
                : {
                    scale: [0, 1.25, 1],
                    opacity: 1,
                    y: 0,
                  }
            }
            transition={
              isDocking
                ? {
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                  }
                : stage === "hold"
                ? {
                    duration: 0.4,
                    ease: "easeInOut",
                  }
                : stage === "rotate"
                ? {
                    rotate: { duration: 1.8, ease: [0.25, 1, 0.5, 1] },
                    duration: 0.6,
                  }
                : {
                    duration: 0.5,
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
            {/* Pure SVG Vector Logo — Zero PNG, Zero White Background */}
            <BlueBugLogo size={130} glow={true} />
          </motion.div>

          {/* Center Brand Title & Subtitle (Fades out cleanly when docking begins) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: isDocking ? 0 : stage !== "pop" ? 1 : 0,
              y: isDocking ? -12 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              marginTop: "2rem",
              textAlign: "center",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
                margin: 0,
                textShadow: "0 0 24px rgba(20, 129, 248, 0.6)",
              }}
            >
              Blue<span style={{ color: "#38bdf8" }}>Bug</span>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "999px",
                background: "rgba(20, 129, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.2)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#38bdf8",
                  boxShadow: "0 0 8px #38bdf8",
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(186, 230, 253, 0.9)",
                }}
              >
                Engineering &amp; Systems
              </span>
            </div>
          </motion.div>

          {/* Skip hint */}
          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              fontSize: "0.75rem",
              color: "rgba(148, 163, 184, 0.45)",
              letterSpacing: "0.06em",
            }}
          >
            Click anywhere or press ESC to skip
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
