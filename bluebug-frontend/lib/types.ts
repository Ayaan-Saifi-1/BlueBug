export interface ProjectImage {
  id: number;
  image: string;
  caption: string | null;
  order: number;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_role: string | null;
  client_company: string | null;
  quote: string;
  client_photo: string | null;
}

export interface ProjectList {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  category: 'web' | 'pwa' | 'ai_ml' | 'data' | 'healthcare';
  status: 'live' | 'in_progress' | 'archived';
  live_url: string | null;
  github_url: string | null;
  cover_image: string;
  is_featured: boolean;
}

export interface ProjectDetail extends ProjectList {
  problem_statement: string;
  approach: string;
  key_features: string[];
  tech_stack: string[];
  outcome: string | null;
  demo_video_url: string | null;
  team_credit: string | null;
  gallery_images: ProjectImage[];
  testimonials: Testimonial[];
}

export interface ServiceOffering {
  id: number;
  title: string;
  slug: string;
  icon_name: string;
  short_description: string;
  full_description: string;
  proof_project: number | null;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio_line: string;
  photo: string;
  is_founder: boolean;
}
