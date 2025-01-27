import { Stack } from "expo-router";

export default function ParkIdLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add-game" options={{ headerShown: false }} />
    </Stack>
  );
}
