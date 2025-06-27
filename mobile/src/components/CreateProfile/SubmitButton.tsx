import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';

const { COLORS, SIZES, TEXT_SIZES } = PROFILE_CONSTANTS;

interface SubmitButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  title: string;
  icon?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  onPress, 
  isLoading = false,
  disabled = false,
  title,
  icon = 'checkmark-circle'
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (isLoading || disabled) && styles.buttonDisabled
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.WHITE} />
      ) : (
        <>
          <Ionicons name={icon as any} size={24} color={COLORS.WHITE} />
          <Text style={styles.buttonText}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: SIZES.PADDING,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: TEXT_SIZES.BUTTON,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});