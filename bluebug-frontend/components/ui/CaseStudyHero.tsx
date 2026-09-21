"use client";
import { motion } from "framer-motion";

interface CaseStudyHeroProps {
  slug: string;
  coverImage: string | null;
  title: string;
}

export function CaseStudyHero({ slug, coverImage, title }: CaseStudyHeroProps) {
  return (
    <motion.div className="case-cover" layoutId={`project-cover-${slug}`}>
      {coverImage ? (
        <img src={coverImage} alt={title} className="case-cover-img" />
      ) : (
        <div className="case-cover-placeholder">
          <svg viewBox="0 0 80 80" fill="none" stroke="#1481F8" strokeWidth="0.5" opacity="0.25" width="80" height="80" aria-hidden="true">
            <circle cx="40" cy="40" r="36" />
            <circle cx="40" cy="40" r="20" />
            <line x1="40" y1="4" x2="40" y2="76" />
            <line x1="4" y1="40" x2="76" y2="40" />
          </svg>
        </div>
      )}
      <div className="case-cover-gradient" />
    </motion.div>
  );
}
