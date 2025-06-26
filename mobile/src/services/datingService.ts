import { 
  collection, 
  query, 
  getDocs, 
  doc,
  setDoc,
  getDoc,
  orderBy,
  limit,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { DatingProfile, SwipeRecord, SwipeAction, Match } from '../types/dating';

export class DatingService {
  /**
   * Hämta profiler för dating (exkluderar inloggad användare och redan swipade)
   */
  static async getProfiles(currentUserId: string, excludeIds: string[] = []): Promise<DatingProfile[]> {
    try {
      // Enklare query utan flera orderBy
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('createdAt', 'desc'),
        limit(50) // Hämta fler för att kunna filtrera lokalt
      );

      const snapshot = await getDocs(q);
      
      const profiles: DatingProfile[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Filtrera bort current user, profiler utan video och redan swipade
        if (doc.id !== currentUserId && 
            data.videoURL && 
            !excludeIds.includes(doc.id)) {
          profiles.push({
            id: doc.id,
            email: data.email || '',
            name: data.name,
            gender: data.gender,
            age: data.age,
            location: data.location,
            occupation: data.occupation,
            interests: data.interests,
            about: data.about,
            videoURL: data.videoURL,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        }
      });

      // Begränsa till 20 profiler efter filtrering
      return profiles.slice(0, 20);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw new Error('Kunde inte hämta profiler');
    }
  }

  /**
   * Spara swipe action
   */
  static async saveSwipe(
    userId: string, 
    targetUserId: string, 
    action: SwipeAction
  ): Promise<void> {
    try {
      const swipeData: SwipeRecord = {
        userId,
        targetUserId,
        action,
        timestamp: new Date().toISOString(),
      };

      // Spara i användarens swipe-historik
      const swipeRef = doc(
        db, 
        'users', 
        userId, 
        'swipes', 
        targetUserId
      );
      
      await setDoc(swipeRef, swipeData);

      // Om det är en like, kolla om det blir en match
      if (action === 'like' || action === 'superlike') {
        await this.checkForMatch(userId, targetUserId);
      }
    } catch (error) {
      console.error('Error saving swipe:', error);
      throw new Error('Kunde inte spara swipe');
    }
  }

  /**
   * Kolla om det blir en match
   */
  private static async checkForMatch(
    userId: string, 
    targetUserId: string
  ): Promise<boolean> {
    try {
      // Kolla om target har gillat tillbaka
      const targetSwipeRef = doc(
        db, 
        'users', 
        targetUserId, 
        'swipes', 
        userId
      );
      
      const targetSwipe = await getDoc(targetSwipeRef);
      
      if (targetSwipe.exists()) {
        const data = targetSwipe.data() as SwipeRecord;
        if (data.action === 'like' || data.action === 'superlike') {
          // Det är en match!
          await this.createMatch(userId, targetUserId);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking for match:', error);
      return false;
    }
  }

  /**
   * Skapa en match
   */
  private static async createMatch(userId1: string, userId2: string): Promise<void> {
    try {
      const matchData: Omit<Match, 'id'> = {
        users: [userId1, userId2].sort(), // Sortera för konsistens
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'matches'), {
        ...matchData,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating match:', error);
    }
  }

  /**
   * Hämta användarens swipe-historik
   */
  static async getSwipeHistory(userId: string): Promise<string[]> {
    try {
      const swipesRef = collection(db, 'users', userId, 'swipes');
      const snapshot = await getDocs(swipesRef);
      
      const swipedUserIds: string[] = [];
      snapshot.forEach((doc) => {
        swipedUserIds.push(doc.id);
      });
      
      return swipedUserIds;
    } catch (error) {
      console.error('Error fetching swipe history:', error);
      return [];
    }
  }
}