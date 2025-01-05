import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();

  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    try {
      if (!signIn) throw new Error("Sign in is not initialized");

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      if (!signIn) throw new Error("Sign in is not initialized");

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      console.log(result);
      alert("Password reset successfully");

      if (!result.createdSessionId) throw new Error("No session created");
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      <View style={styles.formContainer}>
        {!successfulCreation ? (
          <>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive a reset code
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                autoCapitalize="none"
                placeholder="Email"
                placeholderTextColor="#666"
                value={emailAddress}
                onChangeText={setEmailAddress}
                style={styles.inputField}
              />
            </View>

            <Pressable style={styles.button} onPress={onRequestReset}>
              <Text style={styles.buttonText}>Send Reset Email</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.title}>New Password</Text>
            <Text style={styles.subtitle}>
              Enter the code and your new password
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={code}
                placeholder="Verification Code"
                placeholderTextColor="#666"
                style={styles.inputField}
                onChangeText={setCode}
              />
              <TextInput
                placeholder="New Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputField}
              />
            </View>

            <Pressable style={styles.button} onPress={onReset}>
              <Text style={styles.buttonText}>Set New Password</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PwReset;
