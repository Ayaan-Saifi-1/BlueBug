"use client";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const variants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const } },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
