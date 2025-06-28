import React, { useCallback, memo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Hooks
import { useProfileForm } from '../../hooks/useProfileForm';
import { ProfileFormData } from '../../types/profile'; // Anpassa sökvägen om den är annorlunda

// Components
import { ProfileHeader } from './ProfileHeader';
import { VideoPreview } from './VideoPreview';
import { GenderSelector } from './GenderSelector';
import { FormInput } from './FormInput';
import { SubmitButton } from './SubmitButton';
import { FormSection } from './FormSection';

// Constants & Utils
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';
import { getPlaceholders } from '../../utils/profileFormUtils';

const { COLORS, SIZES } = PROFILE_CONSTANTS;

interface CreateProfileScreenProps {
  videoUri: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ProfileFormProps {
  formData: ProfileFormData; // Använd din importerade typ, inte 'any'!
  formErrors: Partial<ProfileFormData>; // Partial<> är perfekt för felobjekt, då inte alla fält måste ha ett fel samtidigt.
  updateField: (field: keyof ProfileFormData, value: string) => void; // HÄR ÄR DEN KORREKTA, SPECIFIKA TYPEN!
}

// Memoized form component för bättre prestanda
const ProfileForm = memo(({ 
  formData, 
  formErrors, 
  updateField 
}: ProfileFormProps) => { // <-- ÄNDRING HÄR! Använd det nya interfacet.
  const placeholders = getPlaceholders();
  
  return (
    <View style={styles.form}>
      {/* Grundläggande information */}
      <FormSection title="Grundläggande information">
        <GenderSelector
          value={formData.gender}
          onChange={(value) => updateField('gender', value)}
          error={formErrors.gender}
        />

        <FormInput
          label="Ålder"
          value={formData.age}
          onChangeText={(text) => updateField('age', text)}
          error={formErrors.age}
          placeholder={placeholders.age}
          keyboardType="numeric"
          maxLength={3}
        />

        <FormInput
          label="Plats"
          value={formData.location}
          onChangeText={(text) => updateField('location', text)}
          error={formErrors.location}
          placeholder={placeholders.location}
        />
      </FormSection>

      {/* Om dig */}
      <FormSection title="Om dig">
        <FormInput
          label="Yrke"
          value={formData.occupation}
          onChangeText={(text) => updateField('occupation', text)}
          error={formErrors.occupation}
          placeholder={placeholders.occupation}
        />

        <FormInput
          label="Intressen"
          value={formData.interests}
          onChangeText={(text) => updateField('interests', text)}
          error={formErrors.interests}
          placeholder={placeholders.interests}
          multiline
          numberOfLines={3}
        />

        <FormInput
          label="Om mig"
          value={formData.about}
          onChangeText={(text) => updateField('about', text)}
          error={formErrors.about}
          placeholder={placeholders.about}
          multiline
          numberOfLines={4}
        />
      </FormSection>
    </View>
  );
});

ProfileForm.displayName = 'ProfileForm';

export const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({
  videoUri,
  onSuccess,
  onCancel,
}) => {
  const {
    formData,
    formErrors,
    isSaving,
    updateField,
    handleSubmit,
  } = useProfileForm();

  const onSubmit = useCallback(() => {
    handleSubmit(videoUri, onSuccess);
  }, [handleSubmit, videoUri, onSuccess]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ProfileHeader title="Skapa din profil" onBack={onCancel} />

        {/* Video Preview */}
        <VideoPreview videoUri={videoUri} />

        {/* Form */}
        <ProfileForm
          formData={formData}
          formErrors={formErrors}
          updateField={updateField}
        />

        {/* Submit Button */}
        <SubmitButton
          title="Spara profil"
          onPress={onSubmit}
          isLoading={isSaving}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  form: {
    padding: SIZES.PADDING,
  },
});