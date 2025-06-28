// utils/videoMetadataUtils.ts

import { VideoMetadata, QuestionTiming } from '../types/videoMetadata.types';

/**
 * Hitta aktiv fråga baserat på tid
 */
export const findActiveQuestion = (
  questions: QuestionTiming[],
  currentTime: number
): QuestionTiming | null => {
  return questions.find(
    q => currentTime >= q.startTime && currentTime < q.endTime
  ) || null;
};

/**
 * Beräkna progress för video
 */
export const calculateVideoProgress = (
  currentTime: number,
  duration: number
): number => {
  if (duration === 0) return 0;
  return Math.min(100, (currentTime / duration) * 100);
};

/**
 * Formatera tid för visning
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formatera duration
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }
  return formatTime(seconds);
};

/**
 * Beräkna total frågetid
 */
export const calculateTotalQuestionTime = (questions: QuestionTiming[]): number => {
  if (questions.length === 0) return 0;
  
  const lastQuestion = questions[questions.length - 1];
  return lastQuestion.endTime;
};

/**
 * Validera video metadata
 */
export const validateVideoMetadata = (metadata: any): metadata is VideoMetadata => {
  return (
    metadata &&
    typeof metadata.id === 'string' &&
    typeof metadata.uri === 'string' &&
    typeof metadata.duration === 'number' &&
    Array.isArray(metadata.questions) &&
    metadata.questions.every(validateQuestionTiming)
  );
};

/**
 * Validera question timing
 */
export const validateQuestionTiming = (timing: any): timing is QuestionTiming => {
  return (
    timing &&
    typeof timing.id === 'string' &&
    typeof timing.text === 'string' &&
    typeof timing.startTime === 'number' &&
    typeof timing.endTime === 'number' &&
    timing.startTime < timing.endTime
  );
};

/**
 * Sortera frågor efter tid
 */
export const sortQuestionsByTime = (questions: QuestionTiming[]): QuestionTiming[] => {
  return [...questions].sort((a, b) => a.startTime - b.startTime);
};

/**
 * Generera thumbnail timestamp
 */
export const getThumbnailTimestamp = (duration: number): number => {
  // Ta en frame vid 10% av videon
  return Math.min(1000, duration * 0.1 * 1000);
};

/**
 * Beräkna nästa fråga
 */
export const getNextQuestion = (
  questions: QuestionTiming[],
  currentTime: number
): QuestionTiming | null => {
  const sorted = sortQuestionsByTime(questions);
  return sorted.find(q => q.startTime > currentTime) || null;
};

/**
 * Beräkna föregående fråga
 */
export const getPreviousQuestion = (
  questions: QuestionTiming[],
  currentTime: number
): QuestionTiming | null => {
  const sorted = sortQuestionsByTime(questions);
  const previous = sorted.filter(q => q.endTime <= currentTime);
  return previous[previous.length - 1] || null;
};

/**
 * Skapa en tom metadata mall
 */
export const createEmptyMetadata = (): VideoMetadata => {
  return {
    id: '',
    uri: '',
    duration: 0,
    recordedAt: Date.now(),
    questions: [],
  };
};

/**
 * Exportera metadata för delning
 */
export const exportMetadataForSharing = (metadata: VideoMetadata): string => {
  const shareableData = {
    duration: metadata.duration,
    questions: metadata.questions.map(q => ({
      text: q.text,
      time: formatTime(q.startTime),
    })),
    recordedAt: new Date(metadata.recordedAt).toLocaleDateString(),
  };
  
  return JSON.stringify(shareableData, null, 2);
};