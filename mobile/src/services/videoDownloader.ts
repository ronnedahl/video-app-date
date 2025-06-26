import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { API_BASE_URL } from '../config/constants';

interface DownloadResult {
  uri: string;
  localUri:string
  mediaAsset: MediaLibrary.Asset;
}

export class VideoDownloadService {
  /**
   * Laddar ner komprimerad video från servern
   */
  static async downloadVideo(
    videoId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const downloadUrl = `${API_BASE_URL}/videos/${videoId}/download`;
    const fileUri = `${FileSystem.documentDirectory}${videoId}_compressed.mp4`;

    const downloadResumable = FileSystem.createDownloadResumable(
      downloadUrl,
      fileUri,
      {},
      // Använd FileSystem's inbyggda typ direkt
      (data) => {
        const progress = data.totalBytesWritten / data.totalBytesExpectedToWrite;
        onProgress?.(progress * 100);
      }
    );

    try {
      const result = await downloadResumable.downloadAsync();
      if (!result) {
        throw new Error('Download failed');
      }
      return result.uri;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  /**
   * Sparar video till media library
   */
  static async saveToMediaLibrary(
    localUri: string,
    albumName: string = 'Video Recorder'
  ): Promise<MediaLibrary.Asset> {
    // Kontrollera permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Media library permissions not granted');
    }

    // Skapa asset
    const asset = await MediaLibrary.createAssetAsync(localUri);

    // Skapa eller hämta album
    const album = await MediaLibrary.getAlbumAsync(albumName);
    
    if (album) {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    } else {
      await MediaLibrary.createAlbumAsync(albumName, asset, false);
    }

    return asset;
  }

  /**
   * Laddar ner och sparar video i ett steg
   */
  static async downloadAndSaveVideo(
    videoId: string,
    onProgress?: (progress: number) => void
  ): Promise<DownloadResult> {
    try {
      // Ladda ner från server
      const localUri = await this.downloadVideo(videoId, onProgress);
      
      // Spara till media library
      const mediaAsset = await this.saveToMediaLibrary(localUri);
      
      // // Ta bort temporär fil
      // await FileSystem.deleteAsync(localUri, { idempotent: true });
      
      return {
        uri: mediaAsset.uri,
        localUri: localUri,
        mediaAsset
      };
    } catch (error) {
      console.error('Download and save error:', error);
      throw error;
    }
  }
}
