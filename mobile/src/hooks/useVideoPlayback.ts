import { useState, useEffect, useCallback, useMemo } from 'react';
import { useVideoPlayer, VideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
import { VideoMetadata, VideoPlaybackState } from '../types/video';

const QUESTION_DURATION = 3.333; // Samma som vid inspelning

interface UseVideoPlaybackReturn {
  player: VideoPlayer;
  playbackState: VideoPlaybackState;
  currentQuestion: string;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
}

export const useVideoPlayback = (metadata: VideoMetadata): UseVideoPlaybackReturn => {
  const [playbackState, setPlaybackState] = useState<VideoPlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: metadata.duration || 20,
    currentQuestionIndex: 0,
  });

  // Skapa video player
  const player = useVideoPlayer(metadata.uri, (player) => {
    player.loop = false;
    player.play();
  });

  // Lyssna på statusförändringar
  const { status } = useEvent(player, 'statusChange', { 
    status: player.status 
  });

  // Lyssna på playing status
  const { isPlaying } = useEvent(player, 'playingChange', { 
    isPlaying: player.playing 
  });

  // Lyssna på tidsuppdateringar
  useEffect(() => {
    // Sätt intervall för tidsuppdateringar
    player.timeUpdateEventInterval = 0.1; // Uppdatera var 100ms
    
    const subscription = player.addListener('timeUpdate', ({ currentTime }) => {
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

  // Uppdatera duration när videon laddas
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
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player]);

  const seekTo = useCallback((seconds: number) => {
    player.currentTime = seconds;
  }, [player]);

  const currentQuestion = useMemo(() => {
    return metadata.questions[playbackState.currentQuestionIndex] || '';
  }, [metadata.questions, playbackState.currentQuestionIndex]);

  return {
    player,
    playbackState,
    currentQuestion,
    togglePlayPause,
    seekTo,
  };
};