import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { User, LoginCredentials, SignupCredentials } from '../types/auth';

export class AuthService {
  /**
   * Konvertera Firebase user till vår User typ
   */
  private static mapFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      createdAt: firebaseUser.metadata.creationTime
    };
  }

  /**
   * Logga in med email och lösenord
   */
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Registrera ny användare
   */
  static async signup(credentials: SignupCredentials): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      // Uppdatera display name om det finns
      if (credentials.displayName) {
        await updateProfile(userCredential.user, {
          displayName: credentials.displayName
        });
      }

      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logga ut
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Lyssna på auth state changes
   */
  static subscribeToAuthChanges(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? this.mapFirebaseUser(firebaseUser) : null);
    });
  }

  /**
   * Hantera Firebase auth errors
   */
  private static handleAuthError(error: any): Error {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'E-postadressen används redan',
      'auth/invalid-email': 'Ogiltig e-postadress',
      'auth/operation-not-allowed': 'Operationen är inte tillåten',
      'auth/weak-password': 'Lösenordet är för svagt',
      'auth/user-disabled': 'Användarkontot har inaktiverats',
      'auth/user-not-found': 'Ingen användare hittades',
      'auth/wrong-password': 'Fel lösenord',
      'auth/invalid-credential': 'Ogiltiga inloggningsuppgifter',
      'auth/network-request-failed': 'Nätverksfel - kontrollera din internetanslutning'
    };

    const message = errorMessages[error.code] || error.message || 'Ett okänt fel uppstod';
    return new Error(message);
  }
}