"use client";
import { useEffect, useState } from "react";

interface FloatingNavItem {
  id: string;
  label: string;
}

interface FloatingNavProps {
  items: FloatingNavItem[];
}

export function FloatingNav({ items }: FloatingNavProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) setActive(id);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <nav className="floating-nav" aria-label="Section navigation">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`floating-nav-item${active === item.id ? " active" : ""}`}
          data-cursor-attract="true"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
