import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image'; // Använd expo-image istället
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { VideoItem } from '../types/gallery';

const { width: screenWidth } = Dimensions.get('window');
const thumbnailSize = (screenWidth - 30) / 3; // 3 kolumner med mellanrum

interface VideoThumbnailProps {
  video: VideoItem;
  onPress: (video: VideoItem) => void;
  onLongPress?: (video: VideoItem) => void;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  video,
  onPress,
  onLongPress,
}) => {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  
  // Skapa en player för thumbnail
  const player = useVideoPlayer(video.uri, (player) => {
    player.muted = true;
    player.currentTime = 0.1; // Hoppa till 100ms för att få första frame
  });

  // Generera thumbnail när komponenten mountas
  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        // Generera thumbnail vid 100ms
        const thumbnails = await player.generateThumbnailsAsync([0.1]);
        if (thumbnails.length > 0) {
          // VideoThumbnail från expo-video kan användas direkt som image source
          setThumbnailUri(thumbnails[0] as any);
        }
      } catch (error) {
        console.log('Could not generate thumbnail:', error);
      }
    };

    generateThumbnail();

    // Cleanup
    return () => {
      player.release();
    };
  }, [video.uri]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Idag';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Igår';
    } else {
      return date.toLocaleDateString('sv-SE', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(video)}
      onLongPress={() => onLongPress?.(video)}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnailContainer}>
        {thumbnailUri ? (
          <Image
            source={thumbnailUri}
            style={styles.thumbnail}
            contentFit="cover" // Använd contentFit istället för resizeMode
          />
        ) : (
          // Fallback: visa VideoView pausad som thumbnail
          <VideoView
            style={styles.thumbnail}
            player={player}
            nativeControls={false}
            contentFit="cover"
          />
        )}
        
        {/* Play icon overlay */}
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.8)" />
        </View>

        {/* Duration badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            {formatDuration(video.duration)}
          </Text>
        </View>
      </View>

      {/* Video info */}
      <Text style={styles.dateText}>{formatDate(video.createdAt)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: thumbnailSize,
    marginBottom: 15,
  },
  thumbnailContainer: {
    width: thumbnailSize,
    height: thumbnailSize,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  dateText: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});