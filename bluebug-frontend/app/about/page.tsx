import { FOUNDERS } from "@/lib/config";

export const metadata = {
  title: "About",
  description: "BlueBug — two co-founders, a strong contractor network, and one focus: shipping software that works.",
};

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
        <div className="about-wrap">
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "1.25rem" }}>
            Founders
          </h2>
          <div className="founders-grid">
            {FOUNDERS.map((f) => (
              <div key={f.name} className="founder-card">
                <div className="founder-avatar" />
                <div>
                  <div className="founder-name">{f.name}</div>
                  <div className="founder-role">{f.role}</div>
                  <p className="founder-bio" style={{ marginTop: "0.5rem" }}>{f.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="staffing-block">
            <h2>How we staff projects</h2>
            <p>
              Our core team stays constant. For each project, we bring in specialist contractors
              with exactly the expertise the problem demands — whether that&apos;s a React Native developer,
              a data engineer, or an ML researcher. You get the right person for the job,
              not whoever happens to be on a bench.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
