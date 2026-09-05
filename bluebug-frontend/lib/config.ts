/**
 * BlueBug Site Configuration
 * ===========================
 * ONE PLACE to change nav links, services, tech stack pills, social links.
 * Pages pull from here — never hardcode content inside JSX directly.
 */

export const SITE_CONFIG = {
  name: "BlueBug",
  tagline: "We build the tech that moves your business forward.",
  email: "hello@bluebug.xyz",
  github: "https://github.com/Project-eigen",
};

export const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const TECH_PILLS = [
  "Django", "Next.js", "PostgreSQL", "Python", "TypeScript", "React Native",
];

export const SERVICES_FALLBACK = [
  {
    slug: "custom-websites",
    title: "Custom Websites",
    short_description: "Bespoke, high-performance websites built to convert — not templates.",
  },
  {
    slug: "custom-apps",
    title: "Custom Apps",
    short_description: "Full-stack web and mobile applications tailored to your exact workflow.",
  },
  {
    slug: "progressive-web-apps",
    title: "Progressive Web Apps",
    short_description: "App-like experiences that install instantly and work offline.",
  },
  {
    slug: "ai-ml-solutions",
    title: "AI / ML Solutions",
    short_description: "Production-grade ML pipelines, NLP systems, and prediction engines.",
  },
  {
    slug: "data-engineering",
    title: "Data Engineering",
    short_description: "Pipelines, data warehouses, and analytics for data-driven decisions.",
  },
  {
    slug: "institutional-systems",
    title: "Institutional Systems",
    short_description: "Complex information systems for hospitals, universities, and institutions.",
  },
];

export const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery",
    desc: "We dig deep into your problem, your users, and your constraints before writing a single line of code.",
  },
  {
    num: "02",
    title: "Design",
    desc: "System design and architecture first. No surprise re-writes mid-build.",
  },
  {
    num: "03",
    title: "Build",
    desc: "Iterative sprints with clear milestones. You see real progress every week.",
  },
  {
    num: "04",
    title: "Ship",
    desc: "Deployed with confidence, documented, and supported post-launch.",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  web: "Web App",
  pwa: "PWA",
  ai_ml: "AI / ML",
  data: "Data",
  healthcare: "Healthcare",
};

export const FOUNDERS = [
  {
    name: "Founder 1",
    role: "Co-Founder",
    bio: "Strategy, client relationships, and making sure everything ships on time and on spec.",
  },
  {
    name: "Founder 2",
    role: "Co-Founder",
    bio: "Technical architecture, AI integrations, and the code that actually runs in production.",
  },
];
