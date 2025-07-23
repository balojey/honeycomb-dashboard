import { create } from 'zustand';
import { fetchProjects as fetchProjectsService } from '../services/projectService';
import { Project } from '@honeycomb-protocol/edge-client';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: (authority: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  isLoading: false,
  error: null,
  fetchProjects: async (authority: string) => {
    set({ isLoading: true, error: null });
    try {
      const projects = await fetchProjectsService(authority);
      set({ projects, isLoading: false });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
}));
