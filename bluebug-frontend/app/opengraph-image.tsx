import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #06090F 0%, #0C1119 50%, #182030 100%)",
        }}
      >
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #1481F8, #38bdf8, #6366f1)" }} />

        {/* Logo text */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, background: "rgba(20, 129, 248, 0.15)",
            border: "2px solid rgba(20, 129, 248, 0.3)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 700, color: "#1481F8",
          }}>
            BB
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: "#EFF3FF", letterSpacing: -1 }}>
              Blue<span style={{ color: "#1481F8" }}>Bug</span>
            </span>
            <span style={{ fontSize: 16, color: "#566780", letterSpacing: 2, textTransform: "uppercase" as const }}>
              Engineering & Systems
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 24, color: "#9AABC4", maxWidth: 600, textAlign: "center" as const, lineHeight: 1.5 }}>
          Custom websites, apps, PWAs, and AI/ML systems — designed, built, and shipped.
        </div>

        {/* Tech pills */}
        <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" as const, justifyContent: "center" }}>
          {["Django", "Next.js", "PostgreSQL", "Python", "TypeScript", "React Native"].map((t) => (
            <div key={t} style={{
              padding: "6px 16px", borderRadius: 20, fontSize: 14, color: "#38bdf8",
              background: "rgba(20, 129, 248, 0.1)", border: "1px solid rgba(20, 129, 248, 0.2)",
            }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
