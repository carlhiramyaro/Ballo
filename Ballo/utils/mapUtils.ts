import { Platform, Linking } from "react-native";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const openDirections = (
  coordinates: Coordinates | undefined,
  address: string
) => {
  const encodedAddress = encodeURIComponent(address);

  if (coordinates) {
    if (Platform.OS === "ios") {
      // Apple Maps with coordinates
      const url = `maps://?daddr=${coordinates.latitude},${coordinates.longitude}`;
      Linking.openURL(url);
    } else {
      // Google Maps with coordinates
      const url = `google.navigation:q=${coordinates.latitude},${coordinates.longitude}`;
      Linking.openURL(url).catch(() => {
        // Fallback to web Google Maps if app isn't installed
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`
        );
      });
    }
  } else {
    // Fallback to address search
    if (Platform.OS === "ios") {
      Linking.openURL(`maps://?daddr=${encodedAddress}`);
    } else {
      Linking.openURL(`google.navigation:q=${encodedAddress}`).catch(() => {
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
        );
      });
    }
  }
};
