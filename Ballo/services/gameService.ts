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
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

  async getUpcomingGames(selectedDate?: string) {
    try {
      const gamesRef = collection(db, "games");
      let q;

      if (selectedDate) {
        q = query(
          gamesRef,
          where("date", "==", selectedDate),
          where("status", "==", "upcoming")
        );
      } else {
        q = query(gamesRef, where("status", "==", "upcoming"));
      }

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

  async joinGame(gameId: string, player: { userId: string; name: string }) {
    try {
      const gameRef = doc(db, "games", gameId);
      const gameDoc = await getDoc(gameRef);

      if (!gameDoc.exists()) {
        throw new Error("Game not found");
      }

      const gameData = gameDoc.data();
      if (gameData.currentPlayers.length >= gameData.maxPlayers) {
        throw new Error("Game is full");
      }

      if (
        gameData.currentPlayers.some((p: any) => p.userId === player.userId)
      ) {
        throw new Error("Already joined");
      }

      const playerData = {
        userId: player.userId,
        name: player.name,
        joinedAt: new Date().toISOString(),
      };

      await updateDoc(gameRef, {
        currentPlayers: arrayUnion(playerData),
      });

      console.log("Joined game with player data:", playerData);
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

  async getUserGames(userId: string) {
    try {
      const gamesRef = collection(db, "games");
      const q = query(gamesRef, where("status", "==", "upcoming"));

      const querySnapshot = await getDocs(q);
      const games = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Game)
      );

      const userGames = games.filter((game) =>
        game.currentPlayers.some((player) => player.userId === userId)
      );

      console.log("Found games:", userGames); // Debug log
      return userGames;
    } catch (error) {
      console.error("Error getting user games:", error);
      throw error;
    }
  },
};
