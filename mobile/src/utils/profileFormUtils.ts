// utils/profileFormUtils.ts

import { Keyboard } from 'react-native';
import { ProfileFormData } from '../types/profile';

/**
 * Stänger tangentbordet
 */
export const dismissKeyboard = () => {
  Keyboard.dismiss();
};

/**
 * Formaterar formulärdata innan sparning
 */
export const formatFormData = (data: ProfileFormData): ProfileFormData => {
  return {
    gender: data.gender.trim(),
    age: data.age.trim(),
    location: data.location.trim(),
    occupation: data.occupation.trim(),
    interests: data.interests.trim(),
    about: data.about.trim(),
  };
};

/**
 * Kontrollerar om formuläret har ändringar
 */
export const hasFormChanges = (
  currentData: ProfileFormData, 
  initialData: ProfileFormData
): boolean => {
  return Object.keys(currentData).some(
    key => currentData[key as keyof ProfileFormData] !== initialData[key as keyof ProfileFormData]
  );
};

/**
 * Räknar antal ifyllda fält
 */
export const countFilledFields = (data: ProfileFormData): number => {
  return Object.values(data).filter(value => value.trim().length > 0).length;
};

/**
 * Beräknar formulärets completion percentage
 */
export const calculateFormCompletion = (data: ProfileFormData): number => {
  const totalFields = Object.keys(data).length;
  const filledFields = countFilledFields(data);
  return Math.round((filledFields / totalFields) * 100);
};

/**
 * Genererar placeholder texter
 */
export const getPlaceholders = (): Record<keyof ProfileFormData, string> => {
  return {
    gender: 'Välj ditt kön',
    age: 'Din ålder',
    location: 'T.ex. Stockholm',
    occupation: 'Vad jobbar du med?',
    interests: 'T.ex. Träning, matlagning, resor',
    about: 'Berätta lite om dig själv...',
  };
};

/**
 * Keyboard type för olika fält
 */
export const getKeyboardType = (field: keyof ProfileFormData): string => {
  switch (field) {
    case 'age':
      return 'numeric';
    default:
      return 'default';
  }
};

/**
 * Max längd för olika fält
 */
export const getMaxLength = (field: keyof ProfileFormData): number | undefined => {
  switch (field) {
    case 'age':
      return 3;
    case 'about':
      return 500;
    case 'interests':
      return 200;
    default:
      return undefined;
  }
};