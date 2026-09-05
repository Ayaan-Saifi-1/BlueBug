import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProjectBySlug, fetchProjects } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/config";
import { ChevronLeft, ArrowUpRight } from "@/lib/icons";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await fetchProjectBySlug(slug);
  if (!p) return { title: "Not Found" };
  return {
    title: p.title,
    description: p.tagline,
    openGraph: p.cover_image ? { images: [p.cover_image] } : undefined,
  };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) notFound();

  const all = await fetchProjects();
  const related = all.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div style={{ padding: "3rem var(--pad) 5rem", maxWidth: "var(--max-w)", margin: "0 auto" }}>
      <div className="case-wrap">
        <Link href="/work" className="back-link">
          <ChevronLeft />
          Back to all work
        </Link>

        <header className="case-header">
          <span className="label">{CATEGORY_LABELS[project.category] ?? project.category}</span>
          <h1>{project.title}</h1>
          <p className="tagline">{project.tagline}</p>
          <div className="case-tags">
            {project.live_url && (
              <span className="badge badge-live">Live</span>
            )}
            {project.status === "in_progress" && (
              <span className="badge badge-progress">In Progress</span>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                View Live <ArrowUpRight size={12} strokeWidth={2} />
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="btn btn-glass btn-sm">
                GitHub
              </a>
            )}
          </div>
        </header>

        <div className="case-section">
          <div className="case-section-title">Problem</div>
          <p>{project.problem_statement}</p>
        </div>

        <div className="case-section">
          <div className="case-section-title">Approach</div>
          <p>{project.approach}</p>
        </div>

        {project.tech_stack.length > 0 && (
          <div className="case-section">
            <div className="case-section-title">Tech Stack</div>
            <div className="tech-tags">
              {project.tech_stack.map((t) => <span key={t} className="tech-tag">{t}</span>)}
            </div>
          </div>
        )}

        {project.gallery_images.length > 0 && (
          <div className="case-section">
            <div className="case-section-title">Gallery</div>
            <div className="gallery-grid">
              {project.gallery_images.map((img) => (
                <figure key={img.id}>
                  <img src={img.image} alt={img.caption ?? project.title} />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        )}

        {project.key_features.length > 0 && (
          <div className="case-section">
            <div className="case-section-title">Key Features</div>
            <ul>
              {project.key_features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        {project.outcome && (
          <div className="case-section">
            <div className="case-section-title">Outcome</div>
            <p>{project.outcome}</p>
          </div>
        )}

        {project.team_credit && (
          <div className="case-section">
            <p style={{ fontSize: "var(--text-sm)", color: "var(--bb-text-300)" }}>
              <strong style={{ color: "var(--bb-text-200)" }}>Team:</strong> {project.team_credit}
            </p>
          </div>
        )}

        <div className="cta-section" style={{ margin: "3rem 0" }}>
          <h2>Want something like this?</h2>
          <p>We scope, design, and ship it — on time.</p>
          <Link href="/contact" className="btn btn-primary btn-lg">Book a Free Call</Link>
        </div>

        {related.length > 0 && (
          <div className="related-projects">
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--bb-text-300)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
              More Projects
            </div>
            <div className="projects-grid">
              {related.map((p) => (
                <Link key={p.id} href={`/work/${p.slug}`} className="project-card">
                  <div className="card-media" style={{ height: "130px" }}>
                    {p.cover_image
                      ? <img src={p.cover_image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div className="card-media-empty" />
                    }
                  </div>
                  <div className="card-body">
                    <div className="card-title" style={{ fontSize: "var(--text-sm)" }}>{p.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
