// hooks/useVideoWithQuestions.ts

import { useState, useEffect, useCallback } from 'react';
import { useVideoPlayer, VideoPlayer } from 'expo-video';
import { VideoMetadata, QuestionTiming, VideoPlaybackState } from '../types/videoMetadata.types';

interface UseVideoWithQuestionsReturn {
  player: VideoPlayer;
  currentQuestion: QuestionTiming | null;
  playbackState: VideoPlaybackState;
  isReady: boolean;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
  replay: () => void;
}

export const useVideoWithQuestions = (
  metadata: VideoMetadata
): UseVideoWithQuestionsReturn => {
  const [isReady, setIsReady] = useState(false);
  const [playbackState, setPlaybackState] = useState<VideoPlaybackState>({
    currentTime: 0,
    duration: metadata.duration,
    isPlaying: false,
    currentQuestion: null,
    questionIndex: -1,
  });

  // Skapa video player
  const player = useVideoPlayer(metadata.uri, (player) => {
    player.loop = false;
    player.pause();
  });

  // Uppdatera current question baserat på tid
  const updateCurrentQuestion = useCallback((currentTime: number) => {
    const currentQ = metadata.questions.find(
      q => currentTime >= q.startTime && currentTime < q.endTime
    );
    
    const questionIndex = currentQ 
      ? metadata.questions.findIndex(q => q.id === currentQ.id)
      : -1;

    setPlaybackState(prev => ({
      ...prev,
      currentTime,
      currentQuestion: currentQ || null,
      questionIndex,
    }));
  }, [metadata.questions]);

  // Lyssna på video status
  useEffect(() => {
    const statusListener = player.addListener('statusChange', (event: { status: string }) => {
      if (event.status === 'readyToPlay') {
        setIsReady(true);
      }
    });

    const playingListener = player.addListener('playingChange', (event: { isPlaying: boolean }) => {
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: event.isPlaying,
      }));
    });

    // Time update listener
    player.timeUpdateEventInterval = 0.1; // Update every 100ms
    const timeListener = player.addListener('timeUpdate', (event: { currentTime: number }) => {
      updateCurrentQuestion(event.currentTime);
    });

    return () => {
      statusListener.remove();
      playingListener.remove();
      timeListener.remove();
    };
  }, [player, updateCurrentQuestion]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player]);

  // Seek to specific time
  const seekTo = useCallback((seconds: number) => {
    player.currentTime = Math.max(0, Math.min(seconds, metadata.duration));
    updateCurrentQuestion(seconds);
  }, [player, metadata.duration, updateCurrentQuestion]);

  // Replay video
  const replay = useCallback(() => {
    player.currentTime = 0;
    player.play();
  }, [player]);

  return {
    player,
    currentQuestion: playbackState.currentQuestion,
    playbackState,
    isReady,
    togglePlayPause,
    seekTo,
    replay,
  };
};