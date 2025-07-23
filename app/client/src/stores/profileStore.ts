import { create } from 'zustand';
import { fetchProfilesByProject as fetchProfilesService } from '../services/profileService';
import { HoneycombProfile } from 'shared/src/types';

interface ProfileState {
  profiles: HoneycombProfile[];
  isLoading: boolean;
  error: string | null;
  fetchProfiles: (projectAddress: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  isLoading: false,
  error: null,
  fetchProfiles: async (projectAddress: string) => {
    set({ isLoading: true, error: null });
    try {
      const profiles = await fetchProfilesService(projectAddress);
      set({ profiles, isLoading: false });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
}));
