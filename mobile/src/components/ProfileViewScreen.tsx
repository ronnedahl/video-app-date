import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useProfileStore } from '../stores/profileStore';
import { useAuthStore } from '../stores/authStore';

interface ProfileViewScreenProps {
  onEdit?: () => void;
  onBack?: () => void;
}

export const ProfileViewScreen: React.FC<ProfileViewScreenProps> = ({
  onEdit,
  onBack,
}) => {
  const { profile, isLoading, loadProfile } = useProfileStore();
  const { user } = useAuthStore();
  
  // Video player för profilvideon
  const player = useVideoPlayer(profile?.videoURL || '', (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    loadProfile();
    
    return () => {
      player.release();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF4458" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noProfileText}>Ingen profil hittades</Text>
        <TouchableOpacity style={styles.createButton} onPress={onEdit}>
          <Text style={styles.createButtonText}>Skapa profil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Min profil</Text>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color="#FF4458" />
          </TouchableOpacity>
        )}
      </View>

      {/* Video Section */}
      {profile.videoURL && (
        <View style={styles.videoContainer}>
          <VideoView
            style={styles.video}
            player={player}
            nativeControls={false}
            contentFit="cover"
          />
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => {
              if (player.playing) {
                player.pause();
              } else {
                player.play();
              }
            }}
          >
            <Ionicons 
              name={player.playing ? "pause" : "play"} 
              size={30} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        {/* Name and Age */}
        <View style={styles.nameSection}>
          <Text style={styles.nameText}>
            {profile.name || user?.email?.split('@')[0] || 'Anonym'}
            {profile.age && `, ${profile.age}`}
          </Text>
          {profile.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.locationText}>{profile.location}</Text>
            </View>
          )}
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          {profile.gender && (
            <View style={styles.detailItem}>
              <Ionicons name="person" size={20} color="#FF4458" />
              <Text style={styles.detailLabel}>Kön</Text>
              <Text style={styles.detailValue}>{profile.gender}</Text>
            </View>
          )}
          
          {profile.occupation && (
            <View style={styles.detailItem}>
              <Ionicons name="briefcase" size={20} color="#FF4458" />
              <Text style={styles.detailLabel}>Yrke</Text>
              <Text style={styles.detailValue}>{profile.occupation}</Text>
            </View>
          )}
        </View>

        {/* Interests */}
        {profile.interests && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intressen</Text>
            <Text style={styles.sectionContent}>{profile.interests}</Text>
          </View>
        )}

        {/* About */}
        {profile.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Om mig</Text>
            <Text style={styles.sectionContent}>{profile.about}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Visningar</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 5,
  },
  videoContainer: {
    height: 400,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
  },
  nameSection: {
    marginBottom: 20,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4458',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  noProfileText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  createButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#FF4458',
    borderRadius: 25,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});