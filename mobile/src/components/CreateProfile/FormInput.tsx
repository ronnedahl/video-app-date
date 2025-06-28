import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';

const { COLORS, SIZES, TEXT_SIZES } = PROFILE_CONSTANTS;

interface FormInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label,
  value,
  onChangeText,
  error,
  required = true,
  multiline = false,
  numberOfLines = 1,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && '*'}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'auto'}
        {...textInputProps}
      />
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
  input: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: 15,
    fontSize: TEXT_SIZES.INPUT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: TEXT_SIZES.ERROR,
    marginTop: 5,
  },
});