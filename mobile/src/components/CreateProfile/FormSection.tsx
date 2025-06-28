import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';

const { COLORS, SIZES, TEXT_SIZES } = PROFILE_CONSTANTS;

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.MARGIN_BOTTOM,
  },
  title: {
    fontSize: TEXT_SIZES.LABEL + 2,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
  },
});