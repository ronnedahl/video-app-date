import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface DownloadProgressProps {
  progress: number;
  isDownloading: boolean;
}

export const DownloadProgress: React.FC<DownloadProgressProps> = ({
  progress,
  isDownloading,
}) => {
  if (!isDownloading) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laddar ner video...</Text>
      
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      
      <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBar: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  loader: {
    marginTop: 10,
  },
});