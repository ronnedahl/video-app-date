import { useState, useRef, useCallback } from 'react';
import { CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { VIDEO_DURATION_SECONDS } from '../config/constants';


export const useVideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(VIDEO_DURATION_SECONDS);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  
 const startRecording = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      setCountdown(VIDEO_DURATION_SECONDS);
       
       
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Record video
      const video = await cameraRef.current.recordAsync({
        maxDuration: VIDEO_DURATION_SECONDS,
        
      });
      
      if (video) {
        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(video.uri);
        console.log('Video saved:', asset.uri);
        
        setRecordedVideo(video.uri);
        
         if ((window as any).onVideoRecordingComplete) {
    (window as any).onVideoRecordingComplete(video.uri);
  }
}
      
      setIsRecording(false);
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setRecordedVideo(null);
    setCountdown(VIDEO_DURATION_SECONDS);
  }, []);

  return {
    cameraRef,
    isRecording,
    countdown,
    recordedVideo,
    startRecording,
    stopRecording,
    resetRecording,
  };
};