import { ProjectList, ProjectDetail, ServiceOffering, TeamMember, Testimonial } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function fetchProjects(category?: string, featured?: boolean): Promise<ProjectList[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured) params.append('featured', 'true');
    
    const url = `${API_BASE_URL}/projects/?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    return data.results || data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}/`, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch project');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchServices(): Promise<ServiceOffering[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/services/`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch services');
    const data = await res.json();
    return data.results || data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function submitLead(data: any): Promise<{success: boolean; error?: string}> {
  try {
    const res = await fetch(`${API_BASE_URL}/leads/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const json = await res.json();
    
    if (!res.ok) {
      return { success: false, error: json.error || 'Failed to submit.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Network error. Please try again later.' };
  }
}
