// components/VideoWithQuestionsPlayer.tsx

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { VideoMetadata } from '../types/videoMetadata.types';
import { useVideoWithQuestions } from '../hooks/useVideoWithQuestions';
import { QuestionDisplay } from './QuestionDisplay';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoWithQuestionsPlayerProps {
  metadata: VideoMetadata;
  onClose?: () => void;
  showControls?: boolean;
  autoPlay?: boolean;
}

export const VideoWithQuestionsPlayer = memo<VideoWithQuestionsPlayerProps>(({
  metadata,
  onClose,
  showControls = true,
  autoPlay = false,
}) => {
  const {
    player,
    currentQuestion,
    playbackState,
    isReady,
    togglePlayPause,
    seekTo,
  } = useVideoWithQuestions(metadata);

  // Auto-play när videon är redo
  React.useEffect(() => {
    if (isReady && autoPlay) {
      player.play();
    }
  }, [isReady, autoPlay, player]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (event: any) => {
    const seekPosition = (event.nativeEvent.locationX / screenWidth) * playbackState.duration;
    seekTo(seekPosition);
  };

  return (
    <View style={styles.container}>
      {/* Video */}
      <View style={styles.videoContainer}>
        <VideoView
          style={styles.video}
          player={player}
          nativeControls={false}
          contentFit="cover"
        />
        
        {/* Loading */}
        {!isReady && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {/* Question Display */}
        <QuestionDisplay
          question={currentQuestion?.text || ''}
          questionIndex={playbackState.questionIndex}
          totalQuestions={metadata.questions.length}
          isVisible={currentQuestion !== null}
        />

        {/* Controls Overlay */}
        {showControls && isReady && (
          <View style={styles.controlsOverlay}>
            {/* Play/Pause Button */}
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={togglePlayPause}
            >
              <Ionicons
                name={playbackState.isPlaying ? 'pause' : 'play'}
                size={50}
                color="#fff"
              />
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>
                {formatTime(playbackState.currentTime)}
              </Text>
              
              <TouchableOpacity 
                style={styles.progressBar}
                onPress={handleSeek}
              >
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(playbackState.currentTime / playbackState.duration) * 100}%`,
                      },
                    ]}
                  />
                </View>
                
                {/* Question markers */}
                {metadata.questions.map((q, index) => (
                  <View
                    key={q.id}
                    style={[
                      styles.questionMarker,
                      {
                        left: `${(q.startTime / playbackState.duration) * 100}%`,
                      },
                    ]}
                  />
                ))}
              </TouchableOpacity>
              
              <Text style={styles.timeText}>
                {formatTime(playbackState.duration)}
              </Text>
            </View>
          </View>
        )}

        {/* Close Button */}
        {onClose && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

VideoWithQuestionsPlayer.displayName = 'VideoWithQuestionsPlayer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: screenWidth,
    height: screenHeight,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  questionMarker: {
    position: 'absolute',
    top: '50%',
    width: 2,
    height: 8,
    backgroundColor: '#4CAF50',
    marginTop: -4,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    minWidth: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});