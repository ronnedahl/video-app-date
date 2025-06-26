import { create } from 'zustand';
import { DatingProfile, DatingState, SwipeAction, SwipeRecord } from '../types/dating';
import { DatingService } from '../services/datingService';
import { useAuthStore } from './authStore';

interface DatingStore extends DatingState {
  // Actions
  loadProfiles: () => Promise<void>;
  swipe: (action: SwipeAction) => Promise<void>;
  getCurrentProfile: () => DatingProfile | null;
  getNextProfile: () => DatingProfile | null;
  reset: () => void;
}

const initialState: DatingState = {
  profiles: [],
  currentProfileIndex: 0,
  isLoading: false,
  error: null,
  swipeHistory: [],
};

export const useDatingStore = create<DatingStore>((set, get) => ({
  ...initialState,

  loadProfiles: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ error: 'Du måste vara inloggad' });
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      // Hämta användarens swipe-historik
      const swipedUserIds = await DatingService.getSwipeHistory(user.uid);
      
      // Hämta profiler (exkludera redan swipade)
      const profiles = await DatingService.getProfiles(user.uid, swipedUserIds);

       console.log('--- STEG 1: Profiler hämtade från Firestore ---');
      console.log(JSON.stringify(profiles, null, 2)); // Använd JSON.stringify för att se hela objektet tydligt
      
      set({ 
        profiles, 
        isLoading: false,
        currentProfileIndex: 0,
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Kunde inte ladda profiler', 
        isLoading: false 
      });
    }
  },

  swipe: async (action: SwipeAction) => {
    const state = get();
    const user = useAuthStore.getState().user;
    const currentProfile = state.profiles[state.currentProfileIndex];
    
    if (!user || !currentProfile) return;

    try {
      // Spara swipe
      await DatingService.saveSwipe(user.uid, currentProfile.id, action);
      
      // Lägg till i swipe-historik
      const swipeRecord: SwipeRecord = {
        userId: user.uid,
        targetUserId: currentProfile.id,
        action,
        timestamp: new Date().toISOString(),
      };
      
      set((state) => ({
        swipeHistory: [...state.swipeHistory, swipeRecord],
        currentProfileIndex: state.currentProfileIndex + 1,
      }));
      
      // Om vi nått slutet, ladda fler profiler
      if (state.currentProfileIndex >= state.profiles.length - 2) {
        get().loadProfiles();
      }
    } catch (error: any) {
      set({ error: error.message || 'Kunde inte spara swipe' });
    }
  },

  getCurrentProfile: () => {
    const state = get();
    return state.profiles[state.currentProfileIndex] || null;
  },

  getNextProfile: () => {
    const state = get();
    return state.profiles[state.currentProfileIndex + 1] || null;
  },

  reset: () => {
    set(initialState);
  },
}));