export interface VideoMetadata {
  uri: string;
  duration: number;
  questions: string[];
  questionTimings: number[]; // När varje fråga ska visas (i sekunder)
}

export interface VideoPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentQuestionIndex: number;
}


export interface VideoControlsProps {
  playbackState: VideoPlaybackState;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
}