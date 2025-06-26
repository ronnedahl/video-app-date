import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { VideoMetadata } from '../types/video';
import { useVideoPlayback } from '../hooks/useVideoPlayback';
import { VideoControls } from './VideoControls';
import { QuestionOverlay } from './QuestionOverlay';
import { VideoCompleteModal } from './VideoCompleteModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoPlayerProps {
  videoUri: string;
  questions: string[];
  onClose?: () => void;
  onNewRecording?: () => void;
  onCreateProfile?: () => void;
  showModalOnComplete?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUri,
  questions,
  onClose,
  onNewRecording,
  onCreateProfile,
  showModalOnComplete = false,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  
  // Validera video URI
  if (!videoUri) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color="#fff" />
        <Text style={styles.errorText}>Ingen video att visa</Text>
        {onClose && (
          <TouchableOpacity style={styles.errorButton} onPress={onClose}>
            <Text style={styles.errorButtonText}>Stäng</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  
  const metadata: VideoMetadata = {
    uri: videoUri,
    duration: 20,
    questions,
    questionTimings: questions.map((_, index) => index * 3.333),
  };

  const {
    player,
    playbackState,
    currentQuestion,
    togglePlayPause,
    seekTo,
    isReady,
    hasError,
  } = useVideoPlayback(metadata);

  // Sätt loop baserat på om vi ska visa modal
  useEffect(() => {
    if (isReady) {
      player.loop = !showModalOnComplete;
    }
  }, [player, showModalOnComplete, isReady]);

  // Lyssna på när videon når slutet
  useEffect(() => {
    const subscription = player.addListener('playToEnd', () => {
      if (showModalOnComplete && hasPlayedOnce) {
        setShowCompleteModal(true);
        setVideoEnded(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player, showModalOnComplete, hasPlayedOnce]);

  // Markera att videon har spelats
  useEffect(() => {
    if (playbackState.currentTime > 0 && !hasPlayedOnce) {
      setHasPlayedOnce(true);
    }
  }, [playbackState.currentTime, hasPlayedOnce]);

  const handleVideoPress = () => {
    if (isReady) {
      setShowControls(!showControls);
    }
  };

  // Modal handlers
  const handleModalClose = () => {
    setShowCompleteModal(false);
    if (videoEnded) {
      player.replay();
      setVideoEnded(false);
    }
  };

  const handleNewRecording = () => {
    setShowCompleteModal(false);
    onNewRecording?.();
  };

  const handleCreateProfile = () => {
    setShowCompleteModal(false);
    onCreateProfile?.();
  };

  // Visa fel om videon inte kan laddas
  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color="#fff" />
        <Text style={styles.errorText}>Kunde inte ladda videon</Text>
        <Text style={styles.errorSubtext}>Kontrollera din internetanslutning</Text>
        {onClose && (
          <TouchableOpacity style={styles.errorButton} onPress={onClose}>
            <Text style={styles.errorButtonText}>Stäng</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={handleVideoPress}
      >
        {/* Video - dölj tills den är redo */}
        <VideoView 
          style={[
            styles.video,
            !isReady && styles.hiddenVideo
          ]}
          player={player}
          nativeControls={false}
          contentFit="contain"
        />
        
        {/* Loading indicator */}
        {!isReady && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Laddar video...</Text>
          </View>
        )}
        
        {/* Visa bara UI element när videon är redo */}
        {isReady && (
          <>
            {/* Frågevisning */}
            <QuestionOverlay
              question={currentQuestion}
              questionIndex={playbackState.currentQuestionIndex}
              totalQuestions={questions.length}
              isVisible={true}
            />

            {/* Videokontroller */}
            {showControls && (
              <VideoControls
                playbackState={playbackState}
                onPlayPause={togglePlayPause}
                onSeek={seekTo}
              />
            )}
          </>
        )}

        {/* Stäng-knapp - visa alltid */}
        {onClose && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Video Complete Modal */}
      <VideoCompleteModal
        visible={showCompleteModal}
        onClose={handleModalClose}
        onNewRecording={handleNewRecording}
        onCreateProfile={handleCreateProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: screenWidth,
    height: screenHeight,
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
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#FF4458',
    borderRadius: 25,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
});