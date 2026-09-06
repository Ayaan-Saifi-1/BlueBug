import { FOUNDERS } from "@/lib/config";
import { RevealSection } from "@/components/ui/RevealSection";

export const metadata = {
  title: "About",
  description: "BlueBug — two co-founders, a strong contractor network, and one focus: shipping software that works.",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AboutPage() {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="label">About</span>
          <h1>The Team Behind BlueBug</h1>
          <p>Two founders. One focus: software that ships and performs.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "5rem" }}>
        <RevealSection>
          <div className="about-wrap">

            {/* Stats row */}
            <div className="about-stats-row reveal">
              <div className="about-stat">
                <div className="about-stat-num">12+</div>
                <div className="about-stat-label">Projects Shipped</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">5</div>
                <div className="about-stat-label">Tech Domains</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">2</div>
                <div className="about-stat-label">Founders</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">100%</div>
                <div className="about-stat-label">Real Projects</div>
              </div>
            </div>

            {/* Founders */}
            <h2 className="reveal" style={{ fontSize: "var(--text-xl)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
              Founders
            </h2>
            <div className="founders-grid">
              {FOUNDERS.map((f, i) => (
                <div key={f.name} className={`founder-card reveal reveal-delay-${i + 1}`}>
                  <div className="founder-avatar">
                    {getInitials(f.name)}
                  </div>
                  <div>
                    <div className="founder-name">{f.name}</div>
                    <div className="founder-role">{f.role}</div>
                    <p className="founder-bio" style={{ marginTop: "0.625rem" }}>{f.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* How we staff */}
            <div className="staffing-block reveal">
              <h2>How we staff projects</h2>
              <p>
                Our core team stays constant. For each project, we bring in specialist contractors
                with exactly the expertise the problem demands — whether that&apos;s a React Native developer,
                a data engineer, or an ML researcher. You get the right person for the job,
                not whoever happens to be on a bench.
              </p>
            </div>
          </div>
        </RevealSection>
      </div>
    </>
  );
}
