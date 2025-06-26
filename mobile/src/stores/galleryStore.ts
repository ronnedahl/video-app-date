import { create } from 'zustand';
import { GalleryService } from '../services/galleryService';
import { VideoItem, GalleryState } from '../types/gallery';

interface GalleryStore extends GalleryState {
  // Actions
  loadVideos: () => Promise<void>;
  selectVideo: (video: VideoItem | null) => void;
  deleteVideo: (videoId: string) => Promise<boolean>;
  refreshGallery: () => Promise<void>;
  clearError: () => void;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  // Initial state
  videos: [],
  isLoading: false,
  error: null,
  selectedVideo: null,

  // Actions
  loadVideos: async () => {
    set({ isLoading: true, error: null });
    try {
      const videos = await GalleryService.getVideosFromAlbum();
      set({ videos, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Kunde inte ladda videor', 
        isLoading: false 
      });
    }
  },

  selectVideo: (video: VideoItem | null) => {
    set({ selectedVideo: video });
  },

  deleteVideo: async (videoId: string) => {
    try {
      const success = await GalleryService.deleteVideo(videoId);
      if (success) {
        // Ta bort från state
        const videos = get().videos.filter(v => v.id !== videoId);
        set({ videos });
      }
      return success;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  },

  refreshGallery: async () => {
    await get().loadVideos();
  },

  clearError: () => {
    set({ error: null });
  }
}));