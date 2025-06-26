import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGalleryStore } from '../stores/galleryStore';
import { VideoThumbnail } from './VideoThumbnail';
import { VideoItem } from '../types/gallery';

interface VideoGalleryProps {
  onSelectVideo: (video: VideoItem) => void;
  onBack: () => void;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  onSelectVideo,
  onBack,
}) => {
  const { videos, isLoading, error, loadVideos, deleteVideo, refreshGallery } = useGalleryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshGallery();
    setRefreshing(false);
  };

  const handleLongPress = (video: VideoItem) => {
    Alert.alert(
      'Ta bort video?',
      'Vill du ta bort denna video från galleriet?',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: async () => {
            setSelectedForDelete(video.id);
            const success = await deleteVideo(video.id);
            if (!success) {
              Alert.alert('Fel', 'Kunde inte ta bort videon');
            }
            setSelectedForDelete(null);
          },
        },
      ]
    );
  };

  const renderVideo = ({ item }: { item: VideoItem }) => (
    <VideoThumbnail
      video={item}
      onPress={onSelectVideo}
      onLongPress={handleLongPress}
    />
  );

  if (isLoading && videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Laddar videor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mina videor</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Video list */}
      {videos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="videocam-off" size={60} color="#666" />
          <Text style={styles.emptyText}>Inga videor ännu</Text>
          <Text style={styles.emptySubtext}>
            Spela in din första video för att se den här
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#4CAF50"
            />
          }
          ListHeaderComponent={
            <Text style={styles.videoCount}>
              {videos.length} {videos.length === 1 ? 'video' : 'videor'}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 34, // Same as back button for centering
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: 15,
    margin: 15,
    borderRadius: 8,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  videoCount: {
    color: '#999',
    fontSize: 14,
    marginBottom: 15,
    marginLeft: 5,
  },
});