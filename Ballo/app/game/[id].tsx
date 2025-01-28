import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { gameService } from "../../services/gameService";
import { useAuth } from "../../contexts/AuthContext";

interface Player {
  userId: string;
  name: string;
}

interface Game {
  parkName: string;
  date: string;
  time: string;
  level: string;
  maxPlayers: number;
  currentPlayers: Player[];
  price?: number;
  description?: string;
}

export default function GameDetail() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  useEffect(() => {
    fetchGameDetails();
  }, [id]);

  const fetchGameDetails = async () => {
    try {
      const gameData = await gameService.getGame(id as string);
      setGame(gameData);
    } catch (error) {
      console.error("Error fetching game details:", error);
      Alert.alert("Error", "Failed to load game details");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "Please sign in to join games");
        return;
      }

      if (!game) {
        Alert.alert("Error", "Game not found");
        return;
      }

      if (game.currentPlayers.some((player) => player.userId === user.uid)) {
        Alert.alert("Error", "You have already joined this game");
        return;
      }

      if (game.currentPlayers.length >= game.maxPlayers) {
        Alert.alert("Error", "Game is already full");
        return;
      }

      await gameService.joinGame(id as string, {
        userId: user.uid,
        name: user.displayName || "Anonymous",
      });

      Alert.alert("Success", "You have joined the game!");
      fetchGameDetails(); // Refresh game details
    } catch (error) {
      console.error("Error joining game:", error);
      Alert.alert("Error", "Failed to join game");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Game Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.gameInfo}>
          <Text style={styles.parkName}>{game.parkName}</Text>
          <Text style={styles.gameDetail}>Date: {game.date}</Text>
          <Text style={styles.gameDetail}>Time: {game.time}</Text>
          <Text style={styles.gameDetail}>Level: {game.level}</Text>
          <Text style={styles.gameDetail}>
            Spots Available: {game.maxPlayers - game.currentPlayers.length} of{" "}
            {game.maxPlayers}
          </Text>
          {game.price && (
            <Text style={styles.gameDetail}>Price: ${game.price}</Text>
          )}
          {game.description && (
            <Text style={styles.description}>{game.description}</Text>
          )}
        </View>

        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Players</Text>
          {game.currentPlayers.map((player, index) => (
            <View key={player.userId} style={styles.playerItem}>
              <Text style={styles.playerName}>{player.name}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={[
            styles.joinButton,
            game.currentPlayers.some((player) => player.userId === user?.uid) &&
              styles.joinedButton,
          ]}
          onPress={handleJoinGame}
          disabled={game.currentPlayers.some(
            (player) => player.userId === user?.uid
          )}
        >
          <Text style={styles.joinButtonText}>
            {game.currentPlayers.some((player) => player.userId === user?.uid)
              ? "Already Joined"
              : "Join Game"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#111",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  gameInfo: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  parkName: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 15,
  },
  gameDetail: {
    color: "#888",
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    color: "#666",
    fontSize: 14,
    marginTop: 10,
  },
  playersSection: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  playerItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  playerName: {
    color: "#888",
    fontSize: 16,
  },
  joinButton: {
    backgroundColor: "#6c47ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  joinedButton: {
    backgroundColor: "#333",
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});
