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
  const [modalVisible, setModalVisible] = useState(false);
  const [newPark, setNewPark] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
  });
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

  const handleAddPark = async () => {
    if (!user) return;

    if (!newPark.name || !newPark.address || !newPark.city || !newPark.state) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await parkService.createPark({
        ...newPark,
        owner: {
          userId: user.uid,
          name: user.displayName || "Unknown",
          contactEmail: user.email || "",
        },
        location: {
          address: `${newPark.address}, ${newPark.city}, ${newPark.state}`,
          coordinates: { latitude: 0, longitude: 0 }, // You'll want to add proper geocoding later
        },
        amenities: [],
        verificationStatus: "pending",
        documents: [],
      });
      setModalVisible(false);
      setNewPark({ name: "", address: "", city: "", state: "" });
      fetchParks(); // Refresh the parks list
      Alert.alert("Success", "Park added successfully");
    } catch (error) {
      console.error("Error adding park:", error);
      Alert.alert("Error", "Failed to add park");
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
        <Pressable onPress={() => setModalVisible(true)}>
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
            <View key={park.id} style={styles.parkCard}>
              <View>
                <Text style={styles.parkName}>{park.name}</Text>
                <Text style={styles.parkAddress}>{park.address}</Text>
                <Text style={styles.parkCity}>
                  {park.city}, {park.state}
                </Text>
              </View>
              <Pressable
                onPress={() => handleDeletePark(park.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add Park Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Park</Text>

            <TextInput
              style={styles.input}
              placeholder="Park Name"
              placeholderTextColor="#666"
              value={newPark.name}
              onChangeText={(text) =>
                setNewPark((prev) => ({ ...prev, name: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#666"
              value={newPark.address}
              onChangeText={(text) =>
                setNewPark((prev) => ({ ...prev, address: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#666"
              value={newPark.city}
              onChangeText={(text) =>
                setNewPark((prev) => ({ ...prev, city: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor="#666"
              value={newPark.state}
              onChangeText={(text) =>
                setNewPark((prev) => ({ ...prev, state: text }))
              }
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.addButton]}
                onPress={handleAddPark}
              >
                <Text style={styles.buttonText}>Add Park</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  parkCity: {
    color: "#666",
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#333",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#6c47ff",
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
