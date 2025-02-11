import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { parkService } from "../../services/parkService";
import { router } from "expo-router";

export default function Parks() {
  const [parks, setParks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  useEffect(() => {
    fetchParks();
  }, []);

  const fetchParks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userParks = await parkService.getOwnerParks(user.uid);
      setParks(userParks);
    } catch (error) {
      console.error("Error fetching parks:", error);
      Alert.alert("Error", "Failed to load parks");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePark = async (parkId: string) => {
    Alert.alert("Delete Park", "Are you sure you want to delete this park?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await parkService.deletePark(parkId);
            fetchParks(); // Refresh the parks list
          } catch (error) {
            console.error("Error deleting park:", error);
            Alert.alert("Error", "Failed to delete park");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>My Parks</Text>
        <Pressable onPress={() => router.push("/(park-owner)/add-park")}>
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      </View>

      {/* Parks List */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6c47ff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView style={styles.parksList}>
          {parks.map((park) => (
            <Pressable
              key={park.id}
              style={styles.parkCard}
              onPress={() => router.push(`/(park-owner)/${park.id}`)}
            >
              <View>
                <Text style={styles.parkName}>{park.name}</Text>
                <Text style={styles.parkAddress}>{park.location.address}</Text>
                <Text style={styles.parkStatus}>
                  Status: {park.verificationStatus}
                </Text>
              </View>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeletePark(park.id);
                }}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>
      )}
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
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#111",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  parksList: {
    padding: 20,
  },
  parkCard: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  parkName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  parkAddress: {
    color: "#888",
    marginTop: 5,
  },
  parkStatus: {
    color: "#666",
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
  },
});
