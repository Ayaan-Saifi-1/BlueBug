import type { Metadata } from "next";
import Link from "next/link";
import { fetchProjects } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/config";
import { RevealSection } from "@/components/ui/RevealSection";
import type { ProjectList } from "@/lib/types";

export const metadata: Metadata = {
  title: "Work",
  description: "All BlueBug projects — custom websites, apps, PWAs, AI/ML systems, and healthcare platforms.",
};

function EmptyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" style={{ width: 36, height: 36, opacity: 0.12, color: "var(--bb-blue)" }}>
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="10" />
      <line x1="24" y1="6" x2="24" y2="42" />
      <line x1="6" y1="24" x2="42" y2="24" />
    </svg>
  );
}

function ProjectCard({ p, delay }: { p: ProjectList; delay: number }) {
  return (
    <Link href={`/work/${p.slug}`} className={`project-card reveal reveal-delay-${Math.min(delay, 5)}`}>
      <div className="card-media">
        {p.cover_image
          ? <img src={p.cover_image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div className="card-media-empty"><EmptyIcon /></div>
        }
      </div>
      <div className="card-body">
        <div className="card-tags">
          <span className="badge badge-category">{CATEGORY_LABELS[p.category] ?? p.category}</span>
          {p.live_url && <span className="badge badge-live">Live</span>}
          {p.github_url && <span className="badge badge-github">GitHub</span>}
          {p.status === "in_progress" && <span className="badge badge-progress">In Progress</span>}
        </div>
        <div className="card-title">{p.title}</div>
        <p className="card-desc">{p.tagline}</p>
      </div>
    </Link>
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
      <div className="page-header">
        <div className="container">
          <span className="label">Portfolio</span>
          <h1>Our Work</h1>
          <p>Real, shipped work. No concepts, no mockups.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "5rem" }}>
        <div className="filter-bar">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/work?category=${f.value}` : "/work"}
              className={`chip ${(category ?? "") === f.value ? "active" : ""}`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <RevealSection>
          {projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} p={p} delay={(i % 3) + 1} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--bb-text-300)",
              fontSize: "var(--text-sm)",
              borderTop: "1px solid var(--bb-border)",
            }}>
              No projects match this filter.
            </div>
          )}
        </RevealSection>
      </div>
    </>
  );
}
