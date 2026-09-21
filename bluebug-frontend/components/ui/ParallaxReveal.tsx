"use client";
import { useEffect, useRef } from "react";

export function ParallaxReveal({
  children,
  className = "",
  parallaxSpeed = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  parallaxSpeed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx: any;

    async function init() {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsapModule.gsap.registerPlugin(ScrollTrigger);

      ctx = gsapModule.gsap.context(() => {
        // Reveal animation
        const reveals = el!.querySelectorAll(".reveal");
        reveals.forEach((target, i) => {
          gsapModule.gsap.fromTo(
            target,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              delay: i * 0.1,
              scrollTrigger: {
                trigger: target,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Parallax on section headings
        const headings = el!.querySelectorAll(".section-hd");
        headings.forEach((heading) => {
          gsapModule.gsap.to(heading, {
            y: -30 * parallaxSpeed,
            ease: "none",
            scrollTrigger: {
              trigger: heading,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });

        // Parallax on any .parallax-layer elements
        const layers = el!.querySelectorAll(".parallax-layer");
        layers.forEach((layer, i) => {
          const speed = (i + 1) * parallaxSpeed;
          gsapModule.gsap.to(layer, {
            y: -60 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: layer,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        });
      }, ref);
    }

    init();

    return () => {
      ctx?.revert();
    };
  }, [parallaxSpeed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
