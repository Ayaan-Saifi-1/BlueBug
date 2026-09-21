import Link from "next/link";
import Image from "next/image";
import { fetchProjects, fetchServices, fetchStats } from "@/lib/api";
import {
  SITE_CONFIG, TECH_PILLS, SERVICES_FALLBACK,
  CATEGORY_LABELS,
} from "@/lib/config";
import { ArrowUpRight, ArrowRight } from "@/lib/icons";
import { RevealSection } from "@/components/ui/RevealSection";
import { ParallaxReveal } from "@/components/ui/ParallaxReveal";
import { FluidShaderCanvas } from "@/components/ui/FluidShaderCanvas";
import type { ProjectList } from "@/lib/types";
import { HeroCanvas } from "@/components/ui/HeroCanvas";
import { TextScramble } from "@/components/ui/TextScramble";
import { TiltCard } from "@/components/ui/TiltCard";
import { StatsSection } from "@/components/ui/StatsSection";
import { ScrollTimeline } from "@/components/ui/ScrollTimeline";

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
const BENTO_DELAYS  = [1, 2, 3, 4];

function BentoCard({ p, className, delay }: { p: ProjectList; className: string; delay: number }) {
  return (
    <TiltCard className={`bento-card ${className} reveal reveal-delay-${delay}`}>
      <Link href={`/work/${p.slug}`} className="bento-card-inner-link">
        <div className="bento-media">
          {p.cover_image
            ? <Image src={p.cover_image} alt={p.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
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
    </TiltCard>
  );
}

export default async function Home() {
  const [featured, services, stats] = await Promise.all([
    fetchProjects(undefined, true),
    fetchServices(),
    fetchStats(),
  ]);
  const displayServices = services.length ? services : SERVICES_FALLBACK;
  const marqueeItems = [...TECH_PILLS, ...TECH_PILLS];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        {/* Three.js canvas behind everything */}
        <HeroCanvas />

        {/* Keep existing orbs — they complement the canvas */}
        <div className="hero-orbs" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>

        <div className="container hero-inner">
          <div className="hero-label hero-enter" style={{ animationDelay: "0ms" }}>
            <span className="hero-label-dot" />
            Tech Consultancy
          </div>
          <h1 className="hero-title gradient-text hero-enter" style={{ animationDelay: "80ms" }}>
            <TextScramble text={SITE_CONFIG.tagline} delay={600} duration={2000} />
          </h1>
          <p className="hero-sub hero-enter" style={{ animationDelay: "180ms" }}>
            Custom websites, apps, PWAs, and AI/ML systems — designed,
            built, and shipped by BlueBug. No fluff, no templates.
          </p>
          <div className="hero-ctas hero-enter" style={{ animationDelay: "280ms" }}>
            <Link href="/contact" className="btn btn-primary btn-lg" data-cursor-attract="true">
              Book a Call
            </Link>
            <Link href="/work" className="btn btn-glass btn-lg" data-cursor-attract="true">
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE TRUST STRIP */}
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

      {/* FEATURED WORK */}
      <section className="section">
        <ParallaxReveal>
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
        </ParallaxReveal>
      </section>

      {/* SERVICES */}
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

      {/* STATS + CHARTS — new section */}
      <RevealSection>
        <StatsSection initialData={stats} />
      </RevealSection>

      {/* PROCESS — scroll timeline */}
      <section className="section">
        <RevealSection>
          <div className="container">
            <div className="section-hd centered reveal">
              <span className="label">Process</span>
              <h2>How we work</h2>
              <p>A repeatable process that ships on time, every time.</p>
            </div>
            <ScrollTimeline />
          </div>
        </RevealSection>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ position: "relative", overflow: "hidden" }}>
        <FluidShaderCanvas />
        <RevealSection>
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div className="cta-section reveal">
              <h2>Have a project in mind?</h2>
              <p>We work with startups, institutions, and founders who need real software built.</p>
              <Link href="/contact" className="btn btn-primary btn-lg" data-cursor-attract="true">
                Book a Free Call
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>
    </>
  );
}
