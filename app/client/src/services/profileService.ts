import { HoneycombProfile } from "../../../shared/src/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const fetchProfilesByProject = async (projectAddress: string): Promise<HoneycombProfile[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/projects/${projectAddress}/profiles`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch profiles');
    }

    const profiles = await response.json();
    return profiles;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while fetching profiles');
  }
};
