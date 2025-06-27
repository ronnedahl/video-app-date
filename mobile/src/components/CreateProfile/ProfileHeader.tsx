import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';

const { COLORS, SIZES, TEXT_SIZES } = PROFILE_CONSTANTS;

interface ProfileHeaderProps {
  title: string;
  onBack: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.PADDING,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: COLORS.WHITE,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: TEXT_SIZES.HEADER,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    width: 34,
  },
});