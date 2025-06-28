// types/videoMetadata.types.ts

export interface QuestionTiming {
  id: string;
  text: string;
  startTime: number;  // Sekunder från start
  endTime: number;    // Sekunder från start
  order: number;      // Ordning i sekvensen
}

export interface VideoMetadata {
  id: string;
  uri: string;
  duration: number;
  recordedAt: number;
  questions: QuestionTiming[];
  thumbnail?: string;
  
  // Ytterligare metadata
  deviceInfo?: {
    platform: string;
    model: string;
    osVersion: string;
    brand?: string;
    deviceType?: string;
  };
}

export interface VideoWithMetadata {
  video: VideoMetadata;
  user?: {
    id: string;
    name: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface VideoRecordingSession {
  startTime: number;
  questions: Array<{
    text: string;
    shownAt: number;  // Timestamp när frågan visades
  }>;
}

// För video playback
export interface VideoPlaybackState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  currentQuestion: QuestionTiming | null;
  questionIndex: number;
}