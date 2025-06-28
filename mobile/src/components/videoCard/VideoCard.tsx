import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { VideoView } from 'expo-video';
import { DatingProfile, SwipeAction } from '../../types/dating';

// Custom hooks
import { useDatingVideo } from '../../hooks/useDatingVideo';

// Components
import { VideoLoadingState } from './VideoLoadingState';
import { VideoErrorState } from './VideoErrorState';
import { ProfileInfo } from './ProfileInfo';
import { ActionButtons } from './ActionButtons';
import { VolumeControl } from './VolumeControl';

// Constants & Utils
import { VIDEO_CONSTANTS } from '../../constants/videoCardConstants';
import { logVideoDebug, sanitizeProfile } from '../../utils/videoCardUtils';

const { COLORS, Z_INDEX, SIZES, FADE_DURATION, GRADIENT_HEIGHT } = VIDEO_CONSTANTS;

interface VideoCardProps {
  profile: DatingProfile;
  onSwipe: (action: SwipeAction) => void;
  isActive: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  profile,
  onSwipe,
  isActive,
}) => {
  const fadeAnim = new Animated.Value(0);
  const sanitizedProfile = sanitizeProfile(profile);
  const videoUrl = sanitizedProfile.videoURL || '';
  
  logVideoDebug('Loading video from:', videoUrl);
  
  // Använd custom hook för video logik
  const { player, isLoading, isReady, hasError, error } = useDatingVideo(videoUrl, isActive);

  // Hantera fade animation
  useEffect(() => {
    if (isReady && isActive) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [isReady, isActive, fadeAnim]);

  // Hantera volymkontroll
  const handleVolumeToggle = () => {
    player.muted = !player.muted;
    logVideoDebug('Volume toggled', { muted: !player.muted });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Video */}
      {!hasError && (
        <VideoView
          style={[styles.video, !isReady && styles.hiddenVideo]}
          player={player}
          nativeControls={false}
          contentFit="cover"
        />
      )}
      
      {/* States */}
      {hasError && <VideoErrorState error={error} />}
      {(isLoading || !isReady) && !hasError && <VideoLoadingState />}

      {/* Gradient overlay */}
      <View style={styles.gradientOverlay} />

      {/* UI Components */}
      <ProfileInfo profile={sanitizedProfile} />
      {isReady && <VolumeControl isMuted={player.muted} onToggle={handleVolumeToggle} />}
      <ActionButtons onSwipe={onSwipe} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: Z_INDEX.VIDEO,
  },
  hiddenVideo: {
    opacity: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: GRADIENT_HEIGHT,
    backgroundColor: 'transparent',
    shadowColor: COLORS.BACKGROUND,
    shadowOffset: {
      width: 0,
      height: -50,
    },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 10,
    zIndex: Z_INDEX.GRADIENT,
  },
});