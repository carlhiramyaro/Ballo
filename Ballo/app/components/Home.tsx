import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import { userService } from "../../services/userService";
import { gameService } from "../../services/gameService";
import { Game } from "../../services/gameService"; // Import Game type

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const { signOut, getCurrentUser } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  const [userRole, setUserRole] = useState<"user" | "park_owner">("user");

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
      router.replace("/(public)/sign-in");
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

  // Fetch games when date changes
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        // Format the date to match our storage format (YYYY-MM-DD)
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const gamesData = await gameService.getUpcomingGames(formattedDate);
        setGames(gamesData);
      } catch (error) {
        console.error("Error fetching games:", error);
        Alert.alert(
          "Error",
          "Unable to load games. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [selectedDate]);

  // Add this useEffect to fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userData = await userService.getUserData(user.uid);
          if (userData) {
            setUserRole(userData.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  // Update handleBecomeParkOwner function
  const handleBecomeParkOwner = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "You must be logged in to become a park owner");
        return;
      }

      // Show confirmation dialog
      Alert.alert(
        "Become a Park Owner",
        "Would you like to register as a park owner? This will allow you to manage parks and create games.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes, Continue",
            onPress: async () => {
              try {
                await userService.becomeParkOwner(user.uid);
                setUserRole("park_owner");
                Alert.alert(
                  "Success",
                  "You are now registered as a park owner!"
                );
                toggleMenu();
              } catch (error) {
                console.error("Error becoming park owner:", error);
                Alert.alert(
                  "Error",
                  "Could not update user role. Please try again."
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Could not process your request. Please try again.");
    }
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
              <Text style={{ color: "white", fontSize: 24 }}>
                {user?.displayName?.[0] || "U"}
              </Text>
            </View>
            <Text style={{ color: "white", fontSize: 20, marginLeft: 15 }}>
              {user?.displayName || "User"}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={{ padding: 20 }}>
          {/* Upcoming Games Option */}
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
            onPress={() => {
              toggleMenu();
              router.push("/(tabs)/upcoming");
            }}
          >
            <Ionicons name="calendar-outline" size={24} color="white" />
            <Text style={{ color: "white", fontSize: 18, marginLeft: 15 }}>
              Upcoming Games
            </Text>
          </Pressable>

          {/* Existing Park Owner Option */}
          {userRole === "user" ? (
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
              onPress={handleBecomeParkOwner}
            >
              <Ionicons name="business-outline" size={24} color="white" />
              <Text style={{ color: "white", fontSize: 18, marginLeft: 15 }}>
                Become a Park Owner
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
              onPress={() => {
                toggleMenu();
                router.push("/(park-owner)/parks");
              }}
            >
              <Ionicons name="business-outline" size={24} color="white" />
              <Text style={{ color: "white", fontSize: 18, marginLeft: 15 }}>
                Manage Parks
              </Text>
            </Pressable>
          )}

          {/* Sign Out Option */}
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

      {/* Rest of your existing JSX remains the same */}
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
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6c47ff"
            style={{ marginTop: 20 }}
          />
        ) : games.length > 0 ? (
          games.map((game) => (
            <Pressable
              key={game.id}
              style={{
                backgroundColor: "#111",
                margin: 10,
                padding: 15,
                borderRadius: 10,
              }}
              onPress={() => router.push(`/game/${game.id}`)}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                {game.parkName}
              </Text>
              <Text style={{ color: "#888", marginTop: 5 }}>
                {game.time} • {game.maxPlayers - game.currentPlayers.length}{" "}
                spots left
              </Text>
              <Text style={{ color: "#666", marginTop: 5 }}>
                Level: {game.level}
              </Text>
            </Pressable>
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
