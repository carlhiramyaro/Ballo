import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { parkService } from "../../services/parkService";
import { gameService } from "../../services/gameService";
import { useAuth } from "../../contexts/AuthContext";

export default function ParkDetail() {
  const { id } = useLocalSearchParams();
  const [park, setPark] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  useEffect(() => {
    fetchParkAndGames();
  }, [id]);

  const fetchParkAndGames = async () => {
    try {
      setLoading(true);
      const parkData = await parkService.getPark(id as string);
      setPark(parkData);

      const parkGames = await gameService.getParkGames(id as string);
      setGames(parkGames);
    } catch (error) {
      console.error("Error fetching park details:", error);
      Alert.alert("Error", "Failed to load park details");
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

  if (!park) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Park not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>{park.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Park Details</Text>
          <View style={styles.detailCard}>
            <Text style={styles.detailText}>
              Address: {park.location.address}
            </Text>
            <Text style={styles.detailText}>
              Status: {park.verificationStatus}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Games</Text>
            <Pressable
              style={styles.addButton}
              onPress={() =>
                router.push({
                  pathname: `/park-owner/${id}/add-game`,
                  params: { parkName: park.name },
                })
              }
            >
              <Text style={styles.addButtonText}>Add Game</Text>
            </Pressable>
          </View>

          {games.length > 0 ? (
            games.map((game) => (
              <View key={game.id} style={styles.gameCard}>
                <Text style={styles.gameTitle}>
                  {game.date} at {game.time}
                </Text>
                <Text style={styles.gameDetail}>
                  Players: {game.currentPlayers.length}/{game.maxPlayers}
                </Text>
                <Text style={styles.gameDetail}>Level: {game.level}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noGamesText}>No upcoming games</Text>
          )}
        </View>
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
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  detailCard: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
  },
  detailText: {
    color: "#888",
    marginBottom: 8,
  },
  gameCard: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  gameTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  gameDetail: {
    color: "#888",
    marginBottom: 3,
  },
  addButton: {
    backgroundColor: "#6c47ff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
  },
  noGamesText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});
