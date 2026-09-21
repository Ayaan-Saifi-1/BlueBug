"use client";
import { useEffect, useRef, useState } from "react";
import { PROCESS_STEPS } from "@/lib/config";

export function ScrollTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;

    function onScroll() {
      const rect = wrap!.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Calculate scroll progress through the timeline section (0 to 1)
      const progress = Math.min(Math.max((windowH - rect.top) / (rect.height + windowH * 0.25), 0), 1);
      line!.style.height = `${progress * 100}%`;

      // Dynamically activate node dots as the laser line reaches them
      const stepIndex = Math.min(Math.floor(progress * (PROCESS_STEPS.length + 0.35)) + 1, PROCESS_STEPS.length);
      setActiveStep(stepIndex);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapRef} className="scroll-timeline">
      {/* Vertical central track rail */}
      <div className="scroll-timeline-track" aria-hidden="true">
        <div ref={lineRef} className="scroll-timeline-fill" />
      </div>

      {/* Steps */}
      <div className="scroll-timeline-steps">
        {PROCESS_STEPS.map((s, i) => (
          <div key={s.num} className={`scroll-timeline-step reveal reveal-delay-${i + 1}`}>
            {/* The Node Dot: mathematically centered on the exact line rail */}
            <div className="scroll-timeline-node" aria-hidden="true">
              <div className={`scroll-timeline-dot ${i + 1 <= activeStep ? "is-active" : ""}`}>
                <span className="scroll-timeline-dot-core" />
              </div>
            </div>

            <div className="scroll-timeline-body">
              <div className="scroll-timeline-header">
                <span className="scroll-timeline-num">{s.num}</span>
                <span className="scroll-timeline-title">{s.title}</span>
              </div>
              <div className="scroll-timeline-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
