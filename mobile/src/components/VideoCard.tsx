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

 

  
  const testUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
   console.log('FÖRSÖKER LADDA TEST-VIDEO:', testUrl);
  
   
  
  console.log('--- STEG 3: VideoCard mottog URL ---');
  console.log('URL som skickas till useVideoPlayer:', profile.videoURL);
  console.log('Är kortet aktivt?', isActive);
  
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);
  
  // Skapa video player
  const player = useVideoPlayer(testUrl, (player) => {
    player.loop = true;
    player.muted = false;
    player.volume = 0.5;
    if (isActive) {
      player.play();
    }
  });

  useEffect(() => {
    // Pausa/spela baserat på om kortet är aktivt
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
          opacity: fadeAnim,
        }
      ]}
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

      {/* Gradient Alternative - Using View with opacity */}
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
  ...StyleSheet.absoluteFillObject, // Denna rad ersätter top/left/right/bottom/position
  zIndex: 1, // Behåll zIndex
  backgroundColor: 'red',
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
    zIndex:3,
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
    // Lägg till bakgrund för bättre läsbarhet
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