import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useProfileStore } from '../stores/profileStore';
import { ProfileFormData } from '../types/profile';

interface CreateProfileScreenProps {
  videoUri: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({
  videoUri,
  onSuccess,
  onCancel,
}) => {
  const { saveProfile, isSaving, error } = useProfileStore();
  
  // Skapa video player för preview
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.muted = true;
    player.pause(); // Starta pausad
  });

  const [formData, setFormData] = useState<ProfileFormData>({
    gender: '',
    age: '',
    location: '',
    occupation: '',
    interests: '',
    about: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<ProfileFormData>>({});

  // Cleanup player när komponenten unmountas
  useEffect(() => {
    return () => {
      player.release();
    };
  }, [player]);

  const validateForm = (): boolean => {
    const errors: Partial<ProfileFormData> = {};
    
    if (!formData.gender.trim()) errors.gender = 'Kön är obligatoriskt';
    if (!formData.age.trim()) errors.age = 'Ålder är obligatorisk';
    if (!formData.location.trim()) errors.location = 'Plats är obligatorisk';
    if (!formData.occupation.trim()) errors.occupation = 'Yrke är obligatoriskt';
    if (!formData.interests.trim()) errors.interests = 'Intressen är obligatoriska';
    if (!formData.about.trim()) errors.about = 'Om mig är obligatoriskt';
    
    // Validera ålder
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      errors.age = 'Ange en giltig ålder (18-100)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Formulärfel', 'Vänligen fyll i alla obligatoriska fält korrekt');
      return;
    }

    const success = await saveProfile(formData, videoUri);
    if (success) {
      Alert.alert('Profil skapad!', 'Din profil har sparats', [
        { text: 'OK', onPress: onSuccess }
      ]);
    } else {
      Alert.alert('Fel', error || 'Kunde inte spara profil');
    }
  };

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Rensa fel när användaren börjar skriva
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleVideoPress = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

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
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Skapa din profil</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Video Preview */}
        <TouchableOpacity 
          style={styles.videoContainer}
          onPress={handleVideoPress}
          activeOpacity={0.8}
        >
          <VideoView
            style={styles.video}
            player={player}
            nativeControls={false}
            contentFit="cover"
          />
          <View style={styles.videoOverlay}>
            <Ionicons name="play-circle" size={50} color="rgba(255,255,255,0.8)" />
          </View>
        </TouchableOpacity>

        {/* Form */}
        <View style={styles.form}>
          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kön *</Text>
            <View style={styles.genderContainer}>
              {['Man', 'Kvinna', 'Annat'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    formData.gender === gender && styles.genderButtonActive
                  ]}
                  onPress={() => updateField('gender', gender)}
                >
                  <Text style={[
                    styles.genderButtonText,
                    formData.gender === gender && styles.genderButtonTextActive
                  ]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {formErrors.gender && <Text style={styles.errorText}>{formErrors.gender}</Text>}
          </View>

          {/* Age */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ålder *</Text>
            <TextInput
              style={[styles.input, formErrors.age && styles.inputError]}
              value={formData.age}
              onChangeText={(text) => updateField('age', text)}
              placeholder="Din ålder"
              keyboardType="numeric"
              maxLength={3}
            />
            {formErrors.age && <Text style={styles.errorText}>{formErrors.age}</Text>}
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plats *</Text>
            <TextInput
              style={[styles.input, formErrors.location && styles.inputError]}
              value={formData.location}
              onChangeText={(text) => updateField('location', text)}
              placeholder="T.ex. Stockholm"
            />
            {formErrors.location && <Text style={styles.errorText}>{formErrors.location}</Text>}
          </View>

          {/* Occupation */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yrke *</Text>
            <TextInput
              style={[styles.input, formErrors.occupation && styles.inputError]}
              value={formData.occupation}
              onChangeText={(text) => updateField('occupation', text)}
              placeholder="Vad jobbar du med?"
            />
            {formErrors.occupation && <Text style={styles.errorText}>{formErrors.occupation}</Text>}
          </View>

          {/* Interests */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Intressen *</Text>
            <TextInput
              style={[styles.input, styles.textArea, formErrors.interests && styles.inputError]}
              value={formData.interests}
              onChangeText={(text) => updateField('interests', text)}
              placeholder="T.ex. Träning, matlagning, resor"
              multiline
              numberOfLines={3}
            />
            {formErrors.interests && <Text style={styles.errorText}>{formErrors.interests}</Text>}
          </View>

          {/* About */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Om mig *</Text>
            <TextInput
              style={[styles.input, styles.textArea, formErrors.about && styles.inputError]}
              value={formData.about}
              onChangeText={(text) => updateField('about', text)}
              placeholder="Berätta lite om dig själv..."
              multiline
              numberOfLines={4}
            />
            {formErrors.about && <Text style={styles.errorText}>{formErrors.about}</Text>}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.submitButtonText}>Spara profil</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  videoContainer: {
    height: 200,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#666',
  },
  genderButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});