import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { API_URL } from "@env";
import { useAuth } from "@clerk/clerk-expo";

interface Park {
  _id: string;
  name: string;
  location: {
    address: string;
  };
  verificationStatus: string;
}

export default function ParksManagement() {
  const [parks, setParks] = useState<Park[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchMyParks();
  }, []);

  const fetchMyParks = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/parks/my-parks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setParks(data);
    } catch (error) {
      console.error("Error fetching parks:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Parks</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/park-owner/add-park")}
        >
          <Text style={styles.addButtonText}>Add Park</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.parksList}>
        {parks.map((park) => (
          <Pressable
            key={park._id}
            style={styles.parkItem}
            onPress={() => router.push(`/park-owner/park/${park._id}`)}
          >
            <Text style={styles.parkName}>{park.name}</Text>
            <Text style={styles.parkAddress}>{park.location.address}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    park.verificationStatus === "verified"
                      ? "#4CAF50"
                      : "#FFC107",
                },
              ]}
            >
              <Text style={styles.statusText}>{park.verificationStatus}</Text>
            </View>
          </Pressable>
        ))}

        {parks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              You haven't added any parks yet.
            </Text>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#111",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  addButton: {
    backgroundColor: "#6c47ff",
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
  },
  parksList: {
    flex: 1,
    padding: 15,
  },
  parkItem: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  parkName: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  parkAddress: {
    color: "#888",
    marginTop: 5,
  },
  statusBadge: {
    position: "absolute",
    right: 15,
    top: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyStateText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});
