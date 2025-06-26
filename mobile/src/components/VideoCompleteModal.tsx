import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width: screenWidth } = Dimensions.get('window');

interface VideoCompleteModalProps {
  visible: boolean;
  onClose: () => void;
  onNewRecording: () => void;
  onCreateProfile: () => void;
}

export const VideoCompleteModal: React.FC<VideoCompleteModalProps> = ({
  visible,
  onClose,
  onNewRecording,
  onCreateProfile,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Vad vill du göra?</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {/* Create Profile Option */}
            <TouchableOpacity
              style={[styles.optionCard, styles.profileCard]}
              onPress={onCreateProfile}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="person-add" size={40} color="#fff" />
              </View>
              <Text style={styles.optionTitle}>Skapa profil</Text>
              <Text style={styles.optionDescription}>
                Använd denna video för din profil
              </Text>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* New Recording Option */}
            <TouchableOpacity
              style={[styles.optionCard, styles.recordCard]}
              onPress={onNewRecording}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="camera" size={40} color="#fff" />
              </View>
              <Text style={styles.optionTitle}>Ny inspelning</Text>
              <Text style={styles.optionDescription}>
                Spela in en annan video
              </Text>
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Avbryt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: screenWidth - 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  optionsContainer: {
    gap: 15,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    position: 'relative',
  },
  profileCard: {
    backgroundColor: '#4CAF50',
  },
  recordCard: {
    backgroundColor: '#2196F3',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  arrowContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
});