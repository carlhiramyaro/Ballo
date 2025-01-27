import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";

// Token cache
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Initial auth state handler
function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inPublicGroup = segments[0] === "(public)";
    const inParkOwnerGroup = segments[0] === "(park-owner)";

    if (isSignedIn && !inAuthGroup && !inParkOwnerGroup) {
      // Redirect to home if user is signed in and not in the (auth) or (park-owner) group
      router.replace("/home");
    } else if (!isSignedIn && !inPublicGroup) {
      // Redirect to login if user is not signed in and not in the (public) group
      router.replace("/login");
    }
  }, [isSignedIn, segments, isLoaded]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(park-owner)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(park-owner)" />
        </Stack>
      </ClerkProvider>
    </AuthProvider>
  );
}
