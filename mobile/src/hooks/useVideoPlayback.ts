import { useState, useEffect, useCallback, useMemo } from 'react';
import { useVideoPlayer, VideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import { VideoMetadata, VideoPlaybackState } from '../types/video';

const QUESTION_DURATION = 3.333;

interface UseVideoPlaybackReturn {
  player: VideoPlayer;
  playbackState: VideoPlaybackState;
  currentQuestion: string;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
  isReady: boolean;
  hasError: boolean;
}

export const useVideoPlayback = (metadata: VideoMetadata): UseVideoPlaybackReturn => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playbackState, setPlaybackState] = useState<VideoPlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: metadata.duration || 20,
    currentQuestionIndex: 0,
  });

  // Skapa video player - VIKTIGT: vänta med att spela
  const player = useVideoPlayer(metadata.uri, (player) => {
    player.loop = false;
    // Vänta med att spela tills videon är redo
    player.pause();
    
    // Sätt volym och andra inställningar
    player.volume = 1.0;
    player.muted = false;
  });

  // Lyssna på status ändringar för att veta när videon är redo
  useEffect(() => {
    const statusSubscription = player.addListener('statusChange', (event: { status: string; error?: any }) => {
      console.log('Video status:', event.status);
      
      switch (event.status) {
        case 'readyToPlay':
          setIsReady(true);
          setHasError(false);
          // Nu kan vi spela videon säkert
          player.play();
          break;
        case 'loading':
          setIsReady(false);
          break;
        case 'error':
          console.error('Video error:', event.error);
          setHasError(true);
          setIsReady(false);
          break;
      }
    });

    return () => {
      statusSubscription.remove();
    };
  }, [player]);

  // Lyssna på playing status
  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing
  });

  // Lyssna på tidsuppdateringar
  useEffect(() => {
    // Sätt intervall för tidsuppdateringar
    player.timeUpdateEventInterval = 0.1;
    
    const subscription = player.addListener('timeUpdate', (event: { currentTime: number }) => {
      const currentTime = event.currentTime;
      const questionIndex = Math.floor(currentTime / QUESTION_DURATION);
      const boundedIndex = Math.min(questionIndex, metadata.questions.length - 1);
      
      setPlaybackState(prev => ({
        ...prev,
        currentTime,
        currentQuestionIndex: boundedIndex,
      }));
    });

    return () => {
      subscription.remove();
    };
  }, [player, metadata.questions.length]);

  // Uppdatera duration från player direkt (durationChange event finns inte)
  useEffect(() => {
    if (player.duration > 0) {
      setPlaybackState(prev => ({
        ...prev,
        duration: player.duration,
      }));
    }
  }, [player.duration]);

  // Uppdatera playing state
  useEffect(() => {
    setPlaybackState(prev => ({
      ...prev,
      isPlaying,
    }));
  }, [isPlaying]);

  const togglePlayPause = useCallback(() => {
    if (!isReady) {
      console.warn('Video not ready yet');
      return;
    }
    
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player, isReady]);

  const seekTo = useCallback((seconds: number) => {
    if (!isReady) {
      console.warn('Video not ready yet');
      return;
    }
    
    // Säkerställ att vi inte söker utanför videons längd
    const clampedTime = Math.max(0, Math.min(seconds, player.duration || metadata.duration));
    player.currentTime = clampedTime;
  }, [player, isReady, metadata.duration]);

  const currentQuestion = useMemo(() => {
    return metadata.questions[playbackState.currentQuestionIndex] || '';
  }, [metadata.questions, playbackState.currentQuestionIndex]);

  return {
    player,
    playbackState,
    currentQuestion,
    togglePlayPause,
    seekTo,
    isReady,
    hasError,
  };
};