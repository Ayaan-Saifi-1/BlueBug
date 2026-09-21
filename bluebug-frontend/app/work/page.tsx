import type { Metadata } from "next";
import Link from "next/link";
import { fetchProjects } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/config";
import { RevealSection } from "@/components/ui/RevealSection";
import { SubpageCanvas } from "@/components/ui/SubpageCanvas";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowUpRight } from "@/lib/icons";
import type { ProjectList } from "@/lib/types";

export const metadata: Metadata = {
  title: "Work",
  description: "All BlueBug projects — custom websites, apps, PWAs, AI/ML systems, and healthcare platforms.",
};

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

function ProjectCardV2({ p, delay }: { p: ProjectList; delay: number }) {
  return (
    <TiltCard className={`project-card-v2 reveal reveal-delay-${Math.min(delay, 5)}`}>
      <Link href={`/work/${p.slug}`} className="project-card-v2-link">
        <div className="project-card-v2-media">
          {p.cover_image
            ? <img src={p.cover_image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div className="project-card-v2-empty"><EmptyIcon /></div>
          }
          <div className="project-card-v2-overlay">
            <div className="project-card-v2-arrow">
              <ArrowUpRight size={18} strokeWidth={2} />
            </div>
          </div>
        </div>
        <div className="project-card-v2-body">
          <div className="project-card-v2-tags">
            <span className="badge badge-category">{CATEGORY_LABELS[p.category] ?? p.category}</span>
            {p.live_url && <span className="badge badge-live">Live</span>}
            {p.github_url && <span className="badge badge-github">GitHub</span>}
            {p.status === "in_progress" && <span className="badge badge-progress">In Progress</span>}
          </div>
          <div className="project-card-v2-title">{p.title}</div>
          <p className="project-card-v2-desc">{p.tagline}</p>
        </div>
      </Link>
    </TiltCard>
  );
}

const FILTERS = [
  { label: "All", value: "" },
  { label: "Web Apps", value: "web" },
  { label: "PWA", value: "pwa" },
  { label: "AI / ML", value: "ai_ml" },
  { label: "Data", value: "data" },
  { label: "Healthcare", value: "healthcare" },
];

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const projects = await fetchProjects(category);

  return (
    <>
      {/* Page header with Three.js canvas */}
      <div className="subpage-header">
        <SubpageCanvas />
        <div className="container subpage-header-inner">
          <span className="label">Portfolio</span>
          <h1 className="gradient-text">Our Work</h1>
          <p>Real, shipped work. No concepts, no mockups.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "5rem" }}>
        {/* Filter bar */}
        <div className="filter-bar-v2">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/work?category=${f.value}` : "/work"}
              className={`chip-v2${(category ?? "") === f.value ? " active" : ""}`}
              data-cursor-attract="true"
            >
              {f.label}
            </Link>
          ))}
        </div>

        <RevealSection>
          {projects.length > 0 ? (
            <div className="projects-grid-v2">
              {projects.map((p, i) => (
                <ProjectCardV2 key={p.id} p={p} delay={(i % 3) + 1} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <EmptyIcon />
              <p>No projects match this filter.</p>
            </div>
          )}
        </RevealSection>
      </div>
    </>
  );
}
