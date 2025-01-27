import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export interface Park {
  id?: string;
  name: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  owner: {
    userId: string;
    name: string;
    contactEmail: string;
    phone?: string;
  };
  amenities: string[];
  verificationStatus: "pending" | "verified" | "rejected";
  verificationNotes?: string;
  documents: {
    type: "ownership_proof" | "license" | "insurance";
    url: string;
    uploadedAt: Date;
  }[];
  operatingHours?: {
    [key: string]: { open: string; close: string };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = "parks";

export const parkService = {
  // Create a new park
  async createPark(parkData: Omit<Park, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...parkData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating park:", error);
      throw error;
    }
  },

  // Get park by ID
  async getPark(parkId: string): Promise<Park | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, parkId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Park;
      }
      return null;
    } catch (error) {
      console.error("Error getting park:", error);
      throw error;
    }
  },

  // Get parks by owner ID
  async getParksByOwner(userId: string): Promise<Park[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("owner.userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Park[];
    } catch (error) {
      console.error("Error getting owner parks:", error);
      throw error;
    }
  },

  // Get pending verification parks (for admin)
  async getPendingParks(): Promise<Park[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("verificationStatus", "==", "pending")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Park[];
    } catch (error) {
      console.error("Error getting pending parks:", error);
      throw error;
    }
  },

  // Update park verification status
  async updateVerificationStatus(
    parkId: string,
    status: "pending" | "verified" | "rejected",
    notes?: string
  ): Promise<void> {
    try {
      const parkRef = doc(db, COLLECTION_NAME, parkId);
      await updateDoc(parkRef, {
        verificationStatus: status,
        verificationNotes: notes,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating verification status:", error);
      throw error;
    }
  },
};
