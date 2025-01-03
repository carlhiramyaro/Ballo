import { View, Text, ActivityIndicator } from "react-native";

const StartPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Hello</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default StartPage;
