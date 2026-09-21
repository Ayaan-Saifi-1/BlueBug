import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProjectBySlug, fetchProjects } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/config";
import { ChevronLeft, ArrowUpRight } from "@/lib/icons";
import { TiltCard } from "@/components/ui/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="case-section-label">{children}</div>;
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  if (!project) notFound();

  const all = await fetchProjects();
  const related = all.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="case-study-v2">
      {/* Full-width cover */}
      <div className="case-cover">
        {project.cover_image
          ? <img src={project.cover_image} alt={project.title} className="case-cover-img" />
          : (
            <div className="case-cover-placeholder">
              <svg viewBox="0 0 80 80" fill="none" stroke="#1481F8" strokeWidth="0.5" opacity="0.25" width="80" height="80" aria-hidden="true">
                <circle cx="40" cy="40" r="36" />
                <circle cx="40" cy="40" r="20" />
                <line x1="40" y1="4" x2="40" y2="76" />
                <line x1="4" y1="40" x2="76" y2="40" />
              </svg>
            </div>
          )
        }
        <div className="case-cover-gradient" />
      </div>

      {/* Back link */}
      <div className="container" style={{ paddingTop: "2rem" }}>
        <Link href="/work" className="back-link" data-cursor-attract="true">
          <ChevronLeft />
          Back to all work
        </Link>
      </div>

      {/* Header */}
      <div className="container">
        <header className="case-header-v2">
          <span className="label">{CATEGORY_LABELS[project.category] ?? project.category}</span>
          <h1 className="gradient-text">{project.title}</h1>
          <p className="case-tagline-v2">{project.tagline}</p>
          <div className="case-ctas">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="btn btn-primary" data-cursor-attract="true">
                View Live <ArrowUpRight size={13} strokeWidth={2} />
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="btn btn-glass" data-cursor-attract="true">
                GitHub
              </a>
            )}
            {project.live_url && <span className="badge badge-live" style={{ alignSelf: "center" }}>Live</span>}
          </div>
        </header>

        {/* Two-column: problem + approach */}
        <div className="case-two-col">
          <GlassCard className="case-panel">
            <SectionLabel>Problem</SectionLabel>
            <p>{project.problem_statement}</p>
          </GlassCard>
          <GlassCard className="case-panel">
            <SectionLabel>Approach</SectionLabel>
            <p>{project.approach}</p>
          </GlassCard>
        </div>

        {/* Tech stack floating cloud */}
        {project.tech_stack.length > 0 && (
          <div className="case-section-v2">
            <SectionLabel>Tech Stack</SectionLabel>
            <div className="tech-cloud">
              {project.tech_stack.map((t) => (
                <span key={t} className="tech-cloud-tag">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {project.gallery_images.length > 0 && (
          <div className="case-section-v2">
            <SectionLabel>Gallery</SectionLabel>
            <div className="gallery-grid-v2">
              {project.gallery_images.map((img) => (
                <figure key={img.id} className="gallery-fig-v2">
                  <img src={img.image} alt={img.caption ?? project.title} />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Key features */}
        {project.key_features.length > 0 && (
          <div className="case-section-v2">
            <SectionLabel>Key Features</SectionLabel>
            <ul className="key-features-list">
              {project.key_features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        {/* Outcome — highlighted card */}
        {project.outcome && (
          <GlassCard className="outcome-card" style={{ margin: "2.5rem 0" }}>
            <SectionLabel>Outcome</SectionLabel>
            <p className="outcome-text">{project.outcome}</p>
          </GlassCard>
        )}

        {/* Team credit */}
        {project.team_credit && (
          <p style={{ fontSize: "var(--text-sm)", color: "var(--bb-text-300)", marginBottom: "2rem" }}>
            <strong style={{ color: "var(--bb-text-200)" }}>Team:</strong> {project.team_credit}
          </p>
        )}

        {/* CTA */}
        <div className="cta-section" style={{ margin: "3rem 0" }}>
          <h2>Want something like this?</h2>
          <p>We scope, design, and ship it — on time.</p>
          <Link href="/contact" className="btn btn-primary btn-lg" data-cursor-attract="true">
            Book a Free Call
          </Link>
        </div>

        {/* Related projects */}
        {related.length > 0 && (
          <div className="related-projects">
            <div className="related-label">More Projects</div>
            <div className="projects-grid-v2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {related.map((p) => (
                <TiltCard key={p.id} className="project-card-v2">
                  <Link href={`/work/${p.slug}`} className="project-card-v2-link">
                    <div className="project-card-v2-media" style={{ height: "140px" }}>
                      {p.cover_image
                        ? <img src={p.cover_image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div className="project-card-v2-empty" />
                      }
                      <div className="project-card-v2-overlay">
                        <div className="project-card-v2-arrow">
                          <ArrowUpRight size={14} strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                    <div className="project-card-v2-body">
                      <div className="project-card-v2-title" style={{ fontSize: "var(--text-sm)" }}>{p.title}</div>
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
