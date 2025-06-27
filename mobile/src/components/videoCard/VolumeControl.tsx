import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VolumeControlProps {
  isMuted: boolean;
  onToggle: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({ isMuted, onToggle }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onToggle}>
      <Ionicons 
        name={isMuted ? "volume-mute" : "volume-high"} 
        size={24} 
        color="#fff" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
});