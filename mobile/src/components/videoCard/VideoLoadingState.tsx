import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export const VideoLoadingState: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.text}>Laddar video...</Text>
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
  },
  text: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
});