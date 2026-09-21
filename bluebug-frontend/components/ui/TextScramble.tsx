"use client";
import { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

interface TextScrambleProps {
  text: string;
  className?: string;
  duration?: number;  // total animation ms, default 1800
  delay?: number;     // delay before starting ms, default 400
}

export function TextScramble({ text, className = "", duration = 1800, delay = 400 }: TextScrambleProps) {
  // Start with text so SSR matches initial client render with zero hydration mismatch
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let startTime = 0;

    const delayTimer = setTimeout(() => {
      startTime = performance.now();

      function frame(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Reveal characters up to revealedCount from left
        const revealedCount = Math.floor(progress * text.length);

        const result = text.split("").map((char, idx) => {
          if (char === " ") return " ";
          if (idx < revealedCount) return char;
          // Not yet revealed: show random char (changes each frame)
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("");

        setDisplay(result);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(frame);
        } else {
          setDisplay(text); // final clean state
        }
      }

      frameRef.current = requestAnimationFrame(frame);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, duration, delay]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}
