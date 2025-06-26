import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VideoCompleteProps {
  onPreview: () => void;
  onDownload: () => void;
  onNewRecording: () => void;
  onShowGallery: () => void;
  hasDownloaded: boolean;
}

export const VideoComplete: React.FC<VideoCompleteProps> = ({
  onPreview,
  onDownload,
  onNewRecording,
  onShowGallery,
  hasDownloaded,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      </View>
      
      <Text style={styles.title}>Video klar!</Text>
      <Text style={styles.subtitle}>
        Din video har komprimerats och sparats på servern
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.galleryButton]} 
          onPress={onPreview}
        >
          <Ionicons name="play-circle-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Se video</Text>
        
            
        </TouchableOpacity>
      
        <TouchableOpacity
        style={[styles.button, styles.previewButton]} 
        onPress={onShowGallery}
        >
         <Ionicons name="images-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Se Galleri</Text>
          
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.downloadButton]} 
          onPress={onDownload}
          disabled={hasDownloaded}
        >
          <Ionicons 
            name={hasDownloaded ? "checkmark-circle" : "download-outline"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.buttonText}>
            {hasDownloaded ? 'Sparad' : 'Spara i galleri'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.newButton]} 
          onPress={onNewRecording}
        >
          <Ionicons name="camera-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Ny inspelning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
  },
  previewButton: {
    backgroundColor: '#2196F3',
  },
  galleryButton: {
    backgroundColor: '#9C27B0', // Lila färg för galleri
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
  },
  newButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});