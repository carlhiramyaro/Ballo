import { Stack } from "expo-router";

export default function ParkOwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="parks" />
    </Stack>
  );
}
