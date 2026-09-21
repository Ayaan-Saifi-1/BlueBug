import { FOUNDERS } from "@/lib/config";
import { fetchStats } from "@/lib/api";
import { RevealSection } from "@/components/ui/RevealSection";
import { SubpageCanvas } from "@/components/ui/SubpageCanvas";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export const metadata = {
  title: "About",
  description: "BlueBug — two co-founders, a strong contractor network, and one focus: shipping software that works.",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// Inline SVG icons — no emoji, no icon library
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7.5" stroke="#1481F8" strokeOpacity="0.4" />
      <polyline points="4.5,8 7,10.5 11.5,5.5" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TEAM_STATS = [
  { target: 12, suffix: "+", label: "Projects Shipped" },
  { target: 3,  suffix: "+", label: "Years Building" },
  { target: 100, suffix: "%", label: "Client Satisfaction" },
];

const PRINCIPLES = [
  "We never take on more projects than we can fully commit to",
  "Every project gets the same engineering standards regardless of budget",
  "We document everything — you own the knowledge, not just the code",
  "Post-launch support is not an afterthought — it is part of every engagement",
];

export default async function AboutPage() {
  const statsData = await fetchStats();
  const displayStats = statsData?.headline_stats?.length
    ? statsData.headline_stats.map((s) => ({ target: s.target, suffix: s.suffix, label: s.label }))
    : TEAM_STATS;

  return (
    <>
      {/* Page header with Three.js canvas */}
      <div className="subpage-header">
        <SubpageCanvas />
        <div className="container subpage-header-inner">
          <span className="label">About</span>
          <h1 className="gradient-text">The Team Behind BlueBug</h1>
          <p>Two founders. One focus: software that ships and performs.</p>
        </div>
      </div>

      {/* Mini stats row */}
      <div className="about-mini-stats">
        <div className="container">
          <div className="about-mini-stats-row">
            {displayStats.map((s) => (
              <div key={s.label} className="about-mini-stat-item">
                <div className="about-mini-stat-num">
                  <AnimatedCounter target={s.target} suffix={s.suffix} duration={1800} />
                </div>
                <div className="about-mini-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "5rem" }}>
        <RevealSection>
          {/* Founders section */}
          <div className="about-section reveal">
            <div className="section-hd">
              <span className="label">Team</span>
              <h2>Founders</h2>
            </div>
            <div className="founders-grid">
              {FOUNDERS.map((f, i) => (
                <GlassCard key={f.name} className={`founder-card-v2 reveal reveal-delay-${i + 1}`}>
                  <div className="founder-avatar-v2">
                    {getInitials(f.name)}
                  </div>
                  <div className="founder-info">
                    <div className="founder-name-v2">{f.name}</div>
                    <div className="founder-role-v2">{f.role}</div>
                    <p className="founder-bio-v2">{f.bio}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* How we staff */}
          <div className="about-section reveal">
            <div className="section-hd">
              <span className="label">Model</span>
              <h2>How we staff projects</h2>
            </div>
            <div className="staffing-layout">
              <div className="staffing-text">
                <p className="staffing-lead">
                  Our core team stays constant. For each project we bring in specialist contractors
                  with exactly the expertise the problem demands — a React Native developer, a data
                  engineer, or an ML researcher. You get the right person for the job, not whoever
                  happens to be on a bench.
                </p>
              </div>
            </div>
          </div>

          {/* Principles */}
          <div className="about-section reveal">
            <div className="section-hd">
              <span className="label">Culture</span>
              <h2>How we operate</h2>
            </div>
            <div className="principles-grid">
              {PRINCIPLES.map((p, i) => (
                <GlassCard key={i} className={`principle-card reveal reveal-delay-${(i % 2) + 1}`}>
                  <div className="principle-check"><CheckIcon /></div>
                  <p className="principle-text">{p}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </>
  );
}
