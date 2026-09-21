"use client";
import { useEffect, useRef } from "react";

export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    // Show cursor elements
    dot.style.opacity = "1";
    ring.style.opacity = "1";
    // Hide default cursor site-wide via class on body
    document.body.classList.add("custom-cursor-active");

    let mx = -100, my = -100; // mouse position
    let rx = -100, ry = -100; // ring position (lerped)
    let animId: number;
    let isHovering = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      // Move dot immediately
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor-attract]");
      if (interactive) {
        isHovering = true;
        ring.classList.add("cursor-ring--hover");
        dot.classList.add("cursor-dot--hover");
      }
    };

    const onLeave = () => {
      isHovering = false;
      ring.classList.remove("cursor-ring--hover");
      dot.classList.remove("cursor-dot--hover");
    };

    // Smooth ring follow with spring lerp
    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick() {
      animId = requestAnimationFrame(tick);
      const speed = isHovering ? 0.12 : 0.08;
      rx = lerp(rx, mx, speed);
      ry = lerp(ry, my, speed);
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    }
    tick();

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
      {/* Small instant dot */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      {/* Large lagging ring */}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
