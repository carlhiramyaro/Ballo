import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { parkService } from "../../services/parkService";
import { auth } from "../../firebaseConfig";

export default function AddPark() {
  const router = useRouter();
  const [parkData, setParkData] = useState({
    name: "",
    address: "",
    amenities: [] as string[],
    location: {
      address: "",
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    },
    contactEmail: "",
    phone: "",
  });

  const handleSubmit = async () => {
    try {
      if (!auth.currentUser) {
        Alert.alert("Error", "You must be logged in to create a park");
        return;
      }

      if (!parkData.name || !parkData.address) {
        Alert.alert("Error", "Park name and address are required");
        return;
      }

      const newPark = {
        name: parkData.name,
        location: {
          address: parkData.address,
          coordinates: {
            latitude: 0, // You might want to get real coordinates
            longitude: 0,
          },
        },
        owner: {
          userId: auth.currentUser.uid,
          name: auth.currentUser.displayName || "Unknown",
          contactEmail: parkData.contactEmail || auth.currentUser.email || "",
          phone: parkData.phone,
        },
        amenities: parkData.amenities,
        verificationStatus: "pending" as const,
        documents: [],
      };

      await parkService.createPark(newPark);
      router.push("/(park-owner)/parks");
    } catch (error) {
      console.error("Error creating park:", error);
      Alert.alert("Error", "Failed to create park. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Add New Park</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Park Name</Text>
          <TextInput
            style={styles.input}
            value={parkData.name}
            onChangeText={(text) =>
              setParkData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Enter park name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={parkData.address}
            onChangeText={(text) =>
              setParkData((prev) => ({ ...prev, address: text }))
            }
            placeholder="Enter park address"
            placeholderTextColor="#666"
          />
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Park</Text>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#111",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
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
    marginBottom: 10,
  },
  backButtonText: {
    color: "#6c47ff",
    fontSize: 16,
  },
});
