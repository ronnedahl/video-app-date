import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { VideoView } from 'expo-video';
import { useEvent } from 'expo';
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
  } = useVideoPlayback(metadata);

  // Sätt loop baserat på om vi ska visa modal
  useEffect(() => {
    player.loop = !showModalOnComplete;
  }, [player, showModalOnComplete]);

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
    setShowControls(!showControls);
  };

  // Modal handlers
  const handleModalClose = () => {
    setShowCompleteModal(false);
    // Starta om videon om användaren stänger modalen
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={handleVideoPress}
      >
        <VideoView 
          style={styles.video}
          player={player}
          nativeControls={false}
          contentFit="contain"
        />
        
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

        {/* Stäng-knapp */}
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