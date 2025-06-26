import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlaybackState } from '../types/video';

interface VideoControlsProps {
  playbackState: VideoPlaybackState;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  playbackState,
  onPlayPause,
  onSeek,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatTime(playbackState.currentTime)} / {formatTime(playbackState.duration)}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.playButton}
        onPress={onPlayPause}
      >
        <Ionicons
          name={playbackState.isPlaying ? 'pause' : 'play'}
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  timeContainer: {
    marginBottom: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 10,
  },
});