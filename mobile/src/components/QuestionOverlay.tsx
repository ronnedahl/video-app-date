import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

interface QuestionOverlayProps {
  question: string;
  questionIndex: number;
  totalQuestions: number;
  isVisible: boolean;
}

export const QuestionOverlay: React.FC<QuestionOverlayProps> = ({
  question,
  questionIndex,
  totalQuestions,
  isVisible,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [question, isVisible, fadeAnim]);

  if (!isVisible || !question) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim },
      ]}
    >
      <View style={styles.questionBox}>
        <Text style={styles.questionNumber}>
          Fråga {questionIndex + 1} av {totalQuestions}
        </Text>
        <Text style={styles.questionText}>{question}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '20%',
    left: 20,
    right: 20,
    zIndex: 10,
  },
  questionBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  questionNumber: {
    color: '#4CAF50',
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  questionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 26,
  },
});