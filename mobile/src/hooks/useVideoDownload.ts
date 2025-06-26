import { useState, useCallback } from 'react';
import { VideoDownloadService } from '../services/videoDownloader';
import { Alert } from 'react-native';

interface UseVideoDownloadReturn {
  isDownloading: boolean;
  downloadProgress: number;
  downloadedVideoUri: string | null;
  playableVideoUri: string | null; 
  downloadVideo: (videoId: string) => Promise<void>;
  reset: () => void;
}

export const useVideoDownload = (): UseVideoDownloadReturn => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedVideoUri, setDownloadedVideoUri] = useState<string | null>(null);
  const [playableVideoUri, setPlayableVideoUri] = useState<string | null>(null); // LÄGG TILL DENNA RAD
  
  const downloadVideo = useCallback(async (videoId: string) => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      const result = await VideoDownloadService.downloadAndSaveVideo(
        videoId,
        (progress) => setDownloadProgress(progress)
      );
      
      setDownloadedVideoUri(result.uri);
      setPlayableVideoUri(result.localUri || result.uri); // LÄGG TILL DENNA RAD
      
      Alert.alert(
        'Klart!',
        'Video har sparats i ditt galleri',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Fel', 'Kunde inte ladda ner video');
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  }, []);
  
  const reset = useCallback(() => {
    setIsDownloading(false);
    setDownloadProgress(0);
    setDownloadedVideoUri(null);
    setPlayableVideoUri(null); // LÄGG TILL DENNA RAD
  }, []);
  
  return {
    isDownloading,
    downloadProgress,
    downloadedVideoUri,
    playableVideoUri, // LÄGG TILL DENNA RAD
    downloadVideo,
    reset
  };
};