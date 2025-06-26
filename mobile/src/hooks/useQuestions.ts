import { useState, useEffect, useCallback } from 'react';
import { getRandomQuestions  } from '../utils/questions';

const QUESTION_DURATION = 3333; // ~3.3 sekunder per fråga för 20 sekunder totalt

interface UseQuestionsReturn {
  currentQuestion: string;
  questionIndex: number;
  totalQuestions: number;
  nextQuestion: () => void;
  resetQuestions: () => void;
  startAutoAdvance: () => NodeJS.Timeout;
}

export const useQuestions = (): UseQuestionsReturn => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Initiera frågor när komponenten mountas
    const initialQuestions = getRandomQuestions(undefined, 6);
    setQuestions(initialQuestions);
  }, []);

  const nextQuestion = useCallback(() => {
    if (questions.length === 0) return;

    setCurrentQuestionIndex(prev => {
      const nextIndex = prev + 1;
      return nextIndex >= questions.length ? 0 : nextIndex;
    });
  }, [questions]);

  const resetQuestions = useCallback(() => {
    const newQuestions = getRandomQuestions(undefined, 6);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
  }, []);

  const startAutoAdvance = useCallback(() => {
    setIsRecording(true);
    const interval = setInterval(() => {
      nextQuestion();
    }, QUESTION_DURATION);

    // Stoppa efter 20 sekunder
    setTimeout(() => {
      clearInterval(interval);
      setIsRecording(false);
    }, 20000);

    return interval;
  }, [nextQuestion]);

  return {
    currentQuestion: questions[currentQuestionIndex] || '',
    questionIndex: currentQuestionIndex,
    totalQuestions: questions.length,
    nextQuestion,
    resetQuestions,
    startAutoAdvance
  };
};