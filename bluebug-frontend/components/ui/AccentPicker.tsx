"use client";
import { useState, useEffect } from "react";

const PRESETS = [
  { name: "Electric Blue", hue: 212 },
  { name: "Cyberpunk Violet", hue: 265 },
  { name: "Emerald", hue: 160 },
];

export function AccentPicker() {
  const [activeHue, setActiveHue] = useState(212);

  useEffect(() => {
    const saved = localStorage.getItem("bb-hue");
    if (saved) {
      const h = parseInt(saved, 10);
      setActiveHue(h);
      document.documentElement.style.setProperty("--bb-hue", String(h));
    }
  }, []);

  const pick = (hue: number) => {
    setActiveHue(hue);
    document.documentElement.style.setProperty("--bb-hue", String(hue));
    localStorage.setItem("bb-hue", String(hue));
  };

  return (
    <div className="accent-picker" aria-label="Choose accent color">
      {PRESETS.map((p) => (
        <button
          key={p.hue}
          className={`accent-dot ${activeHue === p.hue ? "active" : ""}`}
          style={{ "--dot-hue": p.hue } as React.CSSProperties}
          onClick={() => pick(p.hue)}
          title={p.name}
          aria-label={p.name}
        />
      ))}
    </div>
  );
}
