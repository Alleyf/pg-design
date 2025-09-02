import { ProjectService } from '../../lib/database/project';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  try {
    const projects = await ProjectService.getAllProjects();
    return new Response(JSON.stringify(projects), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};