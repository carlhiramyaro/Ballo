import { View, Text } from "react-native";
import { useCustomAuth } from "../hooks/useAuth";
import { Redirect } from "expo-router";

type Props = {
  children: React.ReactNode;
  allowedRoles: ("user" | "park_owner" | "admin")[];
};

export default function RoleProtectedRoute({ children, allowedRoles }: Props) {
  const { isLoaded, userRole } = useCustomAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!allowedRoles.includes(userRole)) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}
