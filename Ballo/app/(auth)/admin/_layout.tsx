import RoleProtectedRoute from "../../../components/RoleProtectedRoute";
import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <Stack>
        <Stack.Screen
          name="parks"
          options={{
            headerTitle: "Park Verification",
            headerShown: true,
          }}
        />
        {/* Add other admin screens here */}
      </Stack>
    </RoleProtectedRoute>
  );
}
