import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDatingStore } from '../stores/datingStore';
import { VideoCard } from '../components/VideoCard';
import { SwipeAction } from '../types/dating';

interface DatingScreenProps {
  onBack?: () => void;
}

export const DatingScreen: React.FC<DatingScreenProps> = ({ onBack }) => {
  const { 
    profiles, 
    currentProfileIndex,
    isLoading, 
    error, 
    loadProfiles, 
    swipe,
    getCurrentProfile,
    reset
  } = useDatingStore();

  const [showMatch, setShowMatch] = useState(false);
  const currentProfile = getCurrentProfile();

  useEffect(() => {
    loadProfiles();
    
    return () => {
      reset();
    };
  }, []);

  if (currentProfile) {
    console.log('--- STEG 2: Current Profile i DatingScreen ---');
    console.log('Profilnamn:', currentProfile.name);
    console.log('Video URL:', currentProfile.videoURL);
  }

  const handleSwipe = async (action: SwipeAction) => {
    try {
      await swipe(action);
      
      // Visa match-animation om det är like/superlike
      if (action === 'like' || action === 'superlike') {
        // Här kan du lägga till match-check logic
        // För nu visar vi bara en kort animation
        if (Math.random() > 0.7) { // 30% chans för match (för demo)
          setShowMatch(true);
          setTimeout(() => setShowMatch(false), 2000);
        }
      }
    } catch (error) {
      Alert.alert('Fel', 'Kunde inte registrera swipe');
    }
  };

  const handleRefresh = () => {
    loadProfiles();
  };

  if (isLoading && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF4458" />
        <Text style={styles.loadingText}>Laddar profiler...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={60} color="#FF4458" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Försök igen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentProfile || currentProfileIndex >= profiles.length) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="heart-dislike" size={60} color="#999" />
        <Text style={styles.noProfilesText}>Inga fler profiler just nu</Text>
        <Text style={styles.noProfilesSubtext}>Kom tillbaka senare för att se fler</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color="#fff" />
          <Text style={styles.refreshText}>Uppdatera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>VideoDate</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Video Card */}
      <View style={styles.cardContainer}>
        <VideoCard
          profile={currentProfile}
          onSwipe={handleSwipe}
          isActive={true}
        />
      </View>

      {/* Match Overlay */}
      {showMatch && (
        <View style={styles.matchOverlay}>
          <Text style={styles.matchText}>It's a Match! 🎉</Text>
          <Text style={styles.matchSubtext}>Du och {currentProfile.name} gillar varandra</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4458',
  },
  filterButton: {
    padding: 5,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: '#FF4458',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#FF4458',
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noProfilesText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  noProfilesSubtext: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  refreshButton: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#FF4458',
    borderRadius: 25,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  matchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 68, 88, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  matchSubtext: {
    fontSize: 18,
    color: '#fff',
  },
});