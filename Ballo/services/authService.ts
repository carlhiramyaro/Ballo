import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { userService } from "./userService";

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update profile with name
      await updateProfile(user, { displayName: name });

      // Create initial user document in Firestore
      await userService.createUserData({
        uid: user.uid,
        name,
        email,
        role: "user",
        createdAt: new Date(),
      });

      return user;
    } catch (error: any) {
      console.error("Error signing up:", error);
      throw new Error(error.message);
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: any) {
      console.error("Error signing in:", error);
      throw new Error(error.message);
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Error signing out:", error);
      throw new Error(error.message);
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      throw new Error(error.message);
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Subscribe to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
