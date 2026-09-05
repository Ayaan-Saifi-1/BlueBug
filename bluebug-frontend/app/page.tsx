import Link from "next/link";
import { fetchProjects, fetchServices } from "@/lib/api";
import {
  SITE_CONFIG, TECH_PILLS, SERVICES_FALLBACK,
  PROCESS_STEPS, CATEGORY_LABELS,
} from "@/lib/config";
import { ArrowUpRight, ArrowRight } from "@/lib/icons";
import type { ProjectList } from "@/lib/types";

export const metadata = {
  title: `${SITE_CONFIG.name} | Custom Software, Apps & AI`,
  description: "BlueBug is a tech consultancy building custom websites, apps, PWAs, and AI/ML systems. Real shipped work, no templates.",
};

/* Inline SVG for empty bento state — cleaner than any emoji */
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 44, height: 44, opacity: 0.12, color: "var(--bb-blue)" }}>
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

const BENTO_CLASSES = ["bento-c1", "bento-c2", "bento-c3", "bento-c4"];

function BentoCard({ p, className }: { p: ProjectList; className: string }) {
  return (
    <Link href={`/work/${p.slug}`} className={`bento-card ${className}`}>
      <div className="bento-media">
        {p.cover_image
          ? <img src={p.cover_image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div className="bento-media-empty"><GridIcon /></div>
        }
      </div>
      <div className="bento-arrow">
        <ArrowUpRight strokeWidth={2} size={14} />
      </div>
      <div className="bento-body">
        <div className="bento-tags">
          <span className="badge badge-category">{CATEGORY_LABELS[p.category] ?? p.category}</span>
          {p.live_url && <span className="badge badge-live">Live</span>}
          {p.github_url && <span className="badge badge-github">GitHub</span>}
        </div>
        <div className="bento-title">{p.title}</div>
        <div className="bento-desc">{p.tagline}</div>
      </div>
    </Link>
  );
}

export default async function Home() {
  const [featured, services] = await Promise.all([
    fetchProjects(undefined, true),
    fetchServices(),
  ]);
  const displayServices = services.length ? services : SERVICES_FALLBACK;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-label">
            <span className="hero-label-dot" />
            Tech Consultancy
          </div>
          <h1 className="hero-title gradient-text">
            {SITE_CONFIG.tagline}
          </h1>
          <p className="hero-sub">
            Custom websites, apps, PWAs, and AI/ML systems — designed,
            built, and shipped by BlueBug. No fluff, no templates.
          </p>
          <div className="hero-ctas">
            <Link href="/contact" className="btn btn-primary btn-lg">
              Book a Call
            </Link>
            <Link href="/work" className="btn btn-glass btn-lg">
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tech strip ───────────────────────────────────────── */}
      <div className="trust-strip">
        <div className="container">
          <div className="trust-strip-inner">
            <span className="trust-label">Built with</span>
            <span className="trust-divider" />
            <div className="tech-pills">
              {TECH_PILLS.map((t) => (
                <span key={t} className="tech-pill">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured Work ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-hd">
            <span className="label">Portfolio</span>
            <h2>Flagship Projects</h2>
            <p>Every project below is real, shipped work — not concepts.</p>
          </div>

          {featured.length > 0 ? (
            <div className="bento">
              {featured.slice(0, 4).map((p, i) => (
                <BentoCard key={p.id} p={p} className={BENTO_CLASSES[i] ?? "bento-c1"} />
              ))}
            </div>
          ) : (
            <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--bb-text-300)", fontSize: "var(--text-sm)" }}>
              Projects loading — add them via the admin panel.
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/work" className="btn btn-glass">
              View all projects <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--bb-surface)", borderTop: "1px solid var(--bb-border)", borderBottom: "1px solid var(--bb-border)" }}>
        <div className="container">
          <div className="section-hd centered">
            <span className="label">What we do</span>
            <h2>Services</h2>
            <p>From a single landing page to a full AI pipeline — we scope and deliver it.</p>
          </div>
          <div className="services-grid">
            {displayServices.map((s, i) => (
              <Link key={s.slug} href={`/services#${s.slug}`} className="service-card">
                <span className="service-card-num">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.short_description}</p>
                <div className="service-arrow">
                  <ArrowRight size={12} strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-hd centered">
            <span className="label">Process</span>
            <h2>How we work</h2>
          </div>
          <div className="steps-grid">
            {PROCESS_STEPS.map((s) => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div className="cta-section">
            <h2>Have a project in mind?</h2>
            <p>We work with startups, institutions, and founders who need real software built.</p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Book a Free Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
