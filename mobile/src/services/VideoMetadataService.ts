// services/VideoMetadataService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoMetadata, QuestionTiming } from '../types/videoMetadata.types';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { getDeviceInfo } from '../utils/deviceInfoUtils';
import { Platform } from 'react-native';

const STORAGE_KEY = '@video_metadata';
const QUESTION_DURATION = 3.333; // Sekunder per fråga

export class VideoMetadataService {
  /**
   * Hämta device model på ett säkert sätt
   */
  private static getDeviceModel(): string {
    if (Platform.OS === 'ios') {
      // iOS har 'Model' property
      return (Platform.constants as any).Model || 'iPhone';
    } else if (Platform.OS === 'android') {
      // Android har 'Model' i en annan struktur
      return (Platform.constants as any).Model || 
             (Platform.constants as any).Brand || 
             'Android Device';
    }
    return 'Unknown Device';
  }
  /**
   * Skapa metadata från inspelningssession
   */
  static async createVideoMetadata(
    videoUri: string,
    duration: number,
    questions: string[],
    recordingStartTime: number
  ): Promise<VideoMetadata> {
    // Generera ID
    const id = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Skapa question timings
    const questionTimings: QuestionTiming[] = questions.map((text, index) => ({
      id: `q_${index}_${Date.now()}`,
      text,
      startTime: index * QUESTION_DURATION,
      endTime: (index + 1) * QUESTION_DURATION,
      order: index,
    }));

    // Generera thumbnail
    let thumbnail: string | undefined;
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 1000, // 1 sekund in i videon
      });
      thumbnail = uri;
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
    }

    // Skapa metadata objekt
    const metadata: VideoMetadata = {
      id,
      uri: videoUri,
      duration,
      recordedAt: recordingStartTime,
      questions: questionTimings,
      thumbnail,
      deviceInfo: getDeviceInfo(),
    };

    return metadata;
  }

  /**
   * Spara metadata lokalt
   */
  static async saveMetadata(metadata: VideoMetadata): Promise<void> {
    try {
      // Hämta existerande metadata
      const existing = await this.getAllMetadata();
      
      // Lägg till ny metadata
      const updated = [...existing, metadata];
      
      // Spara
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save metadata:', error);
      throw error;
    }
  }

  /**
   * Hämta all metadata
   */
  static async getAllMetadata(): Promise<VideoMetadata[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get metadata:', error);
      return [];
    }
  }

  /**
   * Hämta metadata för specifik video
   */
  static async getMetadataById(id: string): Promise<VideoMetadata | null> {
    try {
      const all = await this.getAllMetadata();
      return all.find(m => m.id === id) || null;
    } catch (error) {
      console.error('Failed to get metadata by id:', error);
      return null;
    }
  }

  /**
   * Hämta metadata för video URI
   */
  static async getMetadataByUri(uri: string): Promise<VideoMetadata | null> {
    try {
      const all = await this.getAllMetadata();
      return all.find(m => m.uri === uri) || null;
    } catch (error) {
      console.error('Failed to get metadata by uri:', error);
      return null;
    }
  }

  /**
   * Uppdatera metadata
   */
  static async updateMetadata(id: string, updates: Partial<VideoMetadata>): Promise<void> {
    try {
      const all = await this.getAllMetadata();
      const index = all.findIndex(m => m.id === id);
      
      if (index !== -1) {
        all[index] = { ...all[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      }
    } catch (error) {
      console.error('Failed to update metadata:', error);
      throw error;
    }
  }

  /**
   * Ta bort metadata
   */
  static async deleteMetadata(id: string): Promise<void> {
    try {
      const all = await this.getAllMetadata();
      const filtered = all.filter(m => m.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete metadata:', error);
      throw error;
    }
  }

  /**
   * Rensa all metadata
   */
  static async clearAllMetadata(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear metadata:', error);
      throw error;
    }
  }

  /**
   * Validera metadata
   */
  static validateMetadata(metadata: any): metadata is VideoMetadata {
    return (
      metadata &&
      typeof metadata.id === 'string' &&
      typeof metadata.uri === 'string' &&
      typeof metadata.duration === 'number' &&
      Array.isArray(metadata.questions)
    );
  }

  /**
   * Migrera gammal metadata (om du uppdaterar strukturen)
   */
  static async migrateMetadata(): Promise<void> {
    try {
      const all = await this.getAllMetadata();
      
      // Exempel på migration
      const migrated = all.map(metadata => {
        // Lägg till saknade fält
        if (!metadata.deviceInfo) {
          metadata.deviceInfo = getDeviceInfo();
        }
        return metadata;
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    } catch (error) {
      console.error('Failed to migrate metadata:', error);
    }
  }
}