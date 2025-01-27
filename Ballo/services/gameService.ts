import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  getDoc,
} from "firebase/firestore";

export interface Game {
  id?: string;
  parkId: string;
  parkName: string;
  date: string;
  time: string;
  maxPlayers: number;
  currentPlayers: {
    userId: string;
    name: string;
    joinedAt: Date;
  }[];
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  status: "upcoming" | "in-progress" | "completed" | "cancelled";
  description?: string;
  price?: number;
  createdBy: {
    userId: string;
    name: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export const gameService = {
  async createGame(gameData: Omit<Game, "id" | "createdAt" | "updatedAt">) {
    try {
      const gamesRef = collection(db, "games");
      const newGame = {
        ...gameData,
        currentPlayers: [],
        status: "upcoming",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(gamesRef, newGame);
      return { id: docRef.id, ...newGame };
    } catch (error) {
      console.error("Error creating game:", error);
      throw error;
    }
  },

  async getParkGames(parkId: string) {
    try {
      const gamesRef = collection(db, "games");
      const q = query(
        gamesRef,
        where("parkId", "==", parkId),
        where("status", "==", "upcoming")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Game[];
    } catch (error) {
      console.error("Error getting games:", error);
      throw error;
    }
  },

  async getUpcomingGames() {
    try {
      const gamesRef = collection(db, "games");
      const q = query(
        gamesRef,
        where("status", "==", "upcoming"),
        where("date", ">=", new Date().toISOString().split("T")[0])
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Game[];
    } catch (error) {
      console.error("Error getting upcoming games:", error);
      throw error;
    }
  },

  async joinGame(gameId: string, userData: { userId: string; name: string }) {
    try {
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, {
        currentPlayers: [
          ...(await this.getGame(gameId)).currentPlayers,
          {
            ...userData,
            joinedAt: new Date(),
          },
        ],
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error joining game:", error);
      throw error;
    }
  },

  async leaveGame(gameId: string, userId: string) {
    try {
      const game = await this.getGame(gameId);
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, {
        currentPlayers: game.currentPlayers.filter(
          (player) => player.userId !== userId
        ),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error leaving game:", error);
      throw error;
    }
  },

  async getGame(gameId: string): Promise<Game> {
    const gameRef = doc(db, "games", gameId);
    const gameDoc = await getDoc(gameRef);
    if (!gameDoc.exists()) {
      throw new Error("Game not found");
    }
    return { id: gameDoc.id, ...gameDoc.data() } as Game;
  },

  async cancelGame(gameId: string) {
    try {
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, {
        status: "cancelled",
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error cancelling game:", error);
      throw error;
    }
  },
};
