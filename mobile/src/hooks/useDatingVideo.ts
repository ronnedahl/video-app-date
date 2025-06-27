import { useState, useEffect } from 'react';
import { useVideoPlayer } from 'expo-video';

interface UseDatingVideoReturn {
  player: any;
  isLoading: boolean;
  isReady: boolean;
  hasError: boolean;
  error: any;
}

export const useDatingVideo = (videoUrl: string, isActive: boolean): UseDatingVideoReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<any>(null);

  // Skapa video player
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = false;
    player.volume = 0.5;
    player.pause(); // Vänta med att spela
  });

  // Hantera video status
  useEffect(() => {
    const statusSubscription = player.addListener('statusChange', (event: { status: string; error?: any }) => {
      console.log('Video status:', event.status);
      
      switch (event.status) {
        case 'readyToPlay':
          setIsReady(true);
          setIsLoading(false);
          setHasError(false);
          
          if (isActive) {
            player.play();
          }
          break;
          
        case 'loading':
          setIsLoading(true);
          setIsReady(false);
          break;
          
        case 'error':
          console.error('Video error:', event.error);
          setError(event.error);
          setHasError(true);
          setIsLoading(false);
          break;
      }
    });

    const sourceSubscription = player.addListener('sourceChange', () => {
      console.log('Video source changed');
      setIsLoading(true);
      setIsReady(false);
    });

    return () => {
      statusSubscription.remove();
      sourceSubscription.remove();
    };
  }, [player, isActive]);

  // Hantera play/pause baserat på aktiv status
  useEffect(() => {
    if (isReady) {
      if (isActive) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [isActive, isReady, player]);

  // Cleanup
  useEffect(() => {
    return () => {
      player.release();
    };
  }, [player]);

  return {
    player,
    isLoading,
    isReady,
    hasError,
    error,
  };
};