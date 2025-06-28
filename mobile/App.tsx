
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { VideoRecorder } from './src/components/VideoRecorder';
import { UploadProgress } from './src/components/UploadProgress';
import { VideoPlayer } from './src/components/VideoPlayer';
import { VideoComplete } from './src/components/VideoComplete';
import { DownloadProgress } from './src/components/DownloadProgress';
import { LoginScreen } from './src/components/auth/LoginScreen';
import { ApiService } from './src/services/api';
import { useVideoDownload } from './src/hooks/useVideoDownload';
import { useAuthStore } from './src/stores/authStore';
import { VideoGallery } from './src/components/VideoGallery';
import { VideoItem } from './src/types/gallery';
import { CreateProfileScreen } from './src/components/CreateProfile/CreateProfileScreen';
import { DatingScreen } from './src/components/DatingScreen';
import { ProfileViewScreen } from './src/components/ProfileViewScreen';
import { BottomNavigation } from './src/components/BottomNavigation';
import { useProfileStore } from './src/stores/profileStore';

type AppScreen = 'login' | 'recorder' | 'upload' | 'complete' | 'preview' | 
                 'gallery' | 'createProfile' | 'dating' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null);
  const [recordedQuestions, setRecordedQuestions] = useState<string[]>([]);

  const {
    isDownloading,
    downloadProgress,
    downloadedVideoUri,
    playableVideoUri,
    downloadVideo,
    reset: resetDownload
  } = useVideoDownload();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { setSelectedVideo } = useProfileStore();

  // Kontrollera om användaren är inloggad vid start
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('recorder');
    }
  }, [isAuthenticated]);

  const handleVideoRecorded = useCallback(async (metadata: any) => {
  try {
    // Extrahera uri och questions från metadata
    const uri = metadata.uri;
    const questions = metadata.questions.map((q: any) => q.text);
    
    // Din befintliga kod
    setRecordedVideoUri(uri);
    setRecordedQuestions(questions);
    Alert.alert('Video inspelad', 'Laddar upp video...');
    const result = await ApiService.uploadVideo(uri);
    setVideoId(result.videoId);
    setCurrentScreen('upload');
  } catch (error) {
    Alert.alert('Fel', 'Kunde inte ladda upp video');
    console.error('Upload error:', error);
  }
}, []);
  const handleUploadComplete = () => {
    Alert.alert('Klart!', 'Video har komprimerats och sparats på servern');
    setCurrentScreen('complete');
  };

  const handleReset = () => {
    setVideoId(null);
    setRecordedVideoUri(null);
    setRecordedQuestions([]);
    setCurrentScreen('recorder');
    resetDownload();
  };

  const handlePreviewVideo = () => {
    if (playableVideoUri) {
      setRecordedVideoUri(playableVideoUri);
      setCurrentScreen('preview');
    } else if (recordedVideoUri) {
      setCurrentScreen('preview');
    } else {
      Alert.alert('Fel', 'Ingen video att visa');
    }
  };

  const handleClosePreview = () => {
    // Om vi kom från galleriet, gå tillbaka dit
    // Annars gå till complete-skärmen
    if (recordedQuestions.length === 0) {
      setCurrentScreen('gallery');
    } else {
      setCurrentScreen('complete');
    }
  };

  const handleSelectVideoFromGallery = (video: VideoItem) => {
    setRecordedVideoUri(video.uri);
    setRecordedQuestions([]); // Inga frågor för gamla videor
    setSelectedVideo(video.uri); // Spara vald video för profilskapande
    setCurrentScreen('preview');
  };

  const handleShowGallery = () => {
    setCurrentScreen('gallery');
  };

  const handleCreateProfile = () => {
    if (recordedVideoUri) {
      setCurrentScreen('createProfile');
    } else {
      Alert.alert('Fel', 'Ingen video vald');
    }
  };

  const handleProfileCreated = () => {
    Alert.alert('Profil skapad!', 'Din profil har sparats', [
      {
        text: 'OK',
        onPress: () => {
          handleReset();
          setCurrentScreen('recorder');
        }
      }
    ]);
  };

  const handleCancelProfile = () => {
    // Gå tillbaka till galleriet eller complete beroende på var vi kom från
    if (recordedQuestions.length === 0) {
      setCurrentScreen('gallery');
    } else {
      setCurrentScreen('complete');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentScreen('login');
      handleReset(); // Reset all video data
    } catch (error) {
      Alert.alert('Fel', 'Kunde inte logga ut');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('recorder');
  };

  // Navigation för bottom tabs
  const handleTabPress = (tab: 'recorder' | 'gallery' | 'dating' | 'profile') => {
    switch (tab) {
      case 'recorder':
        handleReset();
        setCurrentScreen('recorder');
        break;
      case 'gallery':
        setCurrentScreen('gallery');
        break;
      case 'dating':
        setCurrentScreen('dating');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  // Visa login screen om ej inloggad
  if (currentScreen === 'login') {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Bestäm om bottom navigation ska visas
  const showBottomNav = ['recorder', 'gallery', 'dating', 'profile'].includes(currentScreen);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header med användarinfo och logout - endast för recorder */}
      {currentScreen === 'recorder' && (
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={24} color="#fff" />
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutText}>Logga ut</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Video Recorder */}
      {currentScreen === 'recorder' && (
        <VideoRecorder onVideoRecorded={handleVideoRecorded} />
      )}

      {/* Upload Progress */}
      {currentScreen === 'upload' && videoId && (
        <View style={styles.uploadContainer}>
          <UploadProgress
            videoId={videoId}
            onComplete={handleUploadComplete}
            onError={(error) => {
              Alert.alert('Fel', error);
              handleReset();
            }}
          />
        </View>
      )}

      {/* Video Complete */}
      {currentScreen === 'complete' && (
        <View style={styles.completeContainer}>
          <VideoComplete
            onPreview={handlePreviewVideo}
            onDownload={() => downloadVideo(videoId!)}
            onNewRecording={handleReset}
            onShowGallery={handleShowGallery}
            hasDownloaded={!!downloadedVideoUri}
          />

          {isDownloading && (
            <View style={styles.downloadOverlay}>
              <DownloadProgress
                progress={downloadProgress}
                isDownloading={isDownloading}
              />
            </View>
          )}
        </View>
      )}

      {/* Video Player */}
      {currentScreen === 'preview' && recordedVideoUri && (
        <VideoPlayer
          videoUri={recordedVideoUri}
          questions={recordedQuestions}
          onClose={handleClosePreview}
          onNewRecording={handleReset}
          onCreateProfile={handleCreateProfile}
          showModalOnComplete={true}
        />
      )}

      {/* Video Gallery */}
      {currentScreen === 'gallery' && (
        <VideoGallery
          onSelectVideo={handleSelectVideoFromGallery}
          onBack={() => {
            // Om vi har en pågående video, gå till complete, annars till recorder
            if (videoId) {
              setCurrentScreen('complete');
            } else {
              setCurrentScreen('recorder');
            }
          }}
        />
      )}

      {/* Create Profile */}
      {currentScreen === 'createProfile' && recordedVideoUri && (
        <CreateProfileScreen
          videoUri={recordedVideoUri}
          onSuccess={handleProfileCreated}
          onCancel={handleCancelProfile}
        />
      )}

      {/* Dating Screen */}
      {currentScreen === 'dating' && (
        <DatingScreen />
      )}

      {/* Profile View */}
      {currentScreen === 'profile' && (
        <ProfileViewScreen
          onEdit={() => {
            // Navigera till create/edit profile
            if (recordedVideoUri) {
              setCurrentScreen('createProfile');
            } else {
              Alert.alert('Info', 'Du behöver välja en video från galleriet först');
              setCurrentScreen('gallery');
            }
          }}
        />
      )}

      {/* Bottom Navigation */}
      {showBottomNav && isAuthenticated && (
        <BottomNavigation
          activeTab={currentScreen as any}
          onTabPress={handleTabPress}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  userEmail: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  completeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  downloadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});