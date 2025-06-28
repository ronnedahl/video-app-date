// components/VideoRecorder.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Button,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { useQuestions } from '../hooks/useQuestions';
import { QuestionDisplay } from './QuestionDisplay';
import { VideoMetadataService } from '../services/VideoMetadataService';
import { VideoMetadata } from '../types/videoMetadata.types';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface VideoRecorderProps {
  onVideoRecorded: (metadata: VideoMetadata) => void;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ onVideoRecorded }) => {
  const [facing, setFacing] = useState<CameraType>('front');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);
  
  // Recording session tracking
  const recordingStartTimeRef = useRef<number>(0);
  const shownQuestionsRef = useRef<string[]>([]);
  
  const {
    cameraRef,
    isRecording,
    countdown,
    recordedVideo,
    startRecording,
    stopRecording,
  } = useVideoRecorder();

  const {
    currentQuestion,
    questionIndex,
    totalQuestions,
    resetQuestions,
    startAutoAdvance
  } = useQuestions();

  // Media library permissions
  useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);

  // Track shown questions
  useEffect(() => {
    if (isRecording && currentQuestion && !shownQuestionsRef.current.includes(currentQuestion)) {
      shownQuestionsRef.current.push(currentQuestion);
    }
  }, [isRecording, currentQuestion]);

  // Handle video completion
  useEffect(() => {
    if (recordedVideo) {
      handleVideoComplete(recordedVideo);
    }
  }, [recordedVideo]);

  // Start auto-advance when recording starts
  useEffect(() => {
    if (isRecording) {
      const interval = startAutoAdvance();
      return () => clearInterval(interval);
    }
  }, [isRecording, startAutoAdvance]);

  const handleVideoComplete = async (videoUri: string) => {
    try {
      // Create metadata
      const metadata = await VideoMetadataService.createVideoMetadata(
        videoUri,
        20, // Duration in seconds (you can get this from the actual video)
        shownQuestionsRef.current,
        recordingStartTimeRef.current
      );

      // Save metadata locally
      await VideoMetadataService.saveMetadata(metadata);

      // Notify parent component
      onVideoRecorded(metadata);

      // Reset for next recording
      shownQuestionsRef.current = [];
      resetQuestions();
    } catch (error) {
      console.error('Failed to create video metadata:', error);
    }
  };

  const requestAllPermissions = async () => {
    await requestCameraPermission();
    await requestMicrophonePermission();
  };

  const handleStartRecording = () => {
    // Reset and track session
    shownQuestionsRef.current = [];
    recordingStartTimeRef.current = Date.now();
    startRecording();
  };

  const toggleCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Permission screens
  if (!cameraPermission || !microphonePermission || mediaLibraryPermission === null) {
    return <View style={styles.container}><Text style={styles.message}>Laddar...</Text></View>;
  }

  if (!cameraPermission.granted || !microphonePermission.granted || !mediaLibraryPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Vi behöver tillgång till kamera, mikrofon och mediabibliotek</Text>
        {!cameraPermission.granted && (
          <Text style={styles.permissionText}>❌ Kamera: Ej tillåten</Text>
        )}
        {!microphonePermission.granted && (
          <Text style={styles.permissionText}>❌ Mikrofon: Ej tillåten</Text>
        )}
        {!mediaLibraryPermission && (
          <Text style={styles.permissionText}>❌ Mediabibliotek: Ej tillåten</Text>
        )}
        <Button onPress={requestAllPermissions} title="Ge tillstånd" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode="video"
          videoQuality="720p"
        />
        
        {/* Question Display */}
        <QuestionDisplay
          question={currentQuestion}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          isVisible={isRecording}
        />
        
        {/* Countdown overlay */}
        {isRecording && (
          <View style={styles.overlayContainer}>
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{countdown}s</Text>
            </View>
          </View>
        )}

        {/* Camera toggle */}
        {!isRecording && (
          <TouchableOpacity
            style={styles.cameraToggle}
            onPress={toggleCamera}
          >
            <Ionicons name="camera-reverse" size={30} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Recording controls */}
      <View style={styles.controls}>
        {!isRecording ? (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleStartRecording}
          >
            <View style={styles.recordButtonInner} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={stopRecording}
          >
            <View style={styles.stopButtonInner} />
          </TouchableOpacity>
        )}
      </View>

      {/* Info text */}
      {!isRecording && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Svara på {totalQuestions} frågor • 20 sekunder
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
    color: '#fff',
  },
  permissionText: {
    textAlign: 'center',
    paddingBottom: 5,
    fontSize: 14,
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
    width: screenWidth,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  countdownContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  countdownText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cameraToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f00',
  },
  stopButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonInner: {
    width: 40,
    height: 40,
    backgroundColor: '#f00',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
});