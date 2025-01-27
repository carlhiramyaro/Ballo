import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

interface UserData {
  uid: string;
  name: string;
  email: string;
  role: "user" | "park_owner";
  createdAt: Date;
}

export const userService = {
  // Create or update user data in Firestore
  async createUserData(userData: Partial<UserData>) {
    try {
      const userRef = doc(db, "users", userData.uid!);
      await setDoc(userRef, {
        ...userData,
        role: "user", // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating user data:", error);
      throw error;
    }
  },

  // Get user data from Firestore
  async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.exists() ? (userDoc.data() as UserData) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      throw error;
    }
  },

  async becomeParkOwner(uid: string): Promise<void> {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create the document if it doesn't exist
        await setDoc(userRef, {
          uid,
          role: "park_owner",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        // Update existing document
        await updateDoc(userRef, {
          role: "park_owner",
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  },
};
