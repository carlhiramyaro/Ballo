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
  deleteDoc,
} from "firebase/firestore";

export interface Park {
  id?: string;
  name: string;
  location: {
    address: string;
    coordinates?: {
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
  async createPark(parkData: Omit<Park, "id" | "createdAt" | "updatedAt">) {
    try {
      const parksRef = collection(db, COLLECTION_NAME);
      const newPark = {
        ...parkData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(parksRef, newPark);
      return { id: docRef.id, ...newPark };
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
  async getOwnerParks(ownerId: string) {
    try {
      const parksRef = collection(db, COLLECTION_NAME);
      const q = query(parksRef, where("owner.userId", "==", ownerId));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Park[];
    } catch (error) {
      console.error("Error getting parks:", error);
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

  async deletePark(parkId: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, parkId));
    } catch (error) {
      console.error("Error deleting park:", error);
      throw error;
    }
  },

  async updatePark(parkId: string, parkData: Partial<Park>) {
    try {
      const parkRef = doc(db, COLLECTION_NAME, parkId);
      await updateDoc(parkRef, {
        ...parkData,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating park:", error);
      throw error;
    }
  },
};
