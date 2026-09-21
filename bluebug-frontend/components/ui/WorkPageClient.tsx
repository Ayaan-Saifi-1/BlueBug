"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORY_LABELS } from "@/lib/config";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowUpRight } from "@/lib/icons";
import type { ProjectList } from "@/lib/types";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Web Apps", value: "web" },
  { label: "PWA", value: "pwa" },
  { label: "AI / ML", value: "ai_ml" },
  { label: "Data", value: "data" },
  { label: "Healthcare", value: "healthcare" },
];

function EmptyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round"
      style={{ width: 36, height: 36, opacity: 0.12, color: "var(--bb-blue)" }} aria-hidden="true">
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="10" />
      <line x1="24" y1="6" x2="24" y2="42" />
      <line x1="6" y1="24" x2="42" y2="24" />
    </svg>
  );
}

export function WorkPageClient({ projects }: { projects: ProjectList[] }) {
  const [activeFilter, setActiveFilter] = useState("");

  const filtered = activeFilter
    ? projects.filter((p) => p.category === activeFilter)
    : projects;

  return (
    <>
      {/* Filter bar */}
      <div className="filter-bar-v2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`chip-v2${activeFilter === f.value ? " active" : ""}`}
            data-cursor-attract="true"
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Animated grid */}
      <div className="projects-grid-v2">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="project-card-v2">
                <Link href={`/work/${p.slug}`} className="project-card-v2-link">
                  <motion.div className="project-card-v2-media" layoutId={`project-cover-${p.slug}`}>
                    {p.cover_image
                      ? <img src={p.cover_image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div className="project-card-v2-empty"><EmptyIcon /></div>
                    }
                    <div className="project-card-v2-overlay">
                      <div className="project-card-v2-arrow">
                        <ArrowUpRight size={18} strokeWidth={2} />
                      </div>
                    </div>
                  </motion.div>
                  <div className="project-card-v2-body">
                    <div className="project-card-v2-tags">
                      <span className="badge badge-category">{CATEGORY_LABELS[p.category] ?? p.category}</span>
                      {p.live_url && <span className="badge badge-live">Live</span>}
                      {p.github_url && <span className="badge badge-github">GitHub</span>}
                      {p.status === "in_progress" && <span className="badge badge-progress">In Progress</span>}
                    </div>
                    <motion.div className="project-card-v2-title" layoutId={`project-title-${p.slug}`}>{p.title}</motion.div>
                    <p className="project-card-v2-desc">{p.tagline}</p>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <EmptyIcon />
          <p>No projects match this filter.</p>
        </div>
      )}
    </>
  );
}
