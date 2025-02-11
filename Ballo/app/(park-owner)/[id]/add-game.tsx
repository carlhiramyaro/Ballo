import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { gameService, Game } from "../../../services/gameService";
import { useAuth } from "../../../contexts/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { parkService } from "../../../services/parkService";

export default function AddGame() {
  const { id } = useLocalSearchParams();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const [park, setPark] = useState<any>(null);

  const [gameData, setGameData] = useState({
    date: new Date(),
    time: new Date(),
    maxPlayers: "",
    level: "All Levels",
    description: "",
    price: "",
  });

  useEffect(() => {
    const fetchPark = async () => {
      try {
        const parkData = await parkService.getPark(id as string);
        setPark(parkData);
      } catch (error) {
        console.error("Error fetching park:", error);
        Alert.alert("Error", "Failed to load park details");
      }
    };
    fetchPark();
  }, [id]);

  const handleSubmit = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "You must be logged in to create a game");
        return;
      }

      if (!gameData.maxPlayers) {
        Alert.alert("Error", "Please specify maximum number of players");
        return;
      }

      if (!park) {
        Alert.alert("Error", "Park information not found");
        return;
      }

      const newGame = {
        parkId: id as string,
        parkName: park.name,
        date: gameData.date.toISOString().split("T")[0],
        time: gameData.time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        maxPlayers: parseInt(gameData.maxPlayers),
        level: gameData.level as Game["level"],
        description: gameData.description,
        price: gameData.price ? parseFloat(gameData.price) : undefined,
        currentPlayers: [],
        createdBy: {
          userId: user.uid,
          name: user.displayName || "Unknown",
        },
        status: "upcoming" as const,
        parkLocation: {
          address: park.location.address,
          coordinates: park.location.coordinates,
        },
      };

      await gameService.createGame(newGame);
      Alert.alert("Success", "Game created successfully");
      router.back();
    } catch (error) {
      console.error("Error creating game:", error);
      Alert.alert("Error", "Failed to create game");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Create New Game</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <DateTimePicker
            value={gameData.date}
            mode="date"
            onChange={(event, selectedDate) => {
              setGameData((prev) => ({
                ...prev,
                date: selectedDate || prev.date,
              }));
            }}
            themeVariant="dark"
            textColor="white"
            style={styles.dateTimePicker}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time</Text>
          <DateTimePicker
            value={gameData.time}
            mode="time"
            onChange={(event, selectedDate) => {
              setGameData((prev) => ({
                ...prev,
                time: selectedDate || prev.time,
              }));
            }}
            themeVariant="dark"
            textColor="white"
            style={styles.dateTimePicker}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Maximum Players</Text>
          <TextInput
            style={styles.input}
            value={gameData.maxPlayers}
            onChangeText={(text) =>
              setGameData((prev) => ({ ...prev, maxPlayers: text }))
            }
            keyboardType="numeric"
            placeholder="Enter max players"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Level</Text>
          <Picker
            selectedValue={gameData.level}
            onValueChange={(value) =>
              setGameData((prev) => ({ ...prev, level: value }))
            }
            style={styles.picker}
          >
            <Picker.Item label="All Levels" value="All Levels" />
            <Picker.Item label="Beginner" value="Beginner" />
            <Picker.Item label="Intermediate" value="Intermediate" />
            <Picker.Item label="Advanced" value="Advanced" />
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={gameData.description}
            onChangeText={(text) =>
              setGameData((prev) => ({ ...prev, description: text }))
            }
            placeholder="Enter game description"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (Optional)</Text>
          <TextInput
            style={styles.input}
            value={gameData.price}
            onChangeText={(text) =>
              setGameData((prev) => ({ ...prev, price: text }))
            }
            keyboardType="numeric"
            placeholder="Enter price"
            placeholderTextColor="#666"
          />
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Game</Text>
        </Pressable>
      </View>
    </ScrollView>
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
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 15,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    backgroundColor: "#111",
    color: "white",
  },
  submitButton: {
    backgroundColor: "#6c47ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    padding: 5,
  },
  dateTimePicker: {
    backgroundColor: "#111",
    height: 50,
    marginTop: 5,
  },
});
