"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { SiteStatsResponse } from "@/lib/types";
import { fetchStats } from "@/lib/api";

declare global {
  interface Window {
    Plotly: {
      newPlot: (el: HTMLElement, data: object[], layout: object, config: object) => void;
      react?: (el: HTMLElement, data: object[], layout: object, config: object) => void;
    };
  }
}

const DEFAULT_HEADLINES = [
  { target: 12, suffix: "+", label: "Projects Shipped" },
  { target: 6,  suffix: "",  label: "Service Offerings" },
  { target: 100, suffix: "%", label: "Client Satisfaction" },
  { target: 3,  suffix: "+", label: "Years Building" },
];

const DEFAULT_RADAR = {
  categories: ["Django", "Next.js", "React Native", "PostgreSQL", "Python", "TypeScript", "AI/ML"],
  values: [9, 8, 7, 9, 8, 8, 7],
};

const DEFAULT_WORK_MIX = {
  labels: ["Web App", "AI/ML", "PWA", "Data", "Healthcare"],
  values: [40, 20, 20, 10, 10],
  colors: ["#1481F8", "#38bdf8", "#6366f1", "#0ea5e9", "#34D399"],
};

const DEFAULT_SPRINT = {
  phases: ["Discovery", "Design", "Build", "QA", "Ship"],
  weeks: [1, 1.5, 6, 1.5, 0.5],
};

const BRAND_BLUE = "#1481F8";
const BRAND_AZURE = "#38bdf8";
const TEXT_SECONDARY = "#9AABC4";
const TRANSPARENT = "rgba(0,0,0,0)";

const PLOT_LAYOUT_BASE = {
  paper_bgcolor: TRANSPARENT,
  plot_bgcolor: TRANSPARENT,
  font: { family: "Inter, sans-serif", color: TEXT_SECONDARY, size: 11 },
  margin: { t: 20, b: 20, l: 20, r: 20 },
  showlegend: false,
};

interface StatsSectionProps {
  initialData?: SiteStatsResponse | null;
}

export function StatsSection({ initialData }: StatsSectionProps) {
  const [data, setData] = useState<SiteStatsResponse | null>(initialData ?? null);
  const radarRef = useRef<HTMLDivElement>(null);
  const donutRef = useRef<HTMLDivElement>(null);
  const barRef   = useRef<HTMLDivElement>(null);
  const isVisible = useRef(false);

  // Client-side fetch if initialData was not provided
  useEffect(() => {
    if (!data) {
      fetchStats().then((res) => {
        if (res) setData(res);
      });
    }
  }, [data]);

  const renderPlots = useCallback(() => {
    if (typeof window === "undefined" || !window.Plotly) return;

    const radarCats = data?.radar_chart?.categories?.length ? data.radar_chart.categories : DEFAULT_RADAR.categories;
    const radarVals = data?.radar_chart?.values?.length ? data.radar_chart.values : DEFAULT_RADAR.values;

    const workLabels = data?.work_mix_chart?.labels?.length ? data.work_mix_chart.labels : DEFAULT_WORK_MIX.labels;
    const workVals   = data?.work_mix_chart?.values?.length ? data.work_mix_chart.values : DEFAULT_WORK_MIX.values;
    const workColors = data?.work_mix_chart?.colors?.length ? data.work_mix_chart.colors : DEFAULT_WORK_MIX.colors;

    const sprintPhases = data?.sprint_timeline_chart?.phases?.length ? data.sprint_timeline_chart.phases : DEFAULT_SPRINT.phases;
    const sprintWeeks  = data?.sprint_timeline_chart?.weeks?.length ? data.sprint_timeline_chart.weeks : DEFAULT_SPRINT.weeks;

    // --- RADAR: Skills / Technology Coverage ---
    if (radarRef.current) {
      window.Plotly.newPlot(
        radarRef.current,
        [{
          type: "scatterpolar",
          r: radarVals,
          theta: radarCats,
          fill: "toself",
          fillcolor: "rgba(20, 129, 248, 0.18)",
          line: { color: BRAND_BLUE, width: 2 },
          marker: { color: BRAND_AZURE, size: 5 },
          name: "BlueBug Stack",
        }],
        {
          ...PLOT_LAYOUT_BASE,
          polar: {
            bgcolor: TRANSPARENT,
            radialaxis: { visible: true, range: [0, 10], color: "rgba(255,255,255,0.1)", tickfont: { size: 9 } },
            angularaxis: { color: "rgba(255,255,255,0.15)", tickfont: { size: 10, color: "#9AABC4" } },
            gridshape: "linear",
          },
        },
        { responsive: true, displayModeBar: false }
      );
    }

    // --- DONUT: Projects by category ---
    if (donutRef.current) {
      window.Plotly.newPlot(
        donutRef.current,
        [{
          type: "pie",
          hole: 0.62,
          values: workVals,
          labels: workLabels,
          marker: {
            colors: workColors.length === workLabels.length ? workColors : DEFAULT_WORK_MIX.colors,
            line: { color: "#06090F", width: 2 },
          },
          textinfo: "none",
          hovertemplate: "<b>%{label}</b><br>%{percent}<extra></extra>",
        }],
        {
          ...PLOT_LAYOUT_BASE,
          annotations: [{
            text: "Work<br>Mix",
            x: 0.5, y: 0.5,
            font: { size: 13, color: "#EFF3FF", family: "Inter, sans-serif" },
            showarrow: false,
          }],
        },
        { responsive: true, displayModeBar: false }
      );
    }

    // --- BAR: Avg weeks per phase ---
    if (barRef.current) {
      const maxWeeks = Math.max(...sprintWeeks, 6);
      window.Plotly.newPlot(
        barRef.current,
        [{
          type: "bar",
          x: sprintPhases,
          y: sprintWeeks,
          cliponaxis: false,
          marker: {
            color: sprintWeeks.map((_, i) => {
              const pal = ["rgba(20,129,248,0.5)", "rgba(20,129,248,0.65)", "rgba(20,129,248,0.9)", "rgba(56,189,248,0.75)", "rgba(52,211,153,0.85)"];
              return pal[i % pal.length];
            }),
            line: { color: TRANSPARENT, width: 0 },
          },
          text: sprintWeeks.map((w) => `${w}w`),
          textposition: "outside",
          textfont: { color: "#38bdf8", size: 11, family: "Inter, sans-serif" },
          hovertemplate: "<b>%{x}</b><br>Avg: %{y} weeks<extra></extra>",
        }],
        {
          ...PLOT_LAYOUT_BASE,
          margin: { t: 45, b: 40, l: 35, r: 20 },
          xaxis: { color: "rgba(255,255,255,0.15)", tickfont: { size: 10, color: TEXT_SECONDARY }, gridcolor: TRANSPARENT, zeroline: false },
          yaxis: {
            range: [0, maxWeeks * 1.32],
            color: "rgba(255,255,255,0.08)",
            tickfont: { size: 9, color: TEXT_SECONDARY },
            gridcolor: "rgba(255,255,255,0.04)",
            zeroline: false,
            title: { text: "Weeks", font: { size: 10, color: TEXT_SECONDARY } }
          },
        },
        { responsive: true, displayModeBar: false }
      );
    }
  }, [data]);

  useEffect(() => {
    const container = radarRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisible.current = true;
          const checkPlotly = setInterval(() => {
            if (window.Plotly) {
              clearInterval(checkPlotly);
              renderPlots();
            }
          }, 80);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(container);

    // If data changed after initial visibility
    if (isVisible.current && window.Plotly) {
      renderPlots();
    }

    return () => observer.disconnect();
  }, [renderPlots]);

  const headlines = data?.headline_stats?.length
    ? data.headline_stats.map((h) => ({
        label: h.label,
        target: h.target,
        suffix: h.suffix,
      }))
    : DEFAULT_HEADLINES;

  return (
    <section className="section stats-section" style={{ background: "var(--bb-surface)", borderTop: "1px solid var(--bb-border)", borderBottom: "1px solid var(--bb-border)" }}>
      <div className="container">
        {/* Section header */}
        <div className="section-hd centered reveal">
          <span className="label">By The Numbers</span>
          <h2>Results We're Proud Of</h2>
          <p>Real metrics from real work — fully managed and delivered.</p>
        </div>

        {/* Counter row */}
        <div className="stats-counter-row">
          {headlines.map((s, i) => (
            <div key={s.label} className={`stats-counter-item reveal reveal-delay-${(i % 4) + 1}`}>
              <div className="stats-counter-num">
                <AnimatedCounter target={s.target} suffix={s.suffix} duration={2200} />
              </div>
              <div className="stats-counter-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="stats-charts-row">
          <div className="stats-chart-card reveal reveal-delay-1">
            <div className="stats-chart-title">Technology Depth</div>
            <div ref={radarRef} className="stats-chart-canvas" />
          </div>
          <div className="stats-chart-card reveal reveal-delay-2">
            <div className="stats-chart-title">Work by Category</div>
            <div ref={donutRef} className="stats-chart-canvas" />
          </div>
          <div className="stats-chart-card reveal reveal-delay-3">
            <div className="stats-chart-title">Avg Sprint Timeline</div>
            <div ref={barRef} className="stats-chart-canvas" />
          </div>
        </div>
      </div>
    </section>
  );
}
