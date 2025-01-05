import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
} from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

// Dummy data for available games
const dummyGames = {
  "2024-03-07": [
    {
      id: 1,
      location: "Central Park Field",
      time: "18:00",
      playersNeeded: 4,
      level: "Intermediate",
    },
    {
      id: 2,
      location: "Riverside Soccer Complex",
      time: "19:30",
      playersNeeded: 2,
      level: "Advanced",
    },
  ],
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current; // Start menu off-screen
  const { signOut } = useAuth();

  const toggleMenu = () => {
    const toValue = menuVisible ? -300 : 0;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Generate week dates
  const getWeekDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Slide-out Menu */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 300,
          backgroundColor: "#111",
          zIndex: 100,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {/* User Profile Section */}
        <View
          style={{
            padding: 20,
            paddingTop: 60,
            borderBottomWidth: 1,
            borderBottomColor: "#333",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#333",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 24 }}>U</Text>
            </View>
            <Text style={{ color: "white", fontSize: 20, marginLeft: 15 }}>
              User
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={{ padding: 20 }}>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={() => {}}
          >
            <Ionicons name="football-outline" size={24} color="white" />
            <Text style={{ color: "white", fontSize: 18, marginLeft: 15 }}>
              Games
            </Text>
          </Pressable>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={{ color: "white", fontSize: 18, marginLeft: 15 }}>
              Sign Out
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Overlay when menu is open */}
      {menuVisible && (
        <Pressable
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 99,
          }}
          onPress={toggleMenu}
        />
      )}

      {/* Header - Update the football icon to toggle menu */}
      <View style={{ padding: 20, paddingTop: 60, backgroundColor: "#111" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable onPress={toggleMenu}>
            <Ionicons name="football-outline" size={24} color="white" />
          </Pressable>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
            Open Games
          </Text>
          <Ionicons name="filter" size={24} color="white" />
        </View>
      </View>

      {/* Calendar Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: "#111" }}
      >
        {getWeekDates().map((date, index) => (
          <Pressable
            key={index}
            style={{
              padding: 15,
              alignItems: "center",
              backgroundColor:
                date.toDateString() === selectedDate.toDateString()
                  ? "#333"
                  : "transparent",
              borderRadius: 10,
              margin: 5,
            }}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={{ color: "#888" }}>
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </Text>
            <Text style={{ color: "white", fontSize: 18, marginTop: 5 }}>
              {date.getDate()}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Search Bar */}
      <View style={{ padding: 15, backgroundColor: "#111" }}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#222",
            borderRadius: 10,
            padding: 10,
            alignItems: "center",
          }}
        >
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search Games"
            placeholderTextColor="#666"
            style={{ color: "white", marginLeft: 10, flex: 1 }}
          />
        </View>
      </View>

      {/* Games List */}
      <ScrollView style={{ flex: 1 }}>
        {dummyGames["2024-03-07"] ? (
          dummyGames["2024-03-07"].map((game) => (
            <View
              key={game.id}
              style={{
                backgroundColor: "#111",
                margin: 10,
                padding: 15,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                {game.location}
              </Text>
              <Text style={{ color: "#888", marginTop: 5 }}>
                {game.time} • {game.playersNeeded} players needed
              </Text>
              <Text style={{ color: "#666", marginTop: 5 }}>
                Level: {game.level}
              </Text>
            </View>
          ))
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 40,
            }}
          >
            <Text style={{ color: "#666", fontSize: 16 }}>
              No open games on this day... yet :)
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
