import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';

const { COLORS, SIZES, TEXT_SIZES } = PROFILE_CONSTANTS;

interface GenderSelectorProps {
  value: string;
  onChange: (gender: string) => void;
  error?: string;
}

const genderOptions = ['Man', 'Kvinna', 'Annat'];

export const GenderSelector: React.FC<GenderSelectorProps> = ({ 
  value, 
  onChange, 
  error 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kön *</Text>
      <View style={styles.buttonsContainer}>
        {genderOptions.map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[
              styles.button,
              value === gender && styles.buttonActive
            ]}
            onPress={() => onChange(gender)}
          >
            <Text style={[
              styles.buttonText,
              value === gender && styles.buttonTextActive
            ]}>
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.MARGIN_BOTTOM,
  },
  label: {
    fontSize: TEXT_SIZES.LABEL,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: SIZES.BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  buttonText: {
    fontSize: TEXT_SIZES.INPUT,
    color: COLORS.TEXT_SECONDARY,
  },
  buttonTextActive: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: TEXT_SIZES.ERROR,
    marginTop: 5,
  },
});