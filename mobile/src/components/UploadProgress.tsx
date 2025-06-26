import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  
} from 'react-native';
import { ApiService } from '../services/api';

interface Props {
  videoId: string;
  onComplete: () => void;
  onError: (error: string) => void;
}

export const UploadProgress: React.FC<Props> = ({ videoId, onComplete, onError }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const result = await ApiService.checkStatus(videoId);
        setProgress(result.progress);
        setStatus(result.status);

        if (result.status === 'completed') {
          onComplete();
        } else if (result.status === 'failed') {
          onError('Komprimering misslyckades');
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => clearInterval(interval);
  }, [videoId, onComplete, onError]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Komprimerar video...</Text>
      
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      
      <Text style={styles.progressText}>{progress}%</Text>
      
      {status === 'processing' && (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      )}
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