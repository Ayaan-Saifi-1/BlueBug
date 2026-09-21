import type { Metadata } from "next";
import { fetchProjects } from "@/lib/api";
import { SubpageCanvas } from "@/components/ui/SubpageCanvas";
import { WorkPageClient } from "@/components/ui/WorkPageClient";

export const metadata: Metadata = {
  title: "Work",
  description: "All BlueBug projects — custom websites, apps, PWAs, AI/ML systems, and healthcare platforms.",
};

export default async function WorkPage() {
  const projects = await fetchProjects();

  return (
    <>
      {/* Page header with Three.js canvas */}
      <div className="subpage-header">
        <SubpageCanvas />
        <div className="container subpage-header-inner">
          <span className="label">Portfolio</span>
          <h1 className="gradient-text">Our Work</h1>
          <p>Real, shipped work. No concepts, no mockups.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "5rem" }}>
        <WorkPageClient projects={projects} />
      </div>
    </>
  );
}
