"use client";
import { useEffect, useRef } from "react";

interface LottieIconProps {
  animationData: object;
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  playOnHover?: boolean;
  className?: string;
}

export function LottieIcon({
  animationData,
  size = 28,
  loop = false,
  autoplay = false,
  playOnHover = true,
  className = "",
}: LottieIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      const lottie = (await import("lottie-web")).default;
      if (!containerRef.current || isCancelled) return;

      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop,
        autoplay,
        animationData,
      });
    }

    init();

    return () => {
      isCancelled = true;
      animRef.current?.destroy();
    };
  }, [animationData, loop, autoplay]);

  const onMouseEnter = () => {
    if (playOnHover && animRef.current) {
      animRef.current.goToAndPlay(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size }}
      onMouseEnter={onMouseEnter}
    />
  );
}
