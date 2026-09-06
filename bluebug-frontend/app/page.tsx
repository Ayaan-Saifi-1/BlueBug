import Link from "next/link";
import { fetchProjects, fetchServices } from "@/lib/api";
import {
  SITE_CONFIG, TECH_PILLS, SERVICES_FALLBACK,
  PROCESS_STEPS, CATEGORY_LABELS,
} from "@/lib/config";
import { ArrowUpRight, ArrowRight } from "@/lib/icons";
import { RevealSection } from "@/components/ui/RevealSection";
import type { ProjectList } from "@/lib/types";

export const metadata = {
  title: `${SITE_CONFIG.name} | Custom Software, Apps & AI`,
  description: "BlueBug is a tech consultancy building custom websites, apps, PWAs, and AI/ML systems. Real shipped work, no templates.",
};

// Inline geometric SVG — no emojis, no icon libraries
function GeomIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round">
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="10" />
      <line x1="24" y1="6" x2="24" y2="42" />
      <line x1="6" y1="24" x2="42" y2="24" />
    </svg>
  );
}

const BENTO_CLASSES = ["bento-c1", "bento-c2", "bento-c3", "bento-c4"];
const BENTO_DELAYS = [1, 2, 3, 4];

function BentoCard({ p, className, delay }: { p: ProjectList; className: string; delay: number }) {
  return (
    <Link href={`/work/${p.slug}`} className={`bento-card ${className} reveal reveal-delay-${delay}`}>
      <div className="bento-media">
        {p.cover_image
          ? <img src={p.cover_image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div className="bento-media-empty"><GeomIcon /></div>
        }
      </div>
      <div className="bento-arrow">
        <ArrowUpRight strokeWidth={2} size={12} />
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

  // Duplicate TECH_PILLS for seamless marquee loop
  const marqueeItems = [...TECH_PILLS, ...TECH_PILLS];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            {/* Left: main content */}
            <div className="hero-content">
              <div className="hero-label reveal">
                <span className="hero-label-dot" />
                Tech Consultancy
              </div>
              <h1 className="hero-title gradient-text reveal reveal-delay-1">
                {SITE_CONFIG.tagline}
              </h1>
              <p className="hero-sub reveal reveal-delay-2">
                Custom websites, apps, PWAs, and AI/ML systems — designed,
                built, and shipped by BlueBug. No fluff, no templates.
              </p>
              <div className="hero-ctas reveal reveal-delay-3">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Book a Call
                </Link>
                <Link href="/work" className="btn btn-glass btn-lg">
                  See Our Work
                </Link>
              </div>
            </div>

            {/* Right: asymmetric stat block */}
            <aside className="hero-aside reveal reveal-delay-2">
              <div className="hero-stat-block">
                <div className="hero-stat-rule" />
                <div className="hero-stats">
                  <div className="hero-stat-item">
                    <div className="hero-stat-num">12+</div>
                    <div className="hero-stat-label">Projects Shipped</div>
                  </div>
                  <div className="hero-stat-item">
                    <div className="hero-stat-num">5</div>
                    <div className="hero-stat-label">Tech Domains</div>
                  </div>
                  <div className="hero-stat-item">
                    <div className="hero-stat-num">24h</div>
                    <div className="hero-stat-label">Response Time</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Marquee Trust Strip ───────────────────────────────── */}
      <div className="trust-strip" aria-hidden="true">
        <div className="marquee-track">
          {marqueeItems.map((t, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-word">{t}</span>
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured Work ─────────────────────────────────────── */}
      <section className="section">
        <RevealSection>
          <div className="container">
            <div className="section-hd reveal">
              <span className="label">Portfolio</span>
              <h2>Flagship Projects</h2>
              <p>Every project below is real, shipped work — not concepts.</p>
            </div>

            {featured.length > 0 ? (
              <div className="bento">
                {featured.slice(0, 4).map((p, i) => (
                  <BentoCard
                    key={p.id}
                    p={p}
                    className={BENTO_CLASSES[i] ?? "bento-c1"}
                    delay={BENTO_DELAYS[i] ?? 1}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                padding: "4rem 0",
                textAlign: "center",
                color: "var(--bb-text-300)",
                fontSize: "var(--text-sm)",
                borderTop: "1px solid var(--bb-border)",
                borderBottom: "1px solid var(--bb-border)",
              }}>
                Projects loading — add them via the admin panel.
              </div>
            )}

            <div className="reveal reveal-delay-1" style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link href="/work" className="btn btn-glass">
                View all projects <ArrowRight size={13} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── Services — editorial list ─────────────────────────── */}
      <section className="section" style={{ background: "var(--bb-surface)", borderTop: "1px solid var(--bb-border)", borderBottom: "1px solid var(--bb-border)" }}>
        <RevealSection>
          <div className="container">
            <div className="section-hd centered reveal">
              <span className="label">What we do</span>
              <h2>Services</h2>
              <p>From a single landing page to a full AI pipeline — we scope and deliver it.</p>
            </div>

            <div className="services-list">
              {displayServices.map((s, i) => (
                <Link
                  key={s.slug}
                  href={`/services#${s.slug}`}
                  className={`service-list-item reveal reveal-delay-${Math.min(i + 1, 5)}`}
                >
                  <span className="service-list-num">0{i + 1}</span>
                  <div className="service-list-body">
                    <div className="service-list-title">{s.title}</div>
                    <div className="service-list-desc">{s.short_description}</div>
                  </div>
                  <div className="service-list-arrow">
                    <ArrowUpRight size={13} strokeWidth={2} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── Process — vertical timeline ───────────────────────── */}
      <section className="section">
        <RevealSection>
          <div className="container">
            <div className="section-hd centered reveal">
              <span className="label">Process</span>
              <h2>How we work</h2>
            </div>
            <div className="timeline">
              {PROCESS_STEPS.map((s, i) => (
                <div key={s.num} className={`timeline-step reveal reveal-delay-${i + 1}`}>
                  <div className="timeline-num">{s.num}</div>
                  <div className="timeline-title">{s.title}</div>
                  <div className="timeline-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="section-sm">
        <RevealSection>
          <div className="container">
            <div className="cta-section reveal">
              <h2>Have a project in mind?</h2>
              <p>We work with startups, institutions, and founders who need real software built.</p>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Book a Free Call
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>
    </>
  );
}
