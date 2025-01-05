import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

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
      {/* Header */}
      <View style={{ padding: 20, paddingTop: 60, backgroundColor: "#111" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Ionicons name="football-outline" size={24} color="white" />
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
