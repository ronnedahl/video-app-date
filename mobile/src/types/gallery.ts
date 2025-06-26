export interface VideoItem {
  id: string;
  uri: string;
  thumbnailUri?: string;
  duration: number;
  createdAt: number;
  width: number;
  height: number;
  filename: string;
  mediaType: string;
  albumId?: string;
}

export interface GalleryState {
  videos: VideoItem[];
  isLoading: boolean;
  error: string | null;
  selectedVideo: VideoItem | null;
}