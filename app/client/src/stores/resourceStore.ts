import { create } from 'zustand';
import { fetchResourcesForProject } from '../services/projectService';
import { Resource } from '@honeycomb-protocol/edge-client';

interface ResourceStore {
  resources: Resource[];
  isLoading: boolean;
  error: string | null;
  fetchResources: (projectAddress: string) => Promise<void>;
}

export const useResourceStore = create<ResourceStore>((set) => ({
  resources: [],
  isLoading: false,
  error: null,
  fetchResources: async (projectAddress) => {
    set({ isLoading: true, error: null });
    try {
      const resources = await fetchResourcesForProject(projectAddress);
      set({ resources, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));