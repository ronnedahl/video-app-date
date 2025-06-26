import { create } from 'zustand';
import { AuthService } from '../services/authService';
import { User, AuthState, LoginCredentials, SignupCredentials } from '../types/auth';
import { Unsubscribe } from 'firebase/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => Unsubscribe; // ANVÄND FIREBASE's TYP
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // Actions
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.login(credentials);
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
      
      // Spara auth state
     
    } catch (error: any) {
      set({ 
        error: error.message, 
        isLoading: false,
        isAuthenticated: false 
      });
      throw error;
    }
  },

  signup: async (credentials: SignupCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await AuthService.signup(credentials);
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
      
      
    } catch (error: any) {
      set({ 
        error: error.message, 
        isLoading: false,
        isAuthenticated: false 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthService.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      });
      
      
    } catch (error: any) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      isLoading: false 
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: () => {
    // Lyssna på auth state changes
    const unsubscribe = AuthService.subscribeToAuthChanges((user) => {
      get().setUser(user);
    });

    // Cleanup function
    return unsubscribe;
  }
}));