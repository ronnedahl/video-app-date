import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '../config/firebaseConfig';
import { UserProfile } from '../types/profile';

export class ProfileService {
  /**
   * Hämta användarprofil från Firestore
   */
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Kunde inte hämta profil');
    }
  }

  /**
   * Spara användarprofil till Firestore
   */
  static async saveProfile(userId: string, profile: UserProfile): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, {
        ...profile,
        updatedAt: serverTimestamp(),
      });

      // Spara också video-referens i videos subcollection (inte separat collection)
      if (profile.videoURL) {
        await this.saveVideoReference(userId, profile.videoURL);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      throw new Error('Kunde inte spara profil');
    }
  }

  /**
   * Uppdatera användarprofil
   */
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Kunde inte uppdatera profil');
    }
  }

  /**
   * Ladda upp profilvideo till Firebase Storage
   */
  static async uploadProfileVideo(userId: string, videoUri: string): Promise<string> {
    try {
      // Läs video som blob
      const response = await fetch(videoUri);
      const blob = await response.blob();
      
      // Skapa unik filnamn
      const timestamp = Date.now();
      const filename = `profile-videos/${userId}/video-${timestamp}.mp4`;
      
      // Ladda upp till Firebase Storage
      const storageRef = ref(storage, filename);
      const snapshot = await uploadBytes(storageRef, blob);
      
      // Hämta download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Kunde inte ladda upp video');
    }
  }

  /**
   * Spara video-referens i videos subcollection
   */
  private static async saveVideoReference(userId: string, videoURL: string): Promise<void> {
    try {
      const videosRef = collection(db, 'users', userId, 'videos');
      await addDoc(videosRef, {
        videoURL,
        type: 'profile',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      // Detta är inte kritiskt, logga bara felet
      console.log('Note: Could not save video reference (check Firestore rules)');
    }
  }

  /**
   * Kontrollera om användare redan har en profil
   */
  static async hasProfile(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId);
      return profile !== null && !!profile.videoURL;
    } catch (error) {
      return false;
    }
  }
}