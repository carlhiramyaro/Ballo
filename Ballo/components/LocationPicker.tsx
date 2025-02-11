import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

interface LocationPickerProps {
  initialLocation?: {
    latitude: number;
    longitude: number;
  };
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  onClose: () => void;
}

export default function LocationPicker({
  initialLocation,
  onLocationSelect,
  onClose,
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || {
      latitude: 37.78825,
      longitude: -122.4324,
    }
  );

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = () => {
    onLocationSelect(selectedLocation);
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="white" />
        </Pressable>
        <Text style={styles.title}>Select Location</Text>
        <Pressable onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </Pressable>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          ...selectedLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
        userInterfaceStyle="dark"
      >
        <Marker coordinate={selectedLocation} />
      </MapView>

      <Text style={styles.instructions}>
        Tap on the map to select your park's location
      </Text>
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
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 5,
  },
  confirmButton: {
    backgroundColor: "#6c47ff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmText: {
    color: "white",
    fontWeight: "600",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 200,
  },
  instructions: {
    color: "white",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#111",
  },
});
