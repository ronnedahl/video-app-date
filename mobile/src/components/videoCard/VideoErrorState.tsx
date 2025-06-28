import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VideoErrorStateProps {
  error?: any;
}

export const VideoErrorState: React.FC<VideoErrorStateProps> = ({ error }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={50} color="#fff" />
      <Text style={styles.text}>Kunde inte ladda videon</Text>
      {error && (
        <Text style={styles.errorDetail}>{error.message || 'Okänt fel'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 3,
    padding: 20,
  },
  text: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  errorDetail: {
    color: '#999',
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
});