import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bluebug.xyz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic project pages
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    const res = await fetch(`${API_URL}/projects/`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const projects = Array.isArray(data) ? data : (data.results || []);
      projectPages = projects.map((p: { slug: string; updated_at?: string }) => ({
        url: `${BASE_URL}/work/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.error("Sitemap: failed to fetch projects", e);
  }

  return [...staticPages, ...projectPages];
}
