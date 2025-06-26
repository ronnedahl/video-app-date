import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { DatingProfile, SwipeAction } from '../types/dating';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fadeAnim = new Animated.Value(0);
  
  // VIKTIGT: Använd faktisk video URL, inte test URL
  const videoUrl = profile.videoURL || '';
  
  console.log('VideoCard: Loading video from:', videoUrl);
  
  // Skapa video player med bättre felhantering
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = false;
    player.volume = 0.5;
    // Vänta med att spela tills videon är redo
    player.pause();
  });

  // Lyssna på video status
  useEffect(() => {
    const statusSubscription = player.addListener('statusChange', (event) => {
      console.log('Video status changed:', event.status);
      
      if (event.status === 'readyToPlay') {
        setIsReady(true);
        setIsLoading(false);
        setHasError(false);
        
        // Spela bara om kortet är aktivt
        if (isActive) {
          player.play();
        }
      } else if (event.status === 'error') {
        console.error('Video error:', event.error);
        setHasError(true);
        setIsLoading(false);
      }
    });

    // Lyssna på när första frame renderas
    const loadSubscription = player.addListener('sourceChange', () => {
      console.log('Video source changed');
      setIsLoading(true);
      setIsReady(false);
    });

    return () => {
      statusSubscription.remove();
      loadSubscription.remove();
    };
  }, [player, isActive]);

  // Hantera aktiv/inaktiv status
  useEffect(() => {
    if (isReady) {
      if (isActive) {
        player.play();
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        player.pause();
      }
    }
  }, [isActive, isReady, player, fadeAnim]);

  // Cleanup
  useEffect(() => {
    return () => {
      player.release();
    };
  }, [player]);

  const formatInfo = () => {
    const parts = [];
    if (profile.name) parts.push(profile.name);
    if (profile.age) parts.push(`${profile.age}`);
    return parts.join(', ');
  };

  const formatDetails = () => {
    const parts = [];
    if (profile.occupation) parts.push(profile.occupation);
    if (profile.interests) parts.push(profile.interests);
    return parts.join(' & ');
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        }
      ]}
    >
      {/* Video Background */}
      {!hasError && (
        <VideoView
          style={[
            styles.video,
            // Dölj videon tills den är redo att spelas
            !isReady && styles.hiddenVideo
          ]}
          player={player}
          nativeControls={false}
          contentFit="cover"
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={50} color="#fff" />
          <Text style={styles.errorText}>Kunde inte ladda videon</Text>
        </View>
      )}
 
      {/* Loading Indicator - visa medan videon inte är redo */}
      {(isLoading || !isReady) && !hasError && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Laddar video...</Text>
        </View>
      )}

      {/* Gradient Alternative */}
      <View style={styles.gradientAlternative} />

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{formatInfo()}</Text>
        <Text style={styles.detailsText}>{formatDetails()}</Text>
        {profile.location && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#fff" />
            <Text style={styles.locationText}>{profile.location}</Text>
          </View>
        )}
      </View>

      {/* Volume Control - visa bara om videon är redo */}
      {isReady && (
        <TouchableOpacity 
          style={styles.volumeButton}
          onPress={() => {
            player.muted = !player.muted;
          }}
        >
          <Ionicons 
            name={player.muted ? "volume-mute" : "volume-high"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      )}

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={() => onSwipe('dislike')}
        >
          <Ionicons name="close" size={35} color="#FF4458" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superlikeButton]}
          onPress={() => onSwipe('superlike')}
        >
          <Ionicons name="star" size={30} color="#44D884" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => onSwipe('like')}
        >
          <Ionicons name="heart" size={35} color="#1EC71E" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.boostButton]}
          onPress={() => onSwipe('boost')}
        >
          <Ionicons name="flash" size={30} color="#9C39FF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  hiddenVideo: {
    opacity: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 3,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 3,
  },
  errorText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  gradientAlternative: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: screenHeight * 0.4,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -50,
    },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 10,
    zIndex: 2, 
  },
  infoContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
    zIndex: 3, 
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  detailsText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  volumeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 3,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dislikeButton: {
    backgroundColor: '#fff',
  },
  superlikeButton: {
    backgroundColor: '#fff',
  },
  likeButton: {
    backgroundColor: '#fff',
  },
  boostButton: {
    backgroundColor: '#fff',
  },
});