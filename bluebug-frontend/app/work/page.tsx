import type { Metadata } from "next";
import Link from "next/link";
import { fetchProjects } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/config";
import { ArrowUpRight } from "@/lib/icons";
import type { ProjectList } from "@/lib/types";

export const metadata: Metadata = {
  title: "Work",
  description: "All BlueBug projects — custom websites, apps, PWAs, AI/ML systems, and healthcare platforms.",
};

function EmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36, opacity: 0.12, color: "var(--bb-blue)" }}>
      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  );
}

function ProjectCard({ p }: { p: ProjectList }) {
  return (
    <Link href={`/work/${p.slug}`} className="project-card">
      <div className="card-media">
        {p.cover_image
          ? <img src={p.cover_image} alt={p.title} className="card-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--bb-text-300)", fontSize: "var(--text-sm)" }}>
            No projects match this filter.
          </div>
        )}
      </div>
    </>
  );
}
