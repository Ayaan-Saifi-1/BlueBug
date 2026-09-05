"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueBugLogo } from "@/components/ui/BlueBugLogo";

/* ================================================================
   Interactive Quantum Particle Constellation Canvas
   Hardware-accelerated 60fps particle field with proximity laser filaments
   ================================================================ */
function ParticleCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const PARTICLE_COUNT = 55;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.5 + 0.25,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.baseAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#38bdf8";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Proximity laser lines between neighboring particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 115) * 0.22;
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: active ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    />
  );
}

/* ================================================================
   Cipher Unscramble Decryption Text Effect
   ================================================================ */
const GLYPHS = "!<>-_\\/[]{}—=+*^?#________0101";

function CipherText({ target, complete }: { target: string; complete: boolean }) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (complete) {
      setDisplay(target);
      return;
    }

    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iter) return target[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iter >= target.length) {
        clearInterval(interval);
      }
      iter += 1 / 3;
    }, 32);

    return () => clearInterval(interval);
  }, [target, complete]);

  return <span>{display}</span>;
}

/* ================================================================
   Ultra-Hyper-Premium Quantum Assembly Site Loader
   ================================================================ */
export function SiteLoader() {
  const [mounted, setMounted] = useState(false);

  // Stages:
  // "blueprint" (0 - 800ms): Laser path synthesis & 3D gimbal ignition
  // "charge" (800ms - 2100ms): Core reactor flare & matrix cipher unscramble
  // "aperture" (2100ms - 2600ms): Gimbal collapse, energy flash & sonic shockwave
  // "dock" (2600ms - 3400ms): Magnetic curved orbital flight into navbar
  // "done" (3400ms+): Seamless reveal
  const [stage, setStage] = useState<"blueprint" | "charge" | "aperture" | "dock" | "done">("blueprint");
  const [progress, setProgress] = useState(0);

  const [targetOffset, setTargetOffset] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });

  // Smooth Telemetry Progress Counter
  useEffect(() => {
    let frameId: number;
    const startTime = performance.now();
    const duration = 2300;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3.2);
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

    const t1 = setTimeout(() => setStage("charge"), 800);
    const t2 = setTimeout(() => setStage("aperture"), 2100);

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
    }, 2600);

    const t4 = setTimeout(() => {
      document.body.classList.remove("site-intro-active");
      setStage("done");
    }, 3450);

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
  const isAperture = stage === "aperture";

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
          {/* 1. Hardware-Accelerated Quantum Particle Constellation */}
          <ParticleCanvas active={!isDocking} />

          {/* 2. Deep Radial Cyber Nebula Glow */}
          <motion.div
            animate={{
              scale: isAperture ? [1, 1.35, 1.1] : [1, 1.12, 1],
              opacity: isAperture ? [0.4, 0.7, 0.4] : [0.3, 0.5, 0.3],
            }}
            transition={{ duration: isAperture ? 0.5 : 2.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "800px",
              height: "800px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(20, 129, 248, 0.38) 0%, rgba(56, 189, 248, 0.14) 42%, transparent 72%)",
              filter: "blur(80px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* 3. Subtle Coordinate Matrix Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(56, 189, 248, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.025) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              backgroundPosition: "center center",
              pointerEvents: "none",
              opacity: isDocking ? 0 : 0.8,
              transition: "opacity 0.5s ease",
              zIndex: 0,
            }}
          />

          {/* 4. Multi-Axis 3D Gyroscopic Gimbal Viewport */}
          <div
            style={{
              position: "relative",
              width: "320px",
              height: "320px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              perspective: "1100px",
              transformStyle: "preserve-3d",
              zIndex: 5,
            }}
          >
            {/* Viewfinder Corner Reticles [  ] */}
            <motion.div
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{
                scale: isDocking ? 0.8 : isAperture ? 0 : 1,
                opacity: isDocking || isAperture ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                inset: "15px",
                pointerEvents: "none",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "22px",
                  height: "22px",
                  borderTop: "2px solid #38bdf8",
                  borderLeft: "2px solid #38bdf8",
                  filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.9))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "22px",
                  height: "22px",
                  borderTop: "2px solid #38bdf8",
                  borderRight: "2px solid #38bdf8",
                  filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.9))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "22px",
                  height: "22px",
                  borderBottom: "2px solid #38bdf8",
                  borderLeft: "2px solid #38bdf8",
                  filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.9))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "22px",
                  height: "22px",
                  borderBottom: "2px solid #38bdf8",
                  borderRight: "2px solid #38bdf8",
                  filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.9))",
                }}
              />
            </motion.div>

            {/* 3D Equatorial Gimbal Ring (Tilted on X-axis, revolving) */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{
                scale: isDocking || isAperture ? 0 : 1,
                opacity: isDocking || isAperture ? 0 : 0.45,
                rotateZ: 360,
              }}
              transition={{
                rotateZ: { duration: 14, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.4 },
                opacity: { duration: 0.4 },
              }}
              style={{
                position: "absolute",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                border: "1.5px dashed rgba(56, 189, 248, 0.4)",
                transform: "rotateX(70deg)",
                boxShadow: "0 0 20px rgba(20, 129, 248, 0.25)",
                pointerEvents: "none",
              }}
            />

            {/* 3D Polar Gimbal Ring (Tilted on Y-axis, counter-revolving) */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{
                scale: isDocking || isAperture ? 0 : 1,
                opacity: isDocking || isAperture ? 0 : 0.35,
                rotateZ: -360,
              }}
              transition={{
                rotateZ: { duration: 11, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.4 },
                opacity: { duration: 0.4 },
              }}
              style={{
                position: "absolute",
                width: "210px",
                height: "210px",
                borderRadius: "50%",
                border: "1.5px dotted rgba(14, 165, 233, 0.5)",
                transform: "rotateY(65deg)",
                pointerEvents: "none",
              }}
            />

            {/* Anamorphic Horizontal Blue Cinematic Lens Flare */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: isDocking ? 0 : isAperture ? [1, 1.5, 0] : [0.85, 1.15, 0.95],
                opacity: isDocking ? 0 : isAperture ? [0.8, 1, 0] : [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: isAperture ? 0.45 : 2,
                repeat: isAperture ? 0 : Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: "420px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.2) 20%, #ffffff 50%, rgba(56, 189, 248, 0.2) 80%, transparent 100%)",
                boxShadow: "0 0 16px 2px rgba(56, 189, 248, 0.9), 0 0 32px 5px rgba(20, 129, 248, 0.6)",
                pointerEvents: "none",
                zIndex: 6,
              }}
            />

            {/* Sonic Shockwave Pulse on Aperture Lock */}
            {isAperture && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0.95 }}
                animate={{ scale: 3.2, opacity: 0 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  border: "2.5px solid #38bdf8",
                  boxShadow: "0 0 45px #1481f8, inset 0 0 30px #38bdf8",
                  pointerEvents: "none",
                  zIndex: 8,
                }}
              />
            )}

            {/* 5. THE EMBLEM: EXACT GEOMETRY WITH LASER WIREFRAME & FLIGHT */}
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
                  : isAperture
                  ? {
                      scale: [1, 1.15, 1.05],
                      opacity: 1,
                      x: 0,
                      y: 0,
                    }
                  : {
                      scale: [0.5, 1.05, 1],
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
                  : isAperture
                  ? {
                      duration: 0.45,
                      ease: "easeInOut",
                    }
                  : {
                      duration: 0.65,
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
              {/* Core Reactor Light Pulse */}
              <motion.div
                animate={{
                  scale: isAperture ? [1, 1.45, 1] : [1, 1.18, 1],
                  opacity: isAperture ? [0.6, 1, 0.6] : [0.4, 0.8, 0.4],
                }}
                transition={{ duration: isAperture ? 0.35 : 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  width: "55px",
                  height: "75px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.95) 0%, rgba(20, 129, 248, 0.55) 50%, transparent 85%)",
                  filter: "blur(12px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />

              {/* Exact Geometry SVG Vector Emblem */}
              <BlueBugLogo size={130} glow={true} />
            </motion.div>
          </div>

          {/* 6. TELEMETRY HUD & CRYPTOGRAPHIC CIPHER UNSCRAMBLE */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{
              opacity: isDocking ? 0 : 1,
              y: isDocking ? -16 : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              marginTop: "2.25rem",
              textAlign: "center",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            {/* Decrypted Brand Title */}
            <div
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: "1.35rem",
                fontWeight: 800,
                letterSpacing: "0.22em",
                color: "#FFFFFF",
                textShadow: "0 0 20px rgba(56, 189, 248, 0.7)",
                marginBottom: "0.5rem",
              }}
            >
              <CipherText target="BLUEBUG" complete={progress >= 95} />
            </div>

            {/* Precision Percentage & Glowing Progress Caliper */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                margin: "0.3rem 0",
              }}
            >
              <div
                style={{
                  fontFamily: "ui-monospace, monospace",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#38bdf8",
                  letterSpacing: "0.08em",
                  minWidth: "40px",
                  textAlign: "right",
                }}
              >
                {String(progress).padStart(2, "0")}%
              </div>

              <div
                style={{
                  width: "160px",
                  height: "2px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #0284c7, #38bdf8)",
                    boxShadow: "0 0 10px #38bdf8",
                    borderRadius: "999px",
                    transition: "width 0.08s linear",
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: "0.65rem",
                  fontFamily: "ui-monospace, monospace",
                  color: "rgba(148, 163, 184, 0.6)",
                  letterSpacing: "0.1em",
                }}
              >
                SYNC
              </div>
            </div>

            {/* Cryptographic Sub-Telemetry Line */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.64rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: progress >= 100 ? "#38bdf8" : "rgba(148, 163, 184, 0.75)",
                marginTop: "0.35rem",
                transition: "color 0.3s ease",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  backgroundColor: progress >= 100 ? "#38bdf8" : "#1481f8",
                  boxShadow: "0 0 8px #38bdf8",
                  display: "inline-block",
                }}
              />
              <span>
                {progress >= 100
                  ? "SYSTEM ONLINE // DOCKED"
                  : progress > 50
                  ? "CALIBRATING QUANTUM ARCHITECTURE"
                  : "INITIALIZING ENCRYPTED KERNEL"}
              </span>
            </div>
          </motion.div>

          {/* Quick Skip Control */}
          <div
            style={{
              position: "absolute",
              bottom: "2.25rem",
              fontSize: "0.68rem",
              fontFamily: "ui-monospace, monospace",
              color: "rgba(148, 163, 184, 0.3)",
              letterSpacing: "0.1em",
            }}
          >
            PRESS ESC OR CLICK TO SKIP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
