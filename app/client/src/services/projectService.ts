import { Project } from '@honeycomb-protocol/edge-client';

const API_URL = 'http://localhost:3000'; // TODO: Make this configurable

export const fetchProjects = async (authority: string): Promise<Project[]> => {
  const response = await fetch(`${API_URL}/api/projects?authority=${authority}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch projects');
  }

  return response.json();
};
