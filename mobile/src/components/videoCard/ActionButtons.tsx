import React, { memo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SwipeAction } from '../../types/dating';

interface ActionButtonsProps {
  onSwipe: (action: SwipeAction) => void;
}

interface ButtonConfig {
  action: SwipeAction;
  icon: string;
  size: number;
  color: string;
}

const buttons: ButtonConfig[] = [
  { action: 'dislike', icon: 'close', size: 35, color: '#FF4458' },
  { action: 'superlike', icon: 'star', size: 30, color: '#44D884' },
  { action: 'like', icon: 'heart', size: 35, color: '#1EC71E' },
  { action: 'boost', icon: 'flash', size: 30, color: '#9C39FF' },
];

// Optimerad button komponent
const ActionButton = memo(({ 
  button, 
  onPress 
}: { 
  button: ButtonConfig; 
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Ionicons 
      name={button.icon as any} 
      size={button.size} 
      color={button.color} 
    />
  </TouchableOpacity>
));

// Huvudkomponent med memo för att undvika onödiga re-renders
export const ActionButtons = memo<ActionButtonsProps>(({ onSwipe }) => {
  // Memoize callbacks för varje knapp
  const handlePress = useCallback((action: SwipeAction) => {
    onSwipe(action);
  }, [onSwipe]);

  return (
    <View style={styles.container}>
      {buttons.map((button) => (
        <ActionButton
          key={button.action}
          button={button}
          onPress={() => handlePress(button.action)}
        />
      ))}
    </View>
  );
});

ActionButtons.displayName = 'ActionButtons';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 3,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});