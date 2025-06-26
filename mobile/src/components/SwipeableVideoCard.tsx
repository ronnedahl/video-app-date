import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Animated,
  PanResponder,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
// import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DatingProfile, SwipeAction } from '../types/dating';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const SWIPE_OUT_DURATION = 250;

interface SwipeableVideoCardProps {
  profile: DatingProfile;
  onSwipe: (action: SwipeAction) => void;
  isActive: boolean;
}

export const SwipeableVideoCard: React.FC<SwipeableVideoCardProps> = ({
  profile,
  onSwipe,
  isActive,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const position = useRef(new Animated.ValueXY()).current;
  const [currentAction, setCurrentAction] = useState<SwipeAction | null>(null);
  
  // Skapa video player
  const player = useVideoPlayer(profile.videoURL || '', (player) => {
    player.loop = true;
    player.muted = false;
    player.volume = 0.5;
    if (isActive) {
      player.play();
    }
  });

  // Rotation baserat på X position
  const rotate = position.x.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  // Opacity för like/nope labels
  const likeOpacity = position.x.interpolate({
    inputRange: [-screenWidth / 4, 0, screenWidth / 4],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-screenWidth / 4, 0, screenWidth / 4],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  // Pan responder för swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
        
        // Update current action based on position
        if (gestureState.dx > SWIPE_THRESHOLD) {
          setCurrentAction('like');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          setCurrentAction('dislike');
        } else if (gestureState.dy < -SWIPE_THRESHOLD) {
          setCurrentAction('superlike');
        } else {
          setCurrentAction(null);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else if (gestureState.dy < -SWIPE_THRESHOLD) {
          forceSwipe('up');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'right' | 'left' | 'up') => {
    const x = direction === 'right' ? screenWidth : direction === 'left' ? -screenWidth : 0;
    const y = direction === 'up' ? -screenHeight : 0;
    
    Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left' | 'up') => {
    const action = direction === 'right' ? 'like' : 
                  direction === 'left' ? 'dislike' : 
                  'superlike';
    onSwipe(action);
    position.setValue({ x: 0, y: 0 });
    setCurrentAction(null);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    setCurrentAction(null);
  };

  useEffect(() => {
    // Pausa/spela baserat på om kortet är aktivt
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  // Cleanup
  useEffect(() => {
    return () => {
      player.release();
    };
  }, [player]);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

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
          transform: [{ rotate }, ...position.getTranslateTransform()],
        }
      ]}
      {...panResponder.panHandlers}
    >
      {/* Video Background */}
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={false}
        contentFit="cover"
        onFirstFrameRender={handleVideoLoad}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Like/Nope Labels */}
      <Animated.View
        style={[
          styles.likeLabel,
          {
            opacity: likeOpacity,
          },
        ]}
      >
        <Text style={styles.likeText}>LIKE</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.nopeLabel,
          {
            opacity: nopeOpacity,
          },
        ]}
      >
        <Text style={styles.nopeText}>NOPE</Text>
      </Animated.View>

      {/* Gradient Overlay */}
      

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

      {/* Volume Control */}
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

      {/* Action Buttons - fortfarande tillgängliga */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={() => forceSwipe('left')}
        >
          <Ionicons name="close" size={35} color="#FF4458" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superlikeButton]}
          onPress={() => forceSwipe('up')}
        >
          <Ionicons name="star" size={30} color="#44D884" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => forceSwipe('right')}
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
    position: 'absolute',
    width: screenWidth - 20,
    height: screenHeight - 150,
    alignSelf: 'center',
    top: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 1000,
    transform: [{ rotate: '-30deg' }],
  },
  likeText: {
    borderWidth: 4,
    borderColor: '#1EC71E',
    color: '#1EC71E',
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
    borderRadius: 10,
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 1000,
    transform: [{ rotate: '30deg' }],
  },
  nopeText: {
    borderWidth: 4,
    borderColor: '#FF4458',
    color: '#FF4458',
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
    borderRadius: 10,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
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
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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