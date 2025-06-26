import { create } from 'zustand';
import { UserProfile, ProfileFormData } from '../types/profile';
import { ProfileService } from '../services/ProfileService';
import { useAuthStore } from './authStore';

interface ProfileStore {
  // State
  profile: UserProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  selectedVideoUri: string | null;
  
  // Actions
  loadProfile: () => Promise<void>;
  saveProfile: (formData: ProfileFormData, videoUri: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  setSelectedVideo: (uri: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  // Initial state
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,
  selectedVideoUri: null,

  // Load existing profile
  loadProfile: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const profile = await ProfileService.getProfile(user.uid);
      set({ profile, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Kunde inte ladda profil', 
        isLoading: false 
      });
    }
  },

  // Save new profile with video
  saveProfile: async (formData: ProfileFormData, videoUri: string) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'Du måste vara inloggad' });
      return false;
    }

    set({ isSaving: true, error: null });
    try {
      // Upload video to Firebase Storage
      const videoUrl = await ProfileService.uploadProfileVideo(user.uid, videoUri);
      
      // Create profile data
      const profileData: UserProfile = {
        email: user.email || '',
        ...formData,
        videoURL: videoUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to Firestore
      await ProfileService.saveProfile(user.uid, profileData);
      
      set({ 
        profile: profileData, 
        isSaving: false,
        selectedVideoUri: null 
      });
      
      return true;
    } catch (error: any) {
      set({ 
        error: error.message || 'Kunde inte spara profil', 
        isSaving: false 
      });
      return false;
    }
  },

  // Update existing profile
  updateProfile: async (updates: Partial<UserProfile>) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'Du måste vara inloggad' });
      return false;
    }

    set({ isSaving: true, error: null });
    try {
      await ProfileService.updateProfile(user.uid, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      
      const currentProfile = get().profile;
      set({ 
        profile: currentProfile ? { ...currentProfile, ...updates } : null,
        isSaving: false 
      });
      
      return true;
    } catch (error: any) {
      set({ 
        error: error.message || 'Kunde inte uppdatera profil', 
        isSaving: false 
      });
      return false;
    }
  },

  setSelectedVideo: (uri: string | null) => {
    set({ selectedVideoUri: uri });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      profile: null,
      isLoading: false,
      isSaving: false,
      error: null,
      selectedVideoUri: null,
    });
  },
}));