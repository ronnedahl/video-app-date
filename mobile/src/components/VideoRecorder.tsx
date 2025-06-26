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

const { width: screenWidth } = Dimensions.get('window');

interface VideoRecorderProps {
  onVideoRecorded: (uri: string, questions: string[]) => void;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ onVideoRecorded }) => {
  const [facing, setFacing] = useState<CameraType>('front');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);
  
  // Använd useRef för att undvika re-renders
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
    nextQuestion,
    resetQuestions,
    startAutoAdvance
  } = useQuestions();

  // Hantera media library permissions
  useEffect(() => {
    (async () => {
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);

  // Samla upp frågor som visas
  useEffect(() => {
    if (isRecording && currentQuestion) {
      if (!shownQuestionsRef.current.includes(currentQuestion)) {
        shownQuestionsRef.current = [...shownQuestionsRef.current, currentQuestion];
      }
    }
  }, [isRecording, currentQuestion]);

  // Hantera när video är klar - FIXAD VERSION
  // useEffect(() => {
  //   if (recordedVideo) {
  //     // Kopiera frågorna innan vi skickar dem
  //     const questionsToSend = [...shownQuestionsRef.current];
      
  //     // Skicka både video URI och frågorna
  //     onVideoRecorded(recordedVideo, questionsToSend);
      
  //     // Reset för nästa inspelning
  //     shownQuestionsRef.current = [];
  //     resetQuestions();
  //   }
  // }, [recordedVideo, onVideoRecorded, resetQuestions]); // Ta bort shownQuestions från dependencies

  // Starta automatisk växling av frågor när inspelning börjar
  useEffect(() => {
    if (isRecording) {
      const interval = startAutoAdvance();
      return () => clearInterval(interval);
    }
  }, [isRecording, startAutoAdvance]);

  const requestAllPermissions = async () => {
    await requestCameraPermission();
    await requestMicrophonePermission();
  };

  useEffect(() => {
  (window as any).onVideoRecordingComplete = (uri: string) => {
    const questions = shownQuestionsRef.current;
    onVideoRecorded(uri, questions);
    shownQuestionsRef.current = [];
  };
  
  return () => {
    (window as any).onVideoRecordingComplete = undefined;
  };
}, [onVideoRecorded]);

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

  const handleStartRecording = () => {
    // Reset frågor innan ny inspelning
    shownQuestionsRef.current = [];
    startRecording();
  };

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
        
        {/* Frågedisplay */}
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
      </View>

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
});