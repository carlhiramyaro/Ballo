import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

export default function BecomeParkOwner() {
  const { user } = useUser();
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    taxId: "",
    phoneNumber: "",
  });

  const handleSubmit = async () => {
    try {
      // Update user metadata in Clerk
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: "park_owner",
          businessInfo,
        },
      });

      router.push("/park-management");
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Become a Park Owner</Text>
      {/* Add your form fields here */}
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Application</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6c47ff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
