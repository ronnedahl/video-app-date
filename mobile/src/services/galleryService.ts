import * as MediaLibrary from 'expo-media-library';
import { VideoItem } from '../types/gallery';

export class GalleryService {
  private static ALBUM_NAME = 'Video Recorder';

  /**
   * Hämta alla videor från vårt album
   */
  static async getVideosFromAlbum(): Promise<VideoItem[]> {
    try {
      // Kontrollera permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media library permissions not granted');
      }

      // Hämta album
      const album = await MediaLibrary.getAlbumAsync(this.ALBUM_NAME);
      if (!album) {
        console.log('Album not found, returning empty array');
        return [];
      }

      // Hämta alla assets från albumet
      const assets = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: MediaLibrary.MediaType.video,
        sortBy: MediaLibrary.SortBy.creationTime,
        first: 100, // Max antal videor
      });

      // Konvertera till vårt format
      const videos: VideoItem[] = assets.assets.map(asset => ({
        id: asset.id,
        uri: asset.uri,
        duration: asset.duration,
        createdAt: asset.creationTime,
        width: asset.width,
        height: asset.height,
        filename: asset.filename,
        mediaType: asset.mediaType,
        albumId: asset.albumId,
      }));

      return videos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  /**
   * Generera thumbnail för video
   */
  static async generateThumbnail(videoUri: string): Promise<string | undefined> {
    try {
      // För nu returnerar vi bara video URI
      // I framtiden kan du använda expo-video-thumbnails
      return videoUri;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return undefined;
    }
  }

  /**
   * Ta bort video
   */
  static async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const result = await MediaLibrary.deleteAssetsAsync([videoId]);
      return result;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }
}