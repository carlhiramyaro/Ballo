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
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { EXPO_PUBLIC_API_URL } from "@env";

export default function AddPark() {
  const { getToken } = useAuth();
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
      if (!EXPO_PUBLIC_API_URL) {
        console.error("API URL is not configured");
        Alert.alert(
          "Configuration Error",
          "API URL is not set. Please check your environment configuration."
        );
        return;
      }

      console.log("API URL:", EXPO_PUBLIC_API_URL);
      const token = await getToken();
      console.log("Token obtained:", !!token);

      // Validate required fields
      if (!parkData.name || !parkData.address) {
        Alert.alert("Error", "Park name and address are required");
        return;
      }

      // Create the data structure expected by the backend
      const dataToSend = {
        name: parkData.name,
        location: {
          address: parkData.address,
          coordinates: {
            latitude: 0, // You might want to get real coordinates
            longitude: 0,
          },
        },
        amenities: parkData.amenities,
        contactEmail: parkData.contactEmail,
        phone: parkData.phone,
      };

      console.log("Sending data:", dataToSend);

      const response = await fetch(`${EXPO_PUBLIC_API_URL}/api/parks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      // Add these debug logs
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );
      const rawText = await response.text(); // Get raw response text
      console.log("Raw response:", rawText);

      // Try parsing the response only if it looks like JSON
      let responseData;
      try {
        responseData = JSON.parse(rawText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error("Server returned invalid JSON response");
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            `Failed to create park: ${response.status} ${response.statusText}`
        );
      }

      router.push("/(park-owner)/parks");
    } catch (error: any) {
      console.error("Detailed error:", error);
      Alert.alert(
        "Error",
        error.message ||
          "Failed to create park. Please check your internet connection and try again."
      );
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
