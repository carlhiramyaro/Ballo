import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Find Games",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "My Games",
          tabBarIcon: ({ color }) => (
            <Ionicons name="basketball" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
