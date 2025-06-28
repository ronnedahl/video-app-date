import { useState } from 'react';
import { Alert } from 'react-native';
import { ProfileFormData } from '../types/profile';
import { validateProfileForm, ValidationErrors } from '../utils/profileValidation';
import { useProfileStore } from '../stores/profileStore';

interface UseProfileFormReturn {
  formData: ProfileFormData;
  formErrors: ValidationErrors;
  isSaving: boolean;
  updateField: (field: keyof ProfileFormData, value: string) => void;
  handleSubmit: (videoUri: string, onSuccess: () => void) => Promise<void>;
  clearErrors: () => void;
}

export const useProfileForm = (): UseProfileFormReturn => {
  const { saveProfile, isSaving, error } = useProfileStore();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    gender: '',
    age: '',
    location: '',
    occupation: '',
    interests: '',
    about: '',
  });

  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Rensa fel för detta fält när användaren börjar skriva
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const clearErrors = () => {
    setFormErrors({});
  };

  const handleSubmit = async (videoUri: string, onSuccess: () => void) => {
    // Validera formulär
    const errors = validateProfileForm(formData);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Alert.alert('Formulärfel', 'Vänligen fyll i alla obligatoriska fält korrekt');
      return;
    }

    // Spara profil
    const success = await saveProfile(formData, videoUri);
    
    if (success) {
      Alert.alert('Profil skapad!', 'Din profil har sparats', [
        { text: 'OK', onPress: onSuccess }
      ]);
    } else {
      Alert.alert('Fel', error || 'Kunde inte spara profil');
    }
  };

  return {
    formData,
    formErrors,
    isSaving,
    updateField,
    handleSubmit,
    clearErrors,
  };
};