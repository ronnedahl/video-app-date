import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';

const { COLORS, SIZES } = PROFILE_CONSTANTS;

interface VideoPreviewProps {
  videoUri: string;
  height?: number;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ 
  videoUri, 
  height = 200 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Skapa video player för preview
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause();
  });

  // Cleanup
  useEffect(() => {
    return () => {
      player.release();
    };
  }, [player]);

  const handlePress = () => {
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { height }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={false}
        contentFit="cover"
      />
      <View style={styles.overlay}>
        <Ionicons 
          name={isPlaying ? "pause-circle" : "play-circle"} 
          size={50} 
          color={COLORS.WHITE_TRANSPARENT} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BLACK,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BLACK_OVERLAY,
  },
});