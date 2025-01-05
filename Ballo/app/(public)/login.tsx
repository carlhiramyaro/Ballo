import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
  Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor="#666"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
          />
        </View>

        <Pressable style={styles.loginButton} onPress={onSignInPress}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </Pressable>

        <View style={styles.linksContainer}>
          <Link href="/reset" asChild>
            <Pressable>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </Link>
          <Link href="/register" asChild>
            <Pressable>
              <Text style={styles.link}>Create Account</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
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
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#111",
    color: "white",
  },
  loginButton: {
    backgroundColor: "#6c47ff",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  link: {
    color: "#6c47ff",
    fontSize: 14,
  },
});

export default Login;
