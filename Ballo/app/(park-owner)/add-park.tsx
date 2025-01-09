import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { API_URL } from "@env";

export default function AddPark() {
  const { getToken } = useAuth();
  const [parkData, setParkData] = useState({
    name: "",
    address: "",
    amenities: [] as string[],
  });

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/parks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parkData),
      });

      if (response.ok) {
        router.back();
      } else {
        throw new Error("Failed to create park");
      }
    } catch (error) {
      console.error("Error creating park:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
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
});
