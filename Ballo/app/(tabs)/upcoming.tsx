import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { gameService } from "../../services/gameService";
import { Ionicons } from "@expo/vector-icons";

interface Game {
  id?: string;
  parkName: string;
  date: string;
  time: string;
  maxPlayers: number;
  currentPlayers: Array<{
    userId: string;
    name: string;
  }>;
  level: string;
  status: string;
}

export default function UpcomingGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  useEffect(() => {
    fetchUserGames();
  }, []);

  const fetchUserGames = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userGames = await gameService.getUserGames(user.uid);
      // Sort games by date and time
      const sortedGames = userGames.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      setGames(sortedGames);
    } catch (error) {
      console.error("Error fetching user games:", error);
      Alert.alert("Error", "Failed to load your games");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>My Upcoming Games</Text>
      </View>

      <ScrollView style={styles.content}>
        {games.length > 0 ? (
          games.map((game) => (
            <Pressable
              key={game.id}
              style={styles.gameCard}
              onPress={() => router.push(`/game/${game.id}`)}
            >
              <View style={styles.gameHeader}>
                <Text style={styles.parkName}>{game.parkName}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{game.status}</Text>
                </View>
              </View>

              <View style={styles.gameDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#888" />
                  <Text style={styles.detailText}>{game.date}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#888" />
                  <Text style={styles.detailText}>{game.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={16} color="#888" />
                  <Text style={styles.detailText}>
                    {game.currentPlayers.length}/{game.maxPlayers} players
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="basketball-outline" size={16} color="#888" />
                  <Text style={styles.detailText}>{game.level}</Text>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="basketball-outline" size={48} color="#666" />
            <Text style={styles.emptyStateText}>
              You haven't joined any games yet
            </Text>
            <Pressable
              style={styles.findGamesButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.findGamesButtonText}>Find Games</Text>
            </Pressable>
          </View>
        )}
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
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
  },
  content: {
    padding: 15,
  },
  gameCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  parkName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#6c47ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  gameDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    color: "#888",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    gap: 16,
  },
  emptyStateText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  findGamesButton: {
    backgroundColor: "#6c47ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  findGamesButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
