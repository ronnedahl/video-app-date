import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';

const { COLORS, TEXT_SIZES } = PROFILE_CONSTANTS;

interface FormProgressProps {
  progress: number; // 0-100
  filledFields: number;
  totalFields: number;
}

export const FormProgress: React.FC<FormProgressProps> = ({ 
  progress, 
  filledFields, 
  totalFields 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Formulär komplett</Text>
        <Text style={styles.percentage}>{progress}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progress}%` }
          ]} 
        />
      </View>
      <Text style={styles.fieldsText}>
        {filledFields} av {totalFields} fält ifyllda
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: TEXT_SIZES.LABEL,
    color: COLORS.TEXT_SECONDARY,
  },
  percentage: {
    fontSize: TEXT_SIZES.LABEL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.BORDER,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
  },
  fieldsText: {
    fontSize: TEXT_SIZES.ERROR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});