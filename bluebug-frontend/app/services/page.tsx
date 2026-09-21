import { fetchServices } from "@/lib/api";
import { SERVICES_FALLBACK } from "@/lib/config";
import Link from "next/link";
import { RevealSection } from "@/components/ui/RevealSection";
import { SubpageCanvas } from "@/components/ui/SubpageCanvas";
import { GlassCard } from "@/components/ui/GlassCard";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { ArrowRight } from "@/lib/icons";

export const metadata = {
  title: "Services",
  description: "BlueBug builds custom websites, apps, PWAs, AI/ML solutions, data pipelines, and institutional systems.",
};

// Inline SVG icons per service — no emoji
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "custom-websites": (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" width="28" height="28" aria-hidden="true">
      <rect x="3" y="5" width="26" height="22" rx="2" />
      <line x1="3" y1="11" x2="29" y2="11" />
      <circle cx="7" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="8" r="1" fill="currentColor" stroke="none" />
      <line x1="9" y1="17" x2="23" y2="17" />
      <line x1="9" y1="21" x2="19" y2="21" />
    </svg>
  ),
  "custom-apps": (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" width="28" height="28" aria-hidden="true">
      <rect x="9" y="2" width="14" height="28" rx="3" />
      <circle cx="16" cy="27" r="1.2" fill="currentColor" stroke="none" />
      <line x1="13" y1="5" x2="19" y2="5" />
    </svg>
  ),
  "progressive-web-apps": (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" width="28" height="28" aria-hidden="true">
      <polygon points="16,3 29,10 29,22 16,29 3,22 3,10" />
      <circle cx="16" cy="16" r="5" />
    </svg>
  ),
  "ai-ml-solutions": (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" width="28" height="28" aria-hidden="true">
      <circle cx="16" cy="16" r="4" />
      <circle cx="6" cy="8" r="2.5" />
      <circle cx="26" cy="8" r="2.5" />
      <circle cx="6" cy="24" r="2.5" />
      <circle cx="26" cy="24" r="2.5" />
      <line x1="8.5" y1="9.5" x2="13" y2="13" />
      <line x1="23.5" y1="9.5" x2="19" y2="13" />
      <line x1="8.5" y1="22.5" x2="13" y2="19" />
      <line x1="23.5" y1="22.5" x2="19" y2="19" />
    </svg>
  ),
  "data-engineering": (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" width="28" height="28" aria-hidden="true">
      <ellipse cx="16" cy="9" rx="10" ry="4" />
      <path d="M6 9v7c0 2.2 4.5 4 10 4s10-1.8 10-4V9" />
      <path d="M6 16v7c0 2.2 4.5 4 10 4s10-1.8 10-4v-7" />
    </svg>
  ),
  "institutional-systems": (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" width="28" height="28" aria-hidden="true">
      <path d="M4 28V12L16 4l12 8v16" />
      <rect x="12" y="18" width="8" height="10" />
      <line x1="4" y1="28" x2="28" y2="28" />
    </svg>
  ),
};

function getServiceIcon(slug: string) {
  return SERVICE_ICONS[slug] ?? SERVICE_ICONS["custom-websites"];
}

export default async function ServicesPage() {
  const services = await fetchServices();
  const display = services.length ? services : SERVICES_FALLBACK;

  const navItems = display.map((s) => ({ id: s.slug, label: s.title }));

  return (
    <>
      {/* Page header with Three.js canvas */}
      <div className="subpage-header">
        <SubpageCanvas />
        <div className="container subpage-header-inner">
          <span className="label">What we do</span>
          <h1 className="gradient-text">Services</h1>
          <p>From a single landing page to a full AI pipeline — scoped, built, and shipped.</p>
        </div>
      </div>

      <div className="services-page-layout">
        {/* Sticky floating nav on the left */}
        <aside className="services-nav-sidebar">
          <FloatingNav items={navItems} />
        </aside>

        {/* Main content */}
        <div className="services-main-content">
          <RevealSection>
            {display.map((s, i) => (
              <div
                key={s.slug}
                id={s.slug}
                className={`service-block-v2 reveal reveal-delay-${Math.min((i % 3) + 1, 5)}`}
              >
                <GlassCard className="service-block-inner">
                  <div className="service-block-icon">
                    {getServiceIcon(s.slug)}
                  </div>
                  <div className="service-block-body">
                    <div className="service-block-num">0{i + 1}</div>
                    <h2 className="service-block-title">{s.title}</h2>
                    <p className="service-block-short">{s.short_description}</p>
                    {(s as any).full_description && (
                      <div
                        className="service-block-full"
                        dangerouslySetInnerHTML={{ __html: (s as any).full_description }}
                      />
                    )}
                    <Link href="/contact" className="btn btn-glass btn-sm" style={{ marginTop: "1.5rem", alignSelf: "flex-start" }} data-cursor-attract="true">
                      Get a Quote <ArrowRight size={12} strokeWidth={2} />
                    </Link>
                  </div>
                </GlassCard>
              </div>
            ))}

            <div className="reveal" style={{ marginTop: "3rem" }}>
              <div className="cta-section">
                <h2>Not sure which service fits?</h2>
                <p>Book a free 30-minute call and we will figure it out together.</p>
                <Link href="/contact" className="btn btn-primary btn-lg" data-cursor-attract="true">
                  Book a Call
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </>
  );
}
