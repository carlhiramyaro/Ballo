import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { View, ActivityIndicator } from "react-native";

const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      // Handle error silently
    }
  },
};

const InitialLayout = () => {
  console.log("Work starts");
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    console.log("usee effect");

    const inTabsGroup = segments[0] === "(auth)";

    console.log("Auth state:", {
      isLoaded,
      isSignedIn,
      inTabsGroup,
      segments: segments.join("/"),
    });

    if (isSignedIn && !inTabsGroup) {
      router.replace("/(auth)/home");
    } else if (!isSignedIn) {
      router.replace("/(public)/login");
    }
  }, [isLoaded, isSignedIn, segments]);

  // Show a loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Don't render anything until we do the first navigation
  if (!segments.includes("(auth)") && !segments.includes("(public)")) {
    return null;
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <InitialLayout />
    </ClerkProvider>
  );
}
